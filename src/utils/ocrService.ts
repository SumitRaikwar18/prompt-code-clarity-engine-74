
// OCR Service for extracting text from images
// This is a mock implementation - in production, you would use Tesseract.js or Google Vision API

export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  console.log('Processing image for OCR:', imageFile.name);
  
  // Simulate OCR processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Mock OCR results based on filename or simulate different scenarios
  const fileName = imageFile.name.toLowerCase();
  
  if (fileName.includes('factorial') || fileName.includes('fact')) {
    return "Write a function to calculate the factorial of a number. The factorial of n (denoted as n!) is the product of all positive integers less than or equal to n. For example, 5! = 5 × 4 × 3 × 2 × 1 = 120.";
  }
  
  if (fileName.includes('reverse') || fileName.includes('string')) {
    return "Create a function that takes a string as input and returns the string reversed. For example, if the input is 'hello', the output should be 'olleh'.";
  }
  
  if (fileName.includes('prime') || fileName.includes('number')) {
    return "Write a function to check if a given number is prime. A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.";
  }
  
  if (fileName.includes('sort') || fileName.includes('array')) {
    return "Implement a sorting algorithm to sort an array of integers in ascending order. You can use any sorting algorithm like bubble sort, quick sort, or merge sort.";
  }

  // Generic OCR result for demonstration
  return `Write a function to solve the following coding problem:

Given an array of integers, find the maximum sum of a contiguous subarray. This is known as the Maximum Subarray Problem.

Example:
Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6 (subarray [4, -1, 2, 1] has the maximum sum)

Please implement an efficient solution with optimal time complexity.`;
};

// In a real implementation, you would use Tesseract.js:
/*
import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    console.log('Starting OCR processing...');
    
    const { data: { text } } = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => console.log('OCR Progress:', m)
      }
    );
    
    console.log('OCR completed. Extracted text:', text);
    return text.trim();
    
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};
*/

// Or Google Vision API:
/*
export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    const base64 = await fileToBase64(imageFile);
    
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64
          },
          features: [{
            type: 'TEXT_DETECTION'
          }]
        }]
      })
    });
    
    const result = await response.json();
    return result.responses[0]?.fullTextAnnotation?.text || '';
    
  } catch (error) {
    console.error('Vision API Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result?.toString().split(',')[1];
      resolve(base64 || '');
    };
    reader.onerror = error => reject(error);
  });
};
*/
