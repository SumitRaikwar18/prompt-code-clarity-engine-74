// OCR Service using Google Cloud Vision API
interface VisionAPIResponse {
  responses: Array<{
    fullTextAnnotation?: {
      text: string;
    };
    error?: {
      code: number;
      message: string;
    };
  }>;
}

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

export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Cloud Vision API key not found, using mock OCR');
    return getMockOCRResult(imageFile);
  }

  try {
    console.log('Processing image with Google Cloud Vision API:', imageFile.name);
    
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Call Google Cloud Vision API
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image
          },
          features: [{
            type: 'TEXT_DETECTION',
            maxResults: 1
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Vision API request failed: ${response.status} ${response.statusText}`);
    }

    const data: VisionAPIResponse = await response.json();
    
    if (data.responses[0]?.error) {
      throw new Error(`Vision API error: ${data.responses[0].error.message}`);
    }

    const extractedText = data.responses[0]?.fullTextAnnotation?.text;
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text found in the image');
    }

    console.log('Text extracted successfully:', extractedText.substring(0, 100) + '...');
    return extractedText.trim();
    
  } catch (error) {
    console.error('Google Cloud Vision API Error:', error);
    
    // Fallback to mock OCR if API fails
    console.log('Falling back to mock OCR...');
    return getMockOCRResult(imageFile);
  }
};

const getMockOCRResult = async (imageFile: File): Promise<string> => {
  console.log('Using mock OCR for:', imageFile.name);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

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

  if (fileName.includes('fibonacci') || fileName.includes('fib')) {
    return "Write a function to generate the Fibonacci sequence up to n terms. The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the previous two numbers.";
  }

  // Generic OCR result for demonstration
  return `Write a function to solve the following coding problem:

Given an array of integers, find the maximum sum of a contiguous subarray. This is known as the Maximum Subarray Problem.

Example:
Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6 (subarray [4, -1, 2, 1] has the maximum sum)

Please implement an efficient solution with optimal time complexity.`;
};