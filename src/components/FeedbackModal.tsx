import React, { useState } from 'react';
import { Flag, Send, X, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface FeedbackModalProps {
  originalProblem: string;
  generatedCode: string;
  language: string;
  onFeedbackSubmit: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  issueType: string;
  description: string;
  originalProblem: string;
  generatedCode: string;
  language: string;
  timestamp: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  originalProblem,
  generatedCode,
  language,
  onFeedbackSubmit
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!issueType || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an issue type and provide a description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      issueType,
      description: description.trim(),
      originalProblem,
      generatedCode,
      language,
      timestamp: new Date().toISOString()
    };

    try {
      await onFeedbackSubmit(feedbackData);
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll use it to improve our AI.",
      });

      setIsOpen(false);
      setIssueType('');
      setDescription('');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <Flag className="h-4 w-4" />
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Report Code Issue
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">What type of issue did you encounter?</Label>
            <RadioGroup value={issueType} onValueChange={setIssueType} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="incorrect-logic" id="incorrect-logic" />
                <Label htmlFor="incorrect-logic">Incorrect logic or algorithm</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="syntax-error" id="syntax-error" />
                <Label htmlFor="syntax-error">Syntax errors or compilation issues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="incomplete-solution" id="incomplete-solution" />
                <Label htmlFor="incomplete-solution">Incomplete or partial solution</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wrong-interpretation" id="wrong-interpretation" />
                <Label htmlFor="wrong-interpretation">Misunderstood the problem requirements</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="performance-issue" id="performance-issue" />
                <Label htmlFor="performance-issue">Poor performance or inefficient solution</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other issue</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Please describe the issue in detail
            </Label>
            <Textarea
              id="description"
              placeholder="Explain what's wrong with the generated code and what the correct solution should be..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[120px]"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">Context Information</Label>
            <div className="mt-2 space-y-2 text-sm text-gray-600">
              <div><strong>Language:</strong> {language}</div>
              <div><strong>Problem:</strong> {originalProblem.substring(0, 100)}...</div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !issueType || !description.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;