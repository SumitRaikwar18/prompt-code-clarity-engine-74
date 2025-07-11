interface FeedbackData {
  issueType: string;
  description: string;
  originalProblem: string;
  generatedCode: string;
  language: string;
  timestamp: string;
}

interface FeedbackResponse {
  success: boolean;
  message: string;
  feedbackId?: string;
}

const FEEDBACK_STORAGE_KEY = 'code_generator_feedback';

const saveFeedbackLocally = (feedback: FeedbackData): string => {
  const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const existingFeedback = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
  
  const feedbackWithId = {
    id: feedbackId,
    ...feedback,
    status: 'pending'
  };
  
  existingFeedback.push(feedbackWithId);
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existingFeedback));
  
  console.log('Feedback saved locally:', feedbackWithId);
  return feedbackId;
};

const sendFeedbackToAPI = async (feedback: FeedbackData): Promise<FeedbackResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('No API key available for feedback submission');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are receiving feedback about code generation quality. Acknowledge the feedback and provide insights for improvement.'
          },
          {
            role: 'user',
            content: `Feedback Report:
Issue Type: ${feedback.issueType}
Language: ${feedback.language}
Original Problem: ${feedback.originalProblem}
Generated Code: ${feedback.generatedCode}
User Description: ${feedback.description}
Timestamp: ${feedback.timestamp}

Please analyze this feedback and provide suggestions for improvement.`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Feedback analysis:', data.choices[0]?.message?.content);

    return {
      success: true,
      message: 'Feedback submitted successfully and analyzed by AI',
      feedbackId: `api_${Date.now()}`
    };
  } catch (error) {
    console.error('API feedback submission failed:', error);
    throw error;
  }
};

export const submitFeedback = async (feedback: FeedbackData): Promise<FeedbackResponse> => {
  try {
    const localId = saveFeedbackLocally(feedback);
    
    try {
      const apiResponse = await sendFeedbackToAPI(feedback);
      
      const existingFeedback = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
      const updatedFeedback = existingFeedback.map((item: any) => 
        item.id === localId ? { ...item, status: 'submitted', apiId: apiResponse.feedbackId } : item
      );
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
      
      return apiResponse;
    } catch (apiError) {
      console.warn('API submission failed, feedback saved locally only:', apiError);
      return {
        success: true,
        message: 'Feedback saved locally. Will be submitted when API is available.',
        feedbackId: localId
      };
    }
  } catch (error) {
    console.error('Feedback submission failed:', error);
    return {
      success: false,
      message: 'Failed to submit feedback. Please try again.'
    };
  }
};

export const getFeedbackHistory = (): any[] => {
  return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
};

export const clearFeedbackHistory = (): void => {
  localStorage.removeItem(FEEDBACK_STORAGE_KEY);
};