
import React, { useState } from 'react';
import { Key, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { setApiKeys } from "@/utils/aiService";

interface ApiKeyConfigProps {
  onKeysConfigured: () => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onKeysConfigured }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);

  const handleSaveKeys = () => {
    if (!openaiKey && !anthropicKey) {
      toast({
        title: "API Keys Required",
        description: "Please provide at least one API key to continue.",
        variant: "destructive"
      });
      return;
    }

    setApiKeys(openaiKey, anthropicKey);
    onKeysConfigured();
    
    toast({
      title: "API Keys Configured",
      description: "You can now generate AI-powered solutions!",
    });
  };

  const handleSkip = () => {
    setApiKeys('', '');
    onKeysConfigured();
    
    toast({
      title: "Using Demo Mode",
      description: "Demo solutions will be shown. Add API keys for real AI solutions.",
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-purple-600" />
          Configure AI API Keys
        </CardTitle>
        <p className="text-sm text-gray-600">
          Add your API keys to enable real AI-powered code generation. You can skip this to see demo solutions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OpenAI API Key */}
        <div className="space-y-2">
          <Label htmlFor="openai-key">OpenAI API Key (Optional)</Label>
          <div className="relative">
            <Input
              id="openai-key"
              type={showOpenaiKey ? "text" : "password"}
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowOpenaiKey(!showOpenaiKey)}
            >
              {showOpenaiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Anthropic API Key */}
        <div className="space-y-2">
          <Label htmlFor="anthropic-key">Anthropic API Key (Optional)</Label>
          <div className="relative">
            <Input
              id="anthropic-key"
              type={showAnthropicKey ? "text" : "password"}
              placeholder="sk-ant-..."
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowAnthropicKey(!showAnthropicKey)}
            >
              {showAnthropicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSaveKeys}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save & Continue
          </Button>
          <Button 
            onClick={handleSkip}
            variant="outline"
            className="flex-1"
          >
            Skip (Demo Mode)
          </Button>
        </div>

        <div className="text-xs text-gray-500 pt-2">
          <p>• Your API keys are stored locally and never sent to our servers</p>
          <p>• At least one API key is recommended for best results</p>
          <p>• Get OpenAI key: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com</a></p>
          <p>• Get Anthropic key: <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.anthropic.com</a></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyConfig;
