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

interface DualSolution {
  python: Solution;
  java: Solution;
}

interface DualSolutionDisplayProps {
  solutions: DualSolution;
}

const DualSolutionDisplay: React.FC<DualSolutionDisplayProps> = ({ solutions }) => {
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
        return <div className="w-3 h-3 rounded-full bg-blue-500"></div>;
      case 'java':
        return <div className="w-3 h-3 rounded-full bg-orange-500"></div>;
      default:
        return <Code2 className="h-3 w-3" />;
    }
  };

  const formatCode = (code: string) => {
    return code
      .split('\n')
      .map((line, index) => (
        <div key={index} className="flex hover:bg-gray-50 transition-colors">
          <span className="select-none text-gray-400 text-sm w-12 flex-shrink-0 text-right pr-4 py-1 bg-gray-50 border-r">
            {index + 1}
          </span>
          <span className="flex-1 px-4 py-1 font-mono text-base leading-relaxed">{line || ' '}</span>
        </div>
      ));
  };

  const SolutionCard = ({ solution }: { solution: Solution }) => (
    <div className="space-y-6">
      <Card className="shadow-lg border border-gray-200 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              {getLanguageIcon(solution.language)}
              <span className="font-bold text-gray-800">
                {solution.language.charAt(0).toUpperCase() + solution.language.slice(1)}
              </span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(solution.code, `${solution.language} Code`)}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <Copy className="h-4 w-4" />
              Copy Code
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <div className="text-base">
                {formatCode(solution.code)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-gray-200 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-gray-800">Explanation</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(solution.explanation, 'Explanation')}
              className="flex items-center gap-2 hover:bg-blue-50"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {solution.explanation}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-800">Solutions Generated</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                {getLanguageIcon('python')}
                Python
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                {getLanguageIcon('java')}
                Java
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-8">
        <div>
          <SolutionCard solution={solutions.python} />
        </div>
        <div>
          <SolutionCard solution={solutions.java} />
        </div>
      </div>

      <Card className="shadow-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Dual Solutions Ready</span>
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
                {solutions.python.code.split('\n').length + solutions.java.code.split('\n').length} Total Lines
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DualSolutionDisplay;