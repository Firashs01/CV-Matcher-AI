import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
const workerUrl = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Extract text from a PDF file
 * @param {File} file 
 * @returns {Promise<string>} Cleaned text from the PDF
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  
  try {
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to extract text from PDF. Please ensure it's a valid text-based PDF.");
  }
}
