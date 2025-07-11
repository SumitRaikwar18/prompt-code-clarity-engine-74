
import React, { useState, useRef } from 'react';
import { Upload, Image, X, FileImage, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { extractTextFromImage } from "@/utils/ocrService";

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
  onImageSelected: (file: File | null) => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onTextExtracted, onImageSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPG or PNG image file.';
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 5MB.';
    }

    return null;
  };

  const handleFile = async (file: File) => {
    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    setSelectedImage(file);
    onImageSelected(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setUploadError(null);
    
    try {
      console.log('Extracting text from image...');
      const extractedText = await extractTextFromImage(selectedImage);
      
      if (extractedText.trim()) {
        console.log('Text extracted successfully:', extractedText.substring(0, 100) + '...');
        onTextExtracted(extractedText);
        
        // Clear the image after successful processing
        setTimeout(() => {
          clearImage();
        }, 1000);
      } else {
        setUploadError('No text could be extracted from the image. Please try a clearer image.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to extract text from image. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadError(null);
    onImageSelected(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload an image with your coding problem
        </label>
        
        {!selectedImage ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-purple-600" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drop your image here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports JPG, PNG • Max 5MB
                </p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <FileImage className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          </div>
        ) : (
          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 truncate">
                        {selectedImage.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearImage}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {uploadError && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {selectedImage && !uploadError && (
        <Button 
          onClick={handleSubmit}
          disabled={isLoading || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isProcessing ? (
            <>
              <Image className="mr-2 h-4 w-4 animate-pulse" />
              Extracting Text...
            </>
          ) : (
            <>
              <Image className="mr-2 h-4 w-4" />
              Process Image & Generate Solution
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
