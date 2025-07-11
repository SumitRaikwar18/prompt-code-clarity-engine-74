import React, { useState } from 'react';
import { Code, Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import DualSolutionDisplay from "@/components/DualSolutionDisplay";
import { generateSolution } from "@/utils/aiService";

interface Solution {
  code: string;
  explanation: string;
  language: 'java' | 'python';
}

interface DualSolution {
  python: Solution;
  java: Solution;
}

const Index = () => {
  const [textInput, setTextInput] = useState('');
  const [originalProblem, setOriginalProblem] = useState('');
  const [solutions, setSolutions] = useState<DualSolution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleSubmit = async (input: string, isFromImage: boolean = false) => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide a coding problem to solve.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSolutions(null);
    setOriginalProblem(input);

    try {
      console.log(`Generating solutions for: ${input.substring(0, 100)}...`);
      
      const result = await generateSolution(input);
      
      if (result.status === 'success') {
        setSolutions(result.solutions);
        toast({
          title: "Solutions Generated",
          description: "Your coding solutions are ready in both languages!",
        });
      } else {
        setError(result.message);
        toast({
          title: "Generation Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error generating solutions:', err);
      const errorMessage = 'Failed to generate solutions. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = () => {
    handleSubmit(textInput);
  };

  const handleImageSubmit = (extractedText: string) => {
    handleSubmit(extractedText, true);
  };

  const clearAll = () => {
    setTextInput('');
    setOriginalProblem('');
    setSolutions(null);
    setError(null);
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Code Solution Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get instant solutions in both Java and Python with AI-powered analysis and feedback system
          </p>
        </div>

        <div className="space-y-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-purple-600" />
                  Submit Your Problem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Tabs defaultValue="text" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="text">Text Input</TabsTrigger>
                      <TabsTrigger value="image">Image Upload</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Describe your coding problem
                        </label>
                        <Textarea
                          placeholder="Example: Write a function to find the factorial of a number..."
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="min-h-[150px] resize-none"
                        />
                      </div>
                      <Button 
                        onClick={handleTextSubmit}
                        disabled={isLoading || !textInput.trim()}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Solutions...
                          </>
                        ) : (
                          <>
                            <Code className="mr-2 h-4 w-4" />
                            Generate Both Solutions
                          </>
                        )}
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="image" className="space-y-4">
                      <ImageUpload 
                        onTextExtracted={handleImageSubmit}
                        onImageSelected={setUploadedImage}
                        isLoading={isLoading}
                      />
                    </TabsContent>
                  </Tabs>

                  {(solutions || error) && (
                    <Button 
                      onClick={clearAll}
                      variant="outline" 
                      className="w-full"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Example Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Write a function to reverse a string",
                    "Implement binary search algorithm",
                    "Create a function to check if a number is prime",
                    "Sort an array using quicksort"
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setTextInput(example)}
                      className="text-left w-full p-3 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                    >
                      • {example}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 max-w-4xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm max-w-4xl mx-auto">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                      <p className="text-gray-600">Generating solutions for both Java and Python...</p>
                      <div className="flex justify-center mt-4 space-x-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {solutions && (
              <div className="max-w-6xl mx-auto">
                <DualSolutionDisplay 
                  solutions={solutions} 
                  originalProblem={originalProblem}
                />
              </div>
            )}

            {!solutions && !isLoading && !error && (
              <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm max-w-4xl mx-auto">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Code className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">Ready to solve your coding problem!</p>
                    <p className="text-gray-400 text-sm">
                      Enter your problem description or upload an image to get solutions in both languages
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Separator className="mb-6" />
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500">
            <Badge variant="secondary">Dual Language Solutions</Badge>
            <Badge variant="secondary">Clean Code Output</Badge>
            <Badge variant="secondary">Image OCR</Badge>
            <Badge variant="secondary">Feedback System</Badge>
            <Badge variant="secondary">Large Display</Badge>
          </div>
          <p className="mt-4 text-gray-400">
            Generate clean code solutions with feedback system for continuous improvement
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;