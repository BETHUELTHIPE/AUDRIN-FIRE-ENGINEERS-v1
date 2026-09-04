import pptxgen from 'pptxgenjs';
import { PowerPointPresentation } from '../types';
import { COMPANY_DETAILS } from '../data/initialData';

export function generatePptxFile(presentation: PowerPointPresentation): void {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Audrin Fire Engineers (Pty) Ltd';
  pptx.company = COMPANY_DETAILS.legalName;
  pptx.title = presentation.title;

  const NAVY = '0B1C44';
  const CRIMSON = 'CC1E1E';
  const LIGHT_BG = 'F8FAFC';
  const WHITE = 'FFFFFF';
  const DARK_SLATE = '1E293B';
  const MUTED_GRAY = '64748B';

  presentation.slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();

    // Background
    slide.background = { color: index === 0 ? NAVY : LIGHT_BG };

    if (index === 0) {
      // Cover Slide
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: '100%',
        h: 0.15,
        fill: { color: CRIMSON }
      });

      slide.addText(COMPANY_DETAILS.legalName.toUpperCase(), {
        x: 1.0,
        y: 1.2,
        w: 11.3,
        h: 0.5,
        fontSize: 16,
        bold: true,
        color: CRIMSON,
        fontFace: 'Arial'
      });

      slide.addText(slideData.title, {
        x: 1.0,
        y: 1.8,
        w: 11.3,
        h: 1.5,
        fontSize: 32,
        bold: true,
        color: WHITE,
        fontFace: 'Arial'
      });

      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 1.0,
          y: 3.4,
          w: 11.3,
          h: 0.8,
          fontSize: 18,
          color: 'E2E8F0',
          fontFace: 'Arial'
        });
      }

      // Metadata bullet list
      const bulletsText = slideData.bullets.map(b => ({ text: b, options: { bullet: true, color: 'CBD5E1', fontSize: 14 } }));
      slide.addText(bulletsText, {
        x: 1.0,
        y: 4.4,
        w: 11.3,
        h: 1.8,
        fontFace: 'Arial'
      });

      if (slideData.callout) {
        slide.addText(slideData.callout, {
          x: 1.0,
          y: 6.4,
          w: 11.3,
          h: 0.5,
          fontSize: 12,
          italic: true,
          color: '94A3B8',
          fontFace: 'Arial'
        });
      }
    } else {
      // Content Slides
      // Header Top Bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: '100%',
        h: 1.1,
        fill: { color: NAVY }
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 1.1,
        w: '100%',
        h: 0.06,
        fill: { color: CRIMSON }
      });

      slide.addText(slideData.title, {
        x: 0.8,
        y: 0.2,
        w: 10.5,
        h: 0.45,
        fontSize: 20,
        bold: true,
        color: WHITE,
        fontFace: 'Arial'
      });

      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 0.8,
          y: 0.65,
          w: 10.5,
          h: 0.35,
          fontSize: 12,
          color: '94A3B8',
          fontFace: 'Arial'
        });
      }

      // Slide Body Content
      const bulletsText = slideData.bullets.map(b => ({
        text: `${b}\n`,
        options: { bullet: true, color: DARK_SLATE, fontSize: 15, breakLine: true }
      }));

      slide.addText(bulletsText, {
        x: 0.8,
        y: 1.6,
        w: slideData.imageUrls && slideData.imageUrls.length > 0 ? 6.5 : 11.5,
        h: 4.5,
        fontFace: 'Arial',
        lineSpacingMultiple: 1.3
      });

      if (slideData.callout) {
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.8,
          y: 6.2,
          w: 11.5,
          h: 0.7,
          fill: { color: 'FEE2E2' },
          line: { color: 'FCA5A5', width: 1 }
        });

        slide.addText(slideData.callout, {
          x: 1.0,
          y: 6.3,
          w: 11.1,
          h: 0.5,
          fontSize: 11,
          bold: true,
          color: CRIMSON,
          fontFace: 'Arial'
        });
      }

      // Footer
      slide.addText(`AUDRIN FIRE ENGINEERS (PTY) LTD | SANS 10139 Aligned | Slide ${index + 1} of ${presentation.slides.length}`, {
        x: 0.8,
        y: 7.1,
        w: 11.5,
        h: 0.3,
        fontSize: 9,
        color: MUTED_GRAY,
        fontFace: 'Arial'
      });
    }
  });

  pptx.writeFile({ fileName: `${presentation.presentationNumber}.pptx` });
}
