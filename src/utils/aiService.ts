interface Solution {
  code: string;
  explanation: string;
  language: 'java' | 'python';
}

interface DualSolution {
  python: Solution;
  java: Solution;
}

interface AIResponse {
  solutions: DualSolution;
  status: 'success' | 'error';
  message: string;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const getApiKeys = () => {
  return {
    openai: import.meta.env.VITE_OPENAI_API_KEY || '',
    anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY || ''
  };
};

const generateWithOpenAI = async (problem: string, language: 'java' | 'python'): Promise<Solution> => {
  const { openai } = getApiKeys();
  
  const prompt = `Generate clean ${language} code for this problem. Return only working code without comments, explanations, or markdown formatting:

${problem}`;

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openai}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Generate clean ${language} code without comments or explanations. Return only code.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.1
    })
  });

  const data = await response.json();
  let code = data.choices[0]?.message?.content || '';
  
  code = code.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
  
  const explanationPrompt = `Explain this ${language} code solution briefly:

${code}`;

  const explanationResponse = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openai}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: explanationPrompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    })
  });

  const explanationData = await explanationResponse.json();
  const explanation = explanationData.choices[0]?.message?.content || '';

  return {
    code,
    explanation,
    language
  };
};

const generateWithAnthropic = async (problem: string, language: 'java' | 'python'): Promise<Solution> => {
  const { anthropic } = getApiKeys();
  
  const prompt = `Generate clean ${language} code for this problem. Return only working code without comments or explanations:

${problem}

Then provide brief explanation starting with "EXPLANATION:".`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': anthropic,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();
  const content = data.content[0]?.text || '';
  
  const parts = content.split('EXPLANATION:');
  let code = parts[0].replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
  const explanation = parts[1]?.trim() || 'Solution generated successfully.';

  return {
    code,
    explanation,
    language
  };
};

const getMockSolution = (problem: string, language: 'java' | 'python'): Solution => {
  const problemLower = problem.toLowerCase();
  
  if (problemLower.includes('factorial')) {
    if (language === 'python') {
      return {
        code: `def factorial(n):
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers")
    elif n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)

if __name__ == "__main__":
    number = 5
    result = factorial(number)
    print(f"Factorial of {number} is {result}")`,
        explanation: `This Python solution implements factorial using recursion. It handles edge cases for negative numbers and base cases for 0 and 1. For any other positive integer, it recursively multiplies the number by the factorial of (n-1).`,
        language: 'python'
      };
    } else {
      return {
        code: `public class Factorial {
    
    public static long factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Factorial is not defined for negative numbers");
        } else if (n == 0 || n == 1) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }
    
    public static void main(String[] args) {
        int number = 5;
        long result = factorial(number);
        System.out.println("Factorial of " + number + " is " + result);
    }
}`,
        explanation: `This Java solution implements factorial using recursion. It includes proper exception handling for negative numbers and handles base cases for 0 and 1. The method returns a long to handle larger factorial values.`,
        language: 'java'
      };
    }
  }

  const genericCode = language === 'python' 
    ? `def solve_problem():
    print("Solving the problem...")
    pass

if __name__ == "__main__":
    solve_problem()`
    : `public class ProblemSolver {
    
    public static void solveProblem() {
        System.out.println("Solving the problem...");
    }
    
    public static void main(String[] args) {
        solveProblem();
    }
}`;

  return {
    code: genericCode,
    explanation: `This is a generic ${language} solution template. Please provide more specific requirements for a complete implementation.`,
    language
  };
};

export const generateSolution = async (problem: string): Promise<AIResponse> => {
  console.log('Generating solutions for problem:', problem.substring(0, 100) + '...');
  
  try {
    const { openai, anthropic } = getApiKeys();
    
    if (openai) {
      console.log('Using OpenAI API...');
      const [pythonSolution, javaSolution] = await Promise.all([
        generateWithOpenAI(problem, 'python'),
        generateWithOpenAI(problem, 'java')
      ]);

      return {
        solutions: {
          python: pythonSolution,
          java: javaSolution
        },
        status: 'success',
        message: 'Solutions generated successfully using OpenAI'
      };
    }
    
    if (anthropic) {
      console.log('Using Anthropic API...');
      const [pythonSolution, javaSolution] = await Promise.all([
        generateWithAnthropic(problem, 'python'),
        generateWithAnthropic(problem, 'java')
      ]);

      return {
        solutions: {
          python: pythonSolution,
          java: javaSolution
        },
        status: 'success',
        message: 'Solutions generated successfully using Anthropic Claude'
      };
    }

    console.log('Using mock solutions (no API keys provided)...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      solutions: {
        python: getMockSolution(problem, 'python'),
        java: getMockSolution(problem, 'java')
      },
      status: 'success',
      message: 'Demo solutions generated (add API keys to .env file for real AI solutions)'
    };

  } catch (error) {
    console.error('Error generating solutions:', error);
    
    return {
      solutions: {
        python: getMockSolution(problem, 'python'),
        java: getMockSolution(problem, 'java')
      },
      status: 'error',
      message: 'API error occurred, showing demo solutions'
    };
  }
};