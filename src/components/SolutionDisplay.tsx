
import React from 'react';
import { Copy, CheckCircle, BookOpen, Code2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface Solution {
  code: string;
  explanation: string;
  language: 'java' | 'python';
}

interface SolutionDisplayProps {
  solution: Solution;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution }) => {
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'python':
        return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>;
      case 'java':
        return <div className="w-3 h-3 rounded-full bg-red-500"></div>;
      default:
        return <Code2 className="h-3 w-3" />;
    }
  };

  const formatCode = (code: string) => {
    // Basic syntax highlighting for display
    return code
      .split('\n')
      .map((line, index) => (
        <div key={index} className="flex">
          <span className="select-none text-gray-400 text-sm w-8 flex-shrink-0 text-right pr-4">
            {index + 1}
          </span>
          <span className="flex-1">{line}</span>
        </div>
      ));
  };

  return (
    <div className="space-y-6">
      {/* Solution Header */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Solution Generated
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              {getLanguageIcon(solution.language)}
              {solution.language.charAt(0).toUpperCase() + solution.language.slice(1)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Code Solution */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code2 className="h-5 w-5 text-purple-600" />
              Code Solution
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(solution.code, 'Code')}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              Copy Code
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto border">
              <code className="text-sm font-mono text-gray-800 whitespace-pre">
                {formatCode(solution.code)}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Step-by-Step Explanation
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(solution.explanation, 'Explanation')}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              Copy Explanation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {solution.explanation}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solution Stats */}
      <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Solution Ready</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">AI Generated</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">
                {solution.code.split('\n').length} Lines of Code
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionDisplay;
