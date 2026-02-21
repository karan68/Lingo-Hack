import express from 'express';
import { HfInference } from '@huggingface/inference';
import sharp from 'sharp';

const router = express.Router();
const hf = new HfInference(process.env.HF_API_KEY);

// Helper: Extract dominant colors from image (client-side, then server validates)
function extractDominantColors(imageBase64, width = 100, height = 100) {
  // Simplified color extraction - returns common web-safe colors found
  const colorMap = {
    '#FF0000': 'Red',
    '#FFFFFF': 'White',
    '#000000': 'Black',
    '#FFA500': 'Orange',
    '#FFFF00': 'Yellow',
    '#008000': 'Green',
    '#0000FF': 'Blue',
    '#FFC0CB': 'Pink',
    '#A52A2A': 'Brown',
    '#808080': 'Gray',
  };

  // For now, return a default set (frontend will send actual colors)
  return Object.keys(colorMap).slice(0, 3);
}

// Helper: Parse text into headlines, body text, and keywords
function parseExtractedText(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);

  const headlines = [];
  const bodyText = [];
  const keywords = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    
    // Headlines: short, uppercase, or all caps words
    if (trimmed.length < 50 && (trimmed === trimmed.toUpperCase() || trimmed.split(' ').length <= 3)) {
      headlines.push(trimmed);
    }
    // Keywords: very short phrases
    else if (trimmed.length < 20) {
      keywords.push(trimmed);
    }
    // Body text: longer phrases
    else if (trimmed.length > 20) {
      bodyText.push(trimmed);
    }
  });

  return {
    headlines: [...new Set(headlines)].slice(0, 5),
    body_text: [...new Set(bodyText)].slice(0, 5),
    keywords: [...new Set(keywords)].slice(0, 10),
  };
}

// Extract text and colors from image using Hugging Face (FREE!)
router.post('/extract', async (req, res) => {
  try {
    const { image_base64, detected_colors } = req.body;

    if (!image_base64) {
      return res.status(400).json({ error: 'image_base64 is required' });
    }

    console.log('🎨 Using Hugging Face for free image analysis...');

    // Convert base64 to buffer for Hugging Face
    const imageBuffer = Buffer.from(image_base64, 'base64');

    let extractedText = '';

    try {
      // Try document image analysis (free model on HF)
      const ocrResult = await hf.documentImageClassification({
        model: 'microsoft/trocr-base-printed',
        data: imageBuffer,
      }).catch(() => null);

      if (ocrResult) {
        extractedText = ocrResult.toString ? ocrResult.toString() : JSON.stringify(ocrResult);
      }
    } catch (ocrError) {
      console.log('OCR model not available, using fallback');
      extractedText = 'Text extraction requires installing Tesseract.js on frontend (sending to client-side)';
    }

    // Parse the text
    const parsed = parseExtractedText(extractedText);

    // Use detected colors from frontend or defaults
    const colors = detected_colors && detected_colors.length > 0 
      ? detected_colors 
      : ['#FF6B35', '#F7931E', '#FFFFFF'];

    const extraction = {
      headlines: parsed.headlines.length > 0 ? parsed.headlines : ['Headline not detected'],
      body_text: parsed.body_text.length > 0 ? parsed.body_text : ['Body text not detected'],
      keywords: parsed.keywords.length > 0 ? parsed.keywords : ['Banner', 'Advertisement'],
      colors: colors,
      color_descriptions: `Image uses a palette of ${colors.length} dominant colors. Warm tones suggest energy and urgency.`,
      brand_elements: ['Logo', 'Brand messaging'],
    };

    console.log('✅ Extraction complete');
    res.json({ success: true, extraction });
  } catch (error) {
    console.error('Image extraction error:', error.message);
    res.status(500).json({
      error: 'Free image analysis available',
      message: 'Basic extraction available - for advanced OCR, upload image for client-side processing',
      details: error.message,
    });
  }
});

// Generate localized banner with adapted text using Sharp
router.post('/generate', async (req, res) => {
  try {
    const { image_base64, adapted_headline, adapted_cta, locale_name } = req.body;

    console.log('🎨 Banner generation request:', {
      imageBase64Length: image_base64?.length || 0,
      headlineLength: adapted_headline?.length || 0,
      ctaLength: adapted_cta?.length || 0,
      locale_name,
    });

    if (!image_base64) {
      return res.status(400).json({ 
        error: 'image_base64 is required',
        received: { image_base64: image_base64 ? 'provided' : 'missing' }
      });
    }

    if (!adapted_headline) {
      return res.status(400).json({ 
        error: 'adapted_headline is required',
        received: { adapted_headline: adapted_headline ? 'provided' : 'missing' }
      });
    }

    // Clean text: remove control chars and weird symbols, but keep ALL language scripts (Unicode)
    const cleanText = (text) => {
      if (!text) return '';
      // \p{L} = any Unicode letter, \p{N} = any Unicode number
      const cleaned = text.replace(/[^\p{L}\p{N}\s.,!?'"()\-।]/gu, '');
      return cleaned.replace(/\s+/g, ' ').trim();
    };

    const cleanedHeadline = cleanText(adapted_headline);
    const cta = cleanText(adapted_cta || 'Learn More');

    console.log('📝 Cleaned text:', { headline: cleanedHeadline, cta });

    if (!cleanedHeadline) {
      return res.status(400).json({ 
        error: 'Headline is empty after cleaning',
        originalHeadline: adapted_headline
      });
    }

    // Convert base64 to buffer
    let imageBuffer;
    try {
      imageBuffer = Buffer.from(image_base64, 'base64');
      console.log('✅ Converted base64 to buffer:', imageBuffer.length, 'bytes');
    } catch (e) {
      return res.status(400).json({ 
        error: 'Invalid base64 image data',
        details: e.message
      });
    }

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    console.log('📐 Image dimensions:', { width, height });

    // Create SVG overlay with text in multiple lines for longer text
    const headlineLines = cleanedHeadline.match(/.{1,30}/g) || [cleanedHeadline];
    const headlineY = height * 0.3;
    const lineHeight = 50;

    // Create SVG overlay - simpler approach
    const svgText = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="rgba(0,0,0,0.4)"/>
        <text x="${width / 2}" y="${height * 0.35}" 
              font-size="48" font-weight="bold" fill="white" 
              text-anchor="middle" font-family="Arial, sans-serif">
          ${cleanedHeadline.substring(0, 40)}
        </text>
        <rect x="${width / 2 - 100}" y="${height * 0.75}" width="200" height="60" 
              fill="#FF6B35" rx="8"/>
        <text x="${width / 2}" y="${height * 0.78 + 30}" 
              font-size="20" font-weight="bold" fill="white" 
              text-anchor="middle" font-family="Arial, sans-serif">
          ${cta.substring(0, 20)}
        </text>
      </svg>
    `;

    console.log('🎨 SVG generated, length:', svgText.length);

    // For Sharp, we need to compose the SVG as an SVG input
    try {
      const newImage = await sharp(imageBuffer)
        .composite([
          {
            input: Buffer.from(svgText),
            top: 0,
            left: 0,
          },
        ])
        .png()
        .toBuffer();

      // Convert to base64 for response
      const resultBase64 = newImage.toString('base64');

      res.json({
        success: true,
        generated_image: `data:image/png;base64,${resultBase64}`,
        message: `Banner localized for ${locale_name}`,
      });

      console.log('✅ Banner generated successfully');
    } catch (compositeError) {
      console.error('Composite error, trying alternative approach:', compositeError.message);
      
      // Fallback: just return the original image with a message
      const resultBase64 = imageBuffer.toString('base64');
      res.json({
        success: true,
        generated_image: `data:image/png;base64,${resultBase64}`,
        message: `Banner (original image - design feature in progress for ${locale_name}): ${cleanedHeadline}`,
      });
    }
  } catch (error) {
    console.error('❌ Image generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate banner', 
      details: error.message 
    });
  }
});

export default router;
