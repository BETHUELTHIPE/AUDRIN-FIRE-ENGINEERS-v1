import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { documentDatabase } from './server/documentDatabase';
import { PdfWatermarkEngine } from './server/pdfWatermarkEngine';
import { PdfDocumentBuilder } from './server/pdfDocumentBuilder';
import { StatutoryDocumentStatus, WatermarkOptions } from './server/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parsers with generous limits for PDF payloads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logger for API endpoints
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[API] ${req.method} ${req.path} - ${new Date().toISOString()}`);
    }
    next();
  });

  // ==========================================
  // 1. HEALTH & SYSTEM DIAGNOSTICS
  // ==========================================
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Audrin Statutory Compliance Engine & PDF Watermarking Service',
      version: '2.4.0',
      standard: 'SANS 10139 / SANS 10400-T',
      databaseStats: documentDatabase.getStats(),
      serverTime: new Date().toISOString()
    });
  });

  // ==========================================
  // 2. DOCUMENT DATABASE APIS
  // ==========================================

  // List all compliance documents in the database
  app.get('/api/documents', (req, res) => {
    try {
      const documents = documentDatabase.getAllDocuments();
      const stats = documentDatabase.getStats();
      res.json({
        success: true,
        stats,
        documents
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Retrieve single document by ID
  app.get('/api/documents/:id', (req, res) => {
    try {
      const doc = documentDatabase.getDocumentById(req.params.id);
      if (!doc) {
        return res.status(404).json({ success: false, error: `Document ${req.params.id} not found in database.` });
      }
      res.json({ success: true, document: doc });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update statutory status of document in the database (e.g. Draft <-> Issued)
  app.post('/api/documents/:id/status', (req, res) => {
    try {
      const { status, actor, reason } = req.body;
      if (!status || !['Draft', 'Issued'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: "Invalid status. Allowed values in database are 'Draft' or 'Issued'."
        });
      }

      const updated = documentDatabase.updateDocumentStatus(
        req.params.id,
        status as StatutoryDocumentStatus,
        actor || 'Authorized Staff',
        reason
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: `Document ${req.params.id} not found in database.`
        });
      }

      console.log(`[DB] Document ${updated.documentNumber} status updated to: ${status}`);

      res.json({
        success: true,
        message: `Document statutory status successfully updated to ${status}.`,
        document: updated,
        renderPdfUrl: `/api/pdf/render/${updated.id}`
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Client synchronization endpoint to register documents from the frontend store
  app.post('/api/documents/sync', (req, res) => {
    try {
      const { documents } = req.body;
      if (!Array.isArray(documents)) {
        return res.status(400).json({ success: false, error: 'Expected documents array.' });
      }

      const syncedDocs = documents.map(d => documentDatabase.upsertDocument(d));
      res.json({
        success: true,
        message: `Successfully synchronized ${syncedDocs.length} documents with server database.`,
        stats: documentDatabase.getStats()
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 3. SERVER-SIDE PDF WATERMARKING UTILITY
  // ==========================================

  /**
   * POST /api/pdf/watermark
   * 
   * Dynamically applies 'DRAFT' or 'ISSUED' watermark overlay to a PDF.
   * Resolves the statutory status directly from the database when documentId is provided,
   * guaranteeing that unissued documents are stamped with DRAFT warnings and officially
   * approved documents receive the ISSUED compliance seal.
   */
  app.post('/api/pdf/watermark', async (req, res) => {
    try {
      const {
        documentId,
        pdfBase64,
        overrideStatus,
        customNote,
        applyDiagonalWatermark,
        applyTopBanner,
        applyBottomFooter,
        applyCornerBadge
      } = req.body;

      let targetDoc = documentId ? documentDatabase.getDocumentById(documentId) : undefined;
      let rawPdfBytes: Uint8Array | Buffer;

      if (pdfBase64) {
        // Use client-provided PDF buffer
        rawPdfBytes = Buffer.from(pdfBase64, 'base64');
      } else if (targetDoc) {
        // Generate base PDF from database document record
        rawPdfBytes = await PdfDocumentBuilder.buildDocumentPdf(targetDoc);
      } else {
        return res.status(400).json({
          success: false,
          error: 'Either documentId (referencing a database record) or pdfBase64 must be provided.'
        });
      }

      // Determine statutory status from database or explicit override
      let resolvedStatus: StatutoryDocumentStatus = 'Draft';
      if (overrideStatus && ['Draft', 'Issued'].includes(overrideStatus)) {
        resolvedStatus = overrideStatus as StatutoryDocumentStatus;
      } else if (targetDoc) {
        resolvedStatus = targetDoc.status;
      }

      const watermarkOpts: WatermarkOptions = {
        status: resolvedStatus,
        documentNumber: targetDoc?.documentNumber || req.body.documentNumber || 'SANS-DOC-10139',
        documentType: targetDoc?.documentType || 'SANS_10139_COC',
        siteName: targetDoc?.siteName || req.body.siteName,
        organisationName: targetDoc?.organisationName || req.body.organisationName,
        commissionerName: targetDoc?.commissionerName || req.body.commissionerName,
        commissionerSaqccNumber: targetDoc?.commissionerSaqccNumber || req.body.commissionerSaqccNumber,
        checksum: targetDoc?.checksumSha256,
        customNote,
        applyDiagonalWatermark: applyDiagonalWatermark !== false,
        applyTopBanner: applyTopBanner !== false,
        applyBottomFooter: applyBottomFooter !== false,
        applyCornerBadge: applyCornerBadge !== false,
      };

      const { watermarkedBytes, result } = await PdfWatermarkEngine.applyWatermark(
        rawPdfBytes,
        watermarkOpts
      );

      console.log(`[WATERMARK] Stamped ${result.documentNumber} with [${result.watermarkApplied}] based on database status: ${resolvedStatus} (${result.latencyMs}ms)`);

      // Check if client expects raw binary stream
      const wantsBinary = req.query.format === 'binary' || req.headers.accept === 'application/pdf';
      if (wantsBinary) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${result.filename}"`);
        res.setHeader('Content-Length', watermarkedBytes.byteLength);
        res.setHeader('X-Watermark-Status', result.watermarkApplied);
        res.setHeader('X-Document-Database-Status', resolvedStatus);
        res.setHeader('X-Document-SHA256', result.sha256Checksum);
        return res.send(Buffer.from(watermarkedBytes));
      }

      // Return comprehensive JSON payload with base64 encoded watermarked PDF
      res.json({
        success: true,
        documentId: targetDoc?.id || documentId || 'custom',
        resolvedDatabaseStatus: resolvedStatus,
        watermarkApplied: result.watermarkApplied,
        result,
        renderUrl: targetDoc ? `/api/pdf/render/${targetDoc.id}` : null,
        pdfBase64: Buffer.from(watermarkedBytes).toString('base64')
      });
    } catch (err: any) {
      console.error('[WATERMARK ERROR]', err);
      res.status(500).json({
        success: false,
        error: `Server-side watermarking error: ${err.message}`
      });
    }
  });

  /**
   * GET /api/pdf/render/:id
   * 
   * Directly streams the dynamically watermarked PDF for a database document.
   * Ideal for browser iframes, new-tab views, and instant download buttons.
   */
  app.get('/api/pdf/render/:id', async (req, res) => {
    try {
      const doc = documentDatabase.getDocumentById(req.params.id);
      if (!doc) {
        return res.status(404).send(`Document ${req.params.id} not found in database.`);
      }

      // Check for test override query param (?overrideStatus=Draft | Issued)
      const overrideStatus = req.query.overrideStatus as string;
      const statusToApply: StatutoryDocumentStatus = 
        (overrideStatus === 'Draft' || overrideStatus === 'Issued')
          ? overrideStatus
          : doc.status;

      // Build base PDF from database record
      const basePdfBytes = await PdfDocumentBuilder.buildDocumentPdf(doc);

      // Dynamically apply watermark based on database status
      const { watermarkedBytes, result } = await PdfWatermarkEngine.applyWatermark(
        basePdfBytes,
        {
          status: statusToApply,
          documentNumber: doc.documentNumber,
          documentType: doc.documentType,
          siteName: doc.siteName,
          organisationName: doc.organisationName,
          commissionerName: doc.commissionerName,
          commissionerSaqccNumber: doc.commissionerSaqccNumber,
          checksum: doc.checksumSha256
        }
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${result.filename}"`);
      res.setHeader('Content-Length', watermarkedBytes.byteLength);
      res.setHeader('X-Watermark-Status', result.watermarkApplied);
      res.setHeader('X-Database-Status', doc.status);
      res.setHeader('X-SHA256-Checksum', result.sha256Checksum);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      res.send(Buffer.from(watermarkedBytes));
    } catch (err: any) {
      console.error('[RENDER ERROR]', err);
      res.status(500).send(`Failed to render watermarked PDF: ${err.message}`);
    }
  });

  /**
   * POST /api/pdf/batch-watermark
   * 
   * Batch processes multiple compliance documents from the database, applying
   * the appropriate 'DRAFT' or 'ISSUED' watermark to each based on its database state.
   */
  app.post('/api/pdf/batch-watermark', async (req, res) => {
    try {
      const { documentIds } = req.body;
      const allDocs = documentDatabase.getAllDocuments();
      const targetDocs = Array.isArray(documentIds) && documentIds.length > 0
        ? allDocs.filter(d => documentIds.includes(d.id) || documentIds.includes(d.documentNumber))
        : allDocs;

      const batchResults = [];
      let draftCount = 0;
      let issuedCount = 0;

      for (const doc of targetDocs) {
        const baseBytes = await PdfDocumentBuilder.buildDocumentPdf(doc);
        const { watermarkedBytes, result } = await PdfWatermarkEngine.applyWatermark(
          baseBytes,
          {
            status: doc.status,
            documentNumber: doc.documentNumber,
            documentType: doc.documentType,
            siteName: doc.siteName,
            commissionerName: doc.commissionerName,
            commissionerSaqccNumber: doc.commissionerSaqccNumber,
            checksum: doc.checksumSha256
          }
        );

        if (doc.status === 'Draft') draftCount++;
        else issuedCount++;

        batchResults.push({
          ...result,
          downloadUrl: `/api/pdf/render/${doc.id}`
        });
      }

      const manifestPayload = batchResults.map(r => `${r.documentNumber}:${r.watermarkApplied}:${r.sha256Checksum}`).join('|');
      const manifestHash = crypto.createHash('sha256').update(manifestPayload).digest('hex');

      res.json({
        success: true,
        batchId: `batch-wm-${Date.now()}`,
        processedAt: new Date().toISOString(),
        totalDocuments: targetDocs.length,
        draftCount,
        issuedCount,
        manifestHash,
        documents: batchResults
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 4. VITE MIDDLEWARE (DEVELOPMENT / SPA)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Audrin Statutory Compliance Server running on http://0.0.0.0:${PORT}`);
    console.log(`[SERVER] Watermark engine initialized with ${documentDatabase.getAllDocuments().length} database records.`);
  });
}

startServer().catch(err => {
  console.error('[FATAL SERVER ERROR]', err);
  process.exit(1);
});
