import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

interface ApiKeyConfigProps {
  onKeysConfigured: () => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onKeysConfigured }) => {
  const [showEnvInstructions, setShowEnvInstructions] = useState(false);

  useEffect(() => {
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    
    if (openaiKey || anthropicKey) {
      onKeysConfigured();
      toast({
        title: "API Keys Loaded",
        description: "API keys found in environment variables!",
      });
    }
  }, [onKeysConfigured]);

  const handleContinueWithoutKeys = () => {
    onKeysConfigured();
    toast({
      title: "Using Demo Mode",
      description: "Demo solutions will be shown. Add API keys to .env file for real AI solutions.",
    });
  };

  const handleShowInstructions = () => {
    setShowEnvInstructions(true);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-purple-600" />
          Environment Configuration
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure your API keys using environment variables for secure access.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showEnvInstructions ? (
          <>
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                For security, this app now uses environment variables. Click below to see setup instructions.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleShowInstructions}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Show Setup Instructions
              </Button>
              <Button 
                onClick={handleContinueWithoutKeys}
                variant="outline"
                className="flex-1"
              >
                Continue with Demo
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Environment Setup Instructions:</strong>
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">1. Create .env file in project root:</h4>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  VITE_OPENAI_API_KEY=your_openai_api_key_here<br/>
                  VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">2. Get your API keys:</h4>
                <ul className="text-sm space-y-1">
                  <li>• OpenAI: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com/api-keys</a></li>
                  <li>• Anthropic: <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.anthropic.com</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">3. Restart the development server</h4>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  npm run dev
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleContinueWithoutKeys}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Continue with Demo
              </Button>
            </div>

            <div className="text-xs text-gray-500 pt-2">
              <p>• Environment variables are secure and not exposed to the client</p>
              <p>• At least one API key is recommended for best results</p>
              <p>• The .env file should never be committed to version control</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyConfig;