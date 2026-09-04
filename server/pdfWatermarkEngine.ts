import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import crypto from 'crypto';
import { WatermarkOptions, WatermarkResult, StatutoryDocumentStatus } from './types';

export class PdfWatermarkEngine {
  /**
   * Applies a dynamic 'DRAFT' or 'ISSUED' watermark overlay to an existing PDF buffer
   * based on the document's statutory status in the database.
   */
  public static async applyWatermark(
    pdfBytes: Uint8Array | Buffer,
    options: WatermarkOptions
  ): Promise<{ watermarkedBytes: Uint8Array; result: WatermarkResult }> {
    const startTime = Date.now();
    const isDraft = options.status.toUpperCase() === 'DRAFT';
    const statutoryStatus: StatutoryDocumentStatus = isDraft ? 'Draft' : 'Issued';
    const watermarkApplied: 'DRAFT' | 'ISSUED' = isDraft ? 'DRAFT' : 'ISSUED';

    const documentNumber = options.documentNumber || 'SANS-DOC-REGISTERED';
    const timestamp = options.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const checksum = options.checksum || crypto.createHash('sha256').update(pdfBytes).digest('hex');
    const commissionerSaqcc = options.commissionerSaqccNumber || 'SAQCC-SANS10139-COMM-2022/03/23';

    // Load PDF document with pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    // Embed fonts
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontCourier = await pdfDoc.embedFont(StandardFonts.CourierBold);

    // Color definitions
    // Draft theme: Crimson red
    const draftRed = rgb(0.85, 0.12, 0.12);
    const draftBg = rgb(0.99, 0.94, 0.94);
    const draftBorder = rgb(0.88, 0.25, 0.25);

    // Issued theme: Statutory Emerald Green
    const issuedGreen = rgb(0.04, 0.58, 0.32);
    const issuedBg = rgb(0.93, 0.99, 0.94);
    const issuedBorder = rgb(0.12, 0.65, 0.38);

    // Dark footer
    const darkFooterBg = rgb(0.07, 0.09, 0.14);
    const footerTextColor = rgb(0.92, 0.94, 0.98);

    // Watermark text definitions (WinAnsi compatible ASCII)
    const primaryDiagonalText = isDraft
      ? 'DRAFT - NOT A VALID CERTIFICATE'
      : 'OFFICIALLY ISSUED & VALID';

    const secondaryDiagonalText = isDraft
      ? 'SANS 10139 STATUTORY REVIEW COPY | UNISSUED | FOR CLIENT AUDIT ONLY'
      : 'SANS 10139 STATUTORY COMPLIANCE | SAQCC REGISTERED | TAMPER-PROTECTED';

    const ribbonText = isDraft
      ? '[SERVER DRAFT WATERMARK] STATUTORY DRAFT NOTICE: NOT VALID FOR OCCUPATION, MUNICIPAL SUBMISSION, OR INSURANCE'
      : '[SERVER ISSUED WATERMARK] OFFICIAL STATUTORY SANS 10139 CERTIFICATE OF COMPLIANCE | DIGITALLY ISSUED & SECURED';

    // Process every page in the document
    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const pageNumber = i + 1;

      // 1. DYNAMIC CENTRAL DIAGONAL WATERMARK
      if (options.applyDiagonalWatermark !== false) {
        const diagonalAngle = 42;
        const mainFontSize = Math.min(36, width * 0.06);
        const subFontSize = Math.min(11, width * 0.02);

        const mainTextWidth = fontBold.widthOfTextAtSize(primaryDiagonalText, mainFontSize);
        const subTextWidth = fontRegular.widthOfTextAtSize(secondaryDiagonalText, subFontSize);

        // Center calculation
        const centerX = width / 2;
        const centerY = height / 2;

        // Primary diagonal watermark line
        page.drawText(primaryDiagonalText, {
          x: centerX - (mainTextWidth / 2) * Math.cos((diagonalAngle * Math.PI) / 180),
          y: centerY - (mainTextWidth / 2) * Math.sin((diagonalAngle * Math.PI) / 180),
          size: mainFontSize,
          font: fontBold,
          color: isDraft ? draftRed : issuedGreen,
          opacity: isDraft ? 0.22 : 0.17,
          rotate: degrees(diagonalAngle),
        });

        // Subtitle diagonal watermark line
        page.drawText(secondaryDiagonalText, {
          x: centerX - (subTextWidth / 2) * Math.cos((diagonalAngle * Math.PI) / 180) - 12,
          y: centerY - (subTextWidth / 2) * Math.sin((diagonalAngle * Math.PI) / 180) - 26,
          size: subFontSize,
          font: fontRegular,
          color: isDraft ? draftRed : issuedGreen,
          opacity: isDraft ? 0.26 : 0.20,
          rotate: degrees(diagonalAngle),
        });
      }

      // 2. TOP STATUTORY SECURITY RIBBON
      if (options.applyTopBanner !== false) {
        const ribbonHeight = 15;
        const ribbonY = height - ribbonHeight;

        // Banner background
        page.drawRectangle({
          x: 0,
          y: ribbonY,
          width: width,
          height: ribbonHeight,
          color: isDraft ? draftBg : issuedBg,
        });

        // Banner bottom border accent
        page.drawLine({
          start: { x: 0, y: ribbonY },
          end: { x: width, y: ribbonY },
          thickness: 1.2,
          color: isDraft ? draftBorder : issuedBorder,
        });

        // Banner text centered
        const ribbonFontSize = Math.min(7.5, width * 0.015);
        const ribbonTextWidth = fontBold.widthOfTextAtSize(ribbonText, ribbonFontSize);
        const textX = Math.max(8, (width - ribbonTextWidth) / 2);

        page.drawText(ribbonText, {
          x: textX,
          y: ribbonY + 4.2,
          size: ribbonFontSize,
          font: fontBold,
          color: isDraft ? draftRed : issuedGreen,
        });
      }

      // 3. TOP-RIGHT CORNER SECURITY BADGE
      if (options.applyCornerBadge !== false) {
        const badgeWidth = 145;
        const badgeHeight = 26;
        const badgeX = width - badgeWidth - 10;
        const badgeY = height - 46;

        // Badge background
        page.drawRectangle({
          x: badgeX,
          y: badgeY,
          width: badgeWidth,
          height: badgeHeight,
          color: rgb(1, 1, 1),
          borderColor: isDraft ? draftBorder : issuedBorder,
          borderWidth: 1,
          opacity: 0.92,
        });

        // Status pill indicator
        const statusText = isDraft ? '[DRAFT] UNISSUED REVIEW COPY' : '[ISSUED] OFFICIALLY VALIDATED';
        page.drawText(statusText, {
          x: badgeX + 6,
          y: badgeY + 14,
          size: 7.2,
          font: fontBold,
          color: isDraft ? draftRed : issuedGreen,
        });

        // Verification metadata
        const badgeSubtext = isDraft
          ? `Review Copy | ${timestamp.slice(0, 10)}`
          : `SAQCC: ${commissionerSaqcc.slice(0, 24)}`;

        page.drawText(badgeSubtext, {
          x: badgeX + 6,
          y: badgeY + 4.5,
          size: 6.2,
          font: fontCourier,
          color: rgb(0.25, 0.30, 0.38),
        });
      }

      // 4. BOTTOM CRYPTOGRAPHIC NON-REPUDIATION FOOTER BAR
      if (options.applyBottomFooter !== false) {
        const footerHeight = 16;
        page.drawRectangle({
          x: 0,
          y: 0,
          width: width,
          height: footerHeight,
          color: darkFooterBg,
        });

        const footerText = isDraft
          ? `PAGE ${pageNumber} OF ${totalPages} | REF: ${documentNumber} | STATUS: DRAFT | HASH: ${checksum.slice(0, 24)}... | AUDRIN SERVER-SIDE WATERMARK ENGINE`
          : `PAGE ${pageNumber} OF ${totalPages} | REF: ${documentNumber} | STATUS: OFFICIALLY ISSUED | SHA-256: ${checksum.slice(0, 24)}... | LOCKED SANS 10139 COPY`;

        const footerFontSize = Math.min(6.5, width * 0.012);
        const footerTextWidth = fontCourier.widthOfTextAtSize(footerText, footerFontSize);
        const footerX = Math.max(6, (width - footerTextWidth) / 2);

        page.drawText(footerText, {
          x: footerX,
          y: 4.8,
          size: footerFontSize,
          font: fontCourier,
          color: footerTextColor,
        });
      }
    }

    // Save modified PDF bytes
    const watermarkedBytes = await pdfDoc.save();
    const finalChecksum = crypto.createHash('sha256').update(watermarkedBytes).digest('hex');
    const latencyMs = Date.now() - startTime;

    const result: WatermarkResult = {
      success: true,
      documentId: options.documentNumber || 'DOC-SERVER',
      documentNumber,
      status: statutoryStatus,
      watermarkApplied,
      pageCount: totalPages,
      fileSizeBytes: watermarkedBytes.byteLength,
      sha256Checksum: finalChecksum,
      processedAt: new Date().toISOString(),
      latencyMs,
      filename: `${documentNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}_${watermarkApplied}.pdf`
    };

    return {
      watermarkedBytes,
      result
    };
  }
}
