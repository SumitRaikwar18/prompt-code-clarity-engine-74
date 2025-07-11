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
  
  const systemPrompt = `You are an expert ${language} programmer. Generate clean, working, and well-structured code that follows best practices. The code must:
1. Be syntactically correct and executable
2. Handle edge cases appropriately
3. Include proper error handling where needed
4. Follow ${language} naming conventions
5. Be efficient and optimized
6. Include a main method/function for testing

Return ONLY the code without any markdown formatting, comments, or explanations.`;

  const userPrompt = `Generate a complete, working ${language} solution for this problem:

${problem}

Requirements:
- The code must be production-ready and handle all edge cases
- Include proper input validation
- Use appropriate data structures and algorithms
- Follow ${language} best practices and conventions
- Include a main method/function that demonstrates the solution`;

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
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API request failed: ${response.status}`);
  }

  const data = await response.json();
  let code = data.choices[0]?.message?.content || '';
  
  // Clean up the code
  code = code.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
  
  // Generate explanation
  const explanationPrompt = `Explain this ${language} code solution in detail. Include:
1. What the code does
2. How it works (algorithm/approach)
3. Time and space complexity
4. Key features and edge cases handled

Code:
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
      max_tokens: 500,
      temperature: 0.3
    })
  });

  const explanationData = await explanationResponse.json();
  const explanation = explanationData.choices[0]?.message?.content || 'Solution generated successfully.';

  return {
    code,
    explanation,
    language
  };
};

const generateWithAnthropic = async (problem: string, language: 'java' | 'python'): Promise<Solution> => {
  const { anthropic } = getApiKeys();
  
  const prompt = `Generate a complete, working ${language} solution for this problem. The code must be production-ready, handle edge cases, and follow best practices.

Problem: ${problem}

Requirements:
1. Generate clean, executable ${language} code
2. Include proper error handling and input validation
3. Follow ${language} naming conventions and best practices
4. Include a main method/function for testing
5. Handle all edge cases appropriately

First provide the complete code, then provide a detailed explanation starting with "EXPLANATION:".`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': anthropic,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API request failed: ${response.status}`);
  }

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

const getHighQualityMockSolution = (problem: string, language: 'java' | 'python'): Solution => {
  const problemLower = problem.toLowerCase();
  
  if (problemLower.includes('factorial')) {
    if (language === 'python') {
      return {
        code: `def factorial(n):
    """
    Calculate the factorial of a non-negative integer.
    
    Args:
        n (int): Non-negative integer
        
    Returns:
        int: Factorial of n
        
    Raises:
        ValueError: If n is negative
        TypeError: If n is not an integer
    """
    if not isinstance(n, int):
        raise TypeError("Input must be an integer")
    
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers")
    
    if n == 0 or n == 1:
        return 1
    
    result = 1
    for i in range(2, n + 1):
        result *= i
    
    return result

def factorial_recursive(n):
    """
    Calculate factorial using recursion (alternative implementation).
    """
    if not isinstance(n, int):
        raise TypeError("Input must be an integer")
    
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers")
    
    if n == 0 or n == 1:
        return 1
    
    return n * factorial_recursive(n - 1)

def main():
    """Test the factorial functions with various inputs."""
    test_cases = [0, 1, 5, 10]
    
    print("Testing factorial function:")
    for num in test_cases:
        try:
            result = factorial(num)
            result_recursive = factorial_recursive(num)
            print(f"factorial({num}) = {result}")
            print(f"factorial_recursive({num}) = {result_recursive}")
            assert result == result_recursive, "Results don't match!"
        except (ValueError, TypeError) as e:
            print(f"Error for input {num}: {e}")
    
    # Test edge cases
    try:
        factorial(-1)
    except ValueError as e:
        print(f"Expected error for negative input: {e}")
    
    try:
        factorial("5")
    except TypeError as e:
        print(f"Expected error for string input: {e}")

if __name__ == "__main__":
    main()`,
        explanation: `This Python solution provides a robust implementation of factorial calculation with comprehensive error handling:

**Algorithm**: Uses iterative approach for efficiency, with an alternative recursive implementation for comparison.

**Key Features**:
1. **Input Validation**: Checks for integer type and non-negative values
2. **Error Handling**: Raises appropriate exceptions for invalid inputs
3. **Edge Cases**: Handles 0! = 1 and 1! = 1 correctly
4. **Documentation**: Includes docstrings following Python conventions
5. **Testing**: Comprehensive main function with test cases and edge case validation

**Time Complexity**: O(n) for iterative, O(n) for recursive
**Space Complexity**: O(1) for iterative, O(n) for recursive (call stack)

The iterative approach is preferred for large numbers to avoid stack overflow.`,
        language: 'python'
      };
    } else {
      return {
        code: `import java.math.BigInteger;
import java.util.Scanner;

public class Factorial {
    
    /**
     * Calculate factorial using iterative approach with BigInteger for large numbers.
     * 
     * @param n Non-negative integer
     * @return Factorial of n as BigInteger
     * @throws IllegalArgumentException if n is negative
     */
    public static BigInteger factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Factorial is not defined for negative numbers");
        }
        
        if (n == 0 || n == 1) {
            return BigInteger.ONE;
        }
        
        BigInteger result = BigInteger.ONE;
        for (int i = 2; i <= n; i++) {
            result = result.multiply(BigInteger.valueOf(i));
        }
        
        return result;
    }
    
    /**
     * Calculate factorial using recursive approach.
     * 
     * @param n Non-negative integer
     * @return Factorial of n as BigInteger
     * @throws IllegalArgumentException if n is negative
     */
    public static BigInteger factorialRecursive(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Factorial is not defined for negative numbers");
        }
        
        if (n == 0 || n == 1) {
            return BigInteger.ONE;
        }
        
        return BigInteger.valueOf(n).multiply(factorialRecursive(n - 1));
    }
    
    /**
     * Calculate factorial for smaller numbers returning long.
     * 
     * @param n Non-negative integer (should be <= 20 for long range)
     * @return Factorial of n as long
     * @throws IllegalArgumentException if n is negative or too large
     */
    public static long factorialLong(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Factorial is not defined for negative numbers");
        }
        
        if (n > 20) {
            throw new IllegalArgumentException("Input too large for long type, use factorial() method instead");
        }
        
        if (n == 0 || n == 1) {
            return 1L;
        }
        
        long result = 1L;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        // Test cases
        int[] testCases = {0, 1, 5, 10, 15, 20};
        
        System.out.println("Testing factorial functions:");
        System.out.println("============================");
        
        for (int num : testCases) {
            try {
                BigInteger result = factorial(num);
                BigInteger resultRecursive = factorialRecursive(num);
                
                System.out.printf("factorial(%d) = %s%n", num, result);
                System.out.printf("factorialRecursive(%d) = %s%n", num, resultRecursive);
                
                if (num <= 20) {
                    long resultLong = factorialLong(num);
                    System.out.printf("factorialLong(%d) = %d%n", num, resultLong);
                }
                
                // Verify results match
                if (!result.equals(resultRecursive)) {
                    System.err.println("ERROR: Results don't match!");
                }
                
                System.out.println();
                
            } catch (IllegalArgumentException e) {
                System.err.printf("Error for input %d: %s%n", num, e.getMessage());
            }
        }
        
        // Test edge cases
        System.out.println("Testing edge cases:");
        System.out.println("==================");
        
        try {
            factorial(-1);
        } catch (IllegalArgumentException e) {
            System.out.println("Expected error for negative input: " + e.getMessage());
        }
        
        try {
            factorialLong(25);
        } catch (IllegalArgumentException e) {
            System.out.println("Expected error for large input: " + e.getMessage());
        }
        
        // Interactive mode
        Scanner scanner = new Scanner(System.in);
        System.out.print("\\nEnter a number to calculate its factorial (or -1 to exit): ");
        
        while (scanner.hasNextInt()) {
            int input = scanner.nextInt();
            if (input == -1) break;
            
            try {
                BigInteger result = factorial(input);
                System.out.printf("factorial(%d) = %s%n", input, result);
            } catch (IllegalArgumentException e) {
                System.err.println("Error: " + e.getMessage());
            }
            
            System.out.print("Enter another number (or -1 to exit): ");
        }
        
        scanner.close();
        System.out.println("Program terminated.");
    }
}`,
        explanation: `This Java solution provides a comprehensive factorial implementation with multiple approaches and robust error handling:

**Key Features**:
1. **Multiple Implementations**: Iterative and recursive approaches for different use cases
2. **BigInteger Support**: Handles arbitrarily large numbers without overflow
3. **Type Safety**: Separate method for long type with range validation
4. **Comprehensive Error Handling**: Validates inputs and provides meaningful error messages
5. **Interactive Mode**: Allows user input for testing
6. **Extensive Testing**: Multiple test cases including edge cases

**Methods Provided**:
- \`factorial(int)\`: Main method using BigInteger for large numbers
- \`factorialRecursive(int)\`: Recursive implementation for comparison
- \`factorialLong(int)\`: Optimized version for smaller numbers (≤20)

**Time Complexity**: O(n) for all implementations
**Space Complexity**: O(1) for iterative, O(n) for recursive

The BigInteger approach ensures no overflow issues, making it suitable for production use with large inputs.`,
        language: 'java'
      };
    }
  }

  if (problemLower.includes('reverse') && problemLower.includes('string')) {
    if (language === 'python') {
      return {
        code: `def reverse_string(s):
    """
    Reverse a string using multiple approaches.
    
    Args:
        s (str): Input string to reverse
        
    Returns:
        str: Reversed string
        
    Raises:
        TypeError: If input is not a string
    """
    if not isinstance(s, str):
        raise TypeError("Input must be a string")
    
    return s[::-1]

def reverse_string_iterative(s):
    """
    Reverse string using iterative approach.
    """
    if not isinstance(s, str):
        raise TypeError("Input must be a string")
    
    result = ""
    for char in s:
        result = char + result
    
    return result

def reverse_string_recursive(s):
    """
    Reverse string using recursion.
    """
    if not isinstance(s, str):
        raise TypeError("Input must be a string")
    
    if len(s) <= 1:
        return s
    
    return s[-1] + reverse_string_recursive(s[:-1])

def reverse_string_list(s):
    """
    Reverse string by converting to list and using reverse().
    """
    if not isinstance(s, str):
        raise TypeError("Input must be a string")
    
    char_list = list(s)
    char_list.reverse()
    return ''.join(char_list)

def reverse_words_in_string(s):
    """
    Reverse the order of words in a string while keeping words intact.
    """
    if not isinstance(s, str):
        raise TypeError("Input must be a string")
    
    words = s.split()
    return ' '.join(reversed(words))

def main():
    """Test all string reversal functions."""
    test_cases = [
        "",
        "a",
        "hello",
        "Hello, World!",
        "12345",
        "A man a plan a canal Panama",
        "racecar",
        "The quick brown fox jumps over the lazy dog"
    ]
    
    print("Testing string reversal functions:")
    print("=" * 50)
    
    for test_str in test_cases:
        print(f"\\nOriginal: '{test_str}'")
        
        try:
            result1 = reverse_string(test_str)
            result2 = reverse_string_iterative(test_str)
            result3 = reverse_string_recursive(test_str)
            result4 = reverse_string_list(test_str)
            
            print(f"Slicing:    '{result1}'")
            print(f"Iterative:  '{result2}'")
            print(f"Recursive:  '{result3}'")
            print(f"List:       '{result4}'")
            
            # Verify all methods produce same result
            assert result1 == result2 == result3 == result4, "Results don't match!"
            
            # Test word reversal
            word_reversed = reverse_words_in_string(test_str)
            print(f"Words rev:  '{word_reversed}'")
            
        except (TypeError, RecursionError) as e:
            print(f"Error: {e}")
    
    # Test edge cases
    print("\\nTesting edge cases:")
    print("=" * 20)
    
    try:
        reverse_string(123)
    except TypeError as e:
        print(f"Expected error for non-string input: {e}")
    
    # Performance comparison for large strings
    import time
    
    large_string = "a" * 10000
    print(f"\\nPerformance test with {len(large_string)} character string:")
    
    methods = [
        ("Slicing", reverse_string),
        ("Iterative", reverse_string_iterative),
        ("List", reverse_string_list)
    ]
    
    for name, func in methods:
        start_time = time.time()
        result = func(large_string)
        end_time = time.time()
        print(f"{name}: {end_time - start_time:.6f} seconds")

if __name__ == "__main__":
    main()`,
        explanation: `This Python solution provides multiple approaches to string reversal with comprehensive testing:

**Implementations Provided**:
1. **Slicing Method** (\`s[::-1]\`): Most Pythonic and efficient
2. **Iterative Method**: Character-by-character reversal
3. **Recursive Method**: Demonstrates recursion concept
4. **List Method**: Using list conversion and reverse()
5. **Word Reversal**: Bonus feature to reverse word order

**Key Features**:
- **Type Validation**: Ensures input is a string
- **Multiple Approaches**: Shows different algorithmic thinking
- **Performance Testing**: Compares efficiency of different methods
- **Edge Case Handling**: Empty strings, single characters, special characters
- **Comprehensive Testing**: Various test cases including palindromes

**Time Complexity**: 
- Slicing: O(n)
- Iterative: O(n²) due to string concatenation
- Recursive: O(n²) due to string slicing and concatenation
- List: O(n)

**Space Complexity**: O(n) for all methods

The slicing method is recommended for production use due to its efficiency and readability.`,
        language: 'python'
      };
    } else {
      return {
        code: `import java.util.*;

public class StringReversal {
    
    /**
     * Reverse a string using StringBuilder (most efficient).
     * 
     * @param str Input string to reverse
     * @return Reversed string
     * @throws IllegalArgumentException if input is null
     */
    public static String reverseString(String str) {
        if (str == null) {
            throw new IllegalArgumentException("Input string cannot be null");
        }
        
        return new StringBuilder(str).reverse().toString();
    }
    
    /**
     * Reverse string using character array approach.
     * 
     * @param str Input string to reverse
     * @return Reversed string
     * @throws IllegalArgumentException if input is null
     */
    public static String reverseStringCharArray(String str) {
        if (str == null) {
            throw new IllegalArgumentException("Input string cannot be null");
        }
        
        char[] charArray = str.toCharArray();
        int left = 0;
        int right = charArray.length - 1;
        
        while (left < right) {
            // Swap characters
            char temp = charArray[left];
            charArray[left] = charArray[right];
            charArray[right] = temp;
            
            left++;
            right--;
        }
        
        return new String(charArray);
    }
    
    /**
     * Reverse string using recursive approach.
     * 
     * @param str Input string to reverse
     * @return Reversed string
     * @throws IllegalArgumentException if input is null
     */
    public static String reverseStringRecursive(String str) {
        if (str == null) {
            throw new IllegalArgumentException("Input string cannot be null");
        }
        
        if (str.length() <= 1) {
            return str;
        }
        
        return str.charAt(str.length() - 1) + reverseStringRecursive(str.substring(0, str.length() - 1));
    }
    
    /**
     * Reverse string using iterative approach with StringBuilder.
     * 
     * @param str Input string to reverse
     * @return Reversed string
     * @throws IllegalArgumentException if input is null
     */
    public static String reverseStringIterative(String str) {
        if (str == null) {
            throw new IllegalArgumentException("Input string cannot be null");
        }
        
        StringBuilder result = new StringBuilder();
        
        for (int i = str.length() - 1; i >= 0; i--) {
            result.append(str.charAt(i));
        }
        
        return result.toString();
    }
    
    /**
     * Reverse the order of words in a string while keeping words intact.
     * 
     * @param str Input string with words
     * @return String with reversed word order
     * @throws IllegalArgumentException if input is null
     */
    public static String reverseWords(String str) {
        if (str == null) {
            throw new IllegalArgumentException("Input string cannot be null");
        }
        
        String[] words = str.trim().split("\\\\s+");
        StringBuilder result = new StringBuilder();
        
        for (int i = words.length - 1; i >= 0; i--) {
            result.append(words[i]);
            if (i > 0) {
                result.append(" ");
            }
        }
        
        return result.toString();
    }
    
    /**
     * Check if a string is a palindrome using the reverse function.
     * 
     * @param str Input string to check
     * @return true if string is a palindrome, false otherwise
     */
    public static boolean isPalindrome(String str) {
        if (str == null) {
            return false;
        }
        
        String cleaned = str.toLowerCase().replaceAll("[^a-zA-Z0-9]", "");
        return cleaned.equals(reverseString(cleaned));
    }
    
    public static void main(String[] args) {
        // Test cases
        String[] testCases = {
            "",
            "a",
            "hello",
            "Hello, World!",
            "12345",
            "A man a plan a canal Panama",
            "racecar",
            "The quick brown fox jumps over the lazy dog"
        };
        
        System.out.println("Testing string reversal functions:");
        System.out.println("=" + "=".repeat(60));
        
        for (String testStr : testCases) {
            System.out.println("\\nOriginal: '" + testStr + "'");
            
            try {
                String result1 = reverseString(testStr);
                String result2 = reverseStringCharArray(testStr);
                String result3 = reverseStringIterative(testStr);
                
                System.out.println("StringBuilder: '" + result1 + "'");
                System.out.println("Char Array:    '" + result2 + "'");
                System.out.println("Iterative:     '" + result3 + "'");
                
                // Test recursive for shorter strings to avoid stack overflow
                if (testStr.length() < 1000) {
                    String result4 = reverseStringRecursive(testStr);
                    System.out.println("Recursive:     '" + result4 + "'");
                    
                    // Verify all methods produce same result
                    if (!result1.equals(result2) || !result2.equals(result3) || !result3.equals(result4)) {
                        System.err.println("ERROR: Results don't match!");
                    }
                } else {
                    // Verify first three methods
                    if (!result1.equals(result2) || !result2.equals(result3)) {
                        System.err.println("ERROR: Results don't match!");
                    }
                }
                
                // Test word reversal
                String wordReversed = reverseWords(testStr);
                System.out.println("Words rev:     '" + wordReversed + "'");
                
                // Test palindrome check
                boolean isPalin = isPalindrome(testStr);
                System.out.println("Is palindrome: " + isPalin);
                
            } catch (IllegalArgumentException e) {
                System.err.println("Error: " + e.getMessage());
            }
        }
        
        // Test edge cases
        System.out.println("\\nTesting edge cases:");
        System.out.println("=" + "=".repeat(20));
        
        try {
            reverseString(null);
        } catch (IllegalArgumentException e) {
            System.out.println("Expected error for null input: " + e.getMessage());
        }
        
        // Performance comparison
        String largeString = "a".repeat(100000);
        System.out.println("\\nPerformance test with " + largeString.length() + " character string:");
        
        long startTime, endTime;
        
        // StringBuilder method
        startTime = System.nanoTime();
        reverseString(largeString);
        endTime = System.nanoTime();
        System.out.printf("StringBuilder: %.6f ms%n", (endTime - startTime) / 1_000_000.0);
        
        // Character array method
        startTime = System.nanoTime();
        reverseStringCharArray(largeString);
        endTime = System.nanoTime();
        System.out.printf("Char Array:    %.6f ms%n", (endTime - startTime) / 1_000_000.0);
        
        // Iterative method
        startTime = System.nanoTime();
        reverseStringIterative(largeString);
        endTime = System.nanoTime();
        System.out.printf("Iterative:     %.6f ms%n", (endTime - startTime) / 1_000_000.0);
        
        // Interactive mode
        Scanner scanner = new Scanner(System.in);
        System.out.print("\\nEnter a string to reverse (or 'quit' to exit): ");
        
        while (scanner.hasNextLine()) {
            String input = scanner.nextLine();
            if ("quit".equalsIgnoreCase(input.trim())) break;
            
            try {
                String reversed = reverseString(input);
                System.out.println("Reversed: '" + reversed + "'");
                System.out.println("Is palindrome: " + isPalindrome(input));
            } catch (IllegalArgumentException e) {
                System.err.println("Error: " + e.getMessage());
            }
            
            System.out.print("Enter another string (or 'quit' to exit): ");
        }
        
        scanner.close();
        System.out.println("Program terminated.");
    }
}`,
        explanation: `This Java solution provides multiple efficient approaches to string reversal with comprehensive functionality:

**Implementations Provided**:
1. **StringBuilder Method**: Most efficient using built-in reverse()
2. **Character Array Method**: In-place reversal using two pointers
3. **Recursive Method**: Demonstrates recursion (with stack overflow protection)
4. **Iterative Method**: Manual character-by-character reversal
5. **Word Reversal**: Reverses word order while preserving individual words
6. **Palindrome Check**: Bonus utility using string reversal

**Key Features**:
- **Null Safety**: Comprehensive null checking with meaningful exceptions
- **Performance Optimization**: StringBuilder for efficiency
- **Multiple Algorithms**: Different approaches for educational purposes
- **Interactive Mode**: User input capability for testing
- **Performance Benchmarking**: Timing comparison of different methods
- **Edge Case Handling**: Empty strings, single characters, large strings

**Time Complexity**:
- StringBuilder: O(n)
- Character Array: O(n)
- Iterative: O(n)
- Recursive: O(n) but with O(n) space overhead

**Space Complexity**: O(n) for all methods (result string)

The StringBuilder method is recommended for production use due to its optimal performance and built-in optimization.`,
        language: 'java'
      };
    }
  }

  // Default high-quality solution for other problems
  if (language === 'python') {
    return {
      code: `def solve_problem(data):
    """
    Generic problem solver template.
    
    Args:
        data: Input data for the problem
        
    Returns:
        Solution result
        
    Raises:
        ValueError: If input data is invalid
    """
    if data is None:
        raise ValueError("Input data cannot be None")
    
    # TODO: Implement specific problem logic here
    print(f"Processing data: {data}")
    
    # Example implementation for demonstration
    if isinstance(data, (list, tuple)):
        return len(data)
    elif isinstance(data, str):
        return data.upper()
    elif isinstance(data, (int, float)):
        return data * 2
    else:
        return str(data)

def validate_input(data):
    """Validate input data."""
    if data is None:
        return False
    return True

def main():
    """Test the problem solver with various inputs."""
    test_cases = [
        [1, 2, 3, 4, 5],
        "hello world",
        42,
        3.14,
        None
    ]
    
    print("Testing problem solver:")
    print("=" * 30)
    
    for i, test_data in enumerate(test_cases):
        print(f"\\nTest case {i + 1}: {test_data}")
        
        try:
            if validate_input(test_data):
                result = solve_problem(test_data)
                print(f"Result: {result}")
            else:
                print("Invalid input data")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()`,
      explanation: `This is a high-quality Python template that demonstrates best practices for problem-solving code:

**Key Features**:
1. **Comprehensive Documentation**: Detailed docstrings following Python conventions
2. **Input Validation**: Proper error handling and type checking
3. **Modular Design**: Separate functions for different responsibilities
4. **Exception Handling**: Appropriate use of try-catch blocks
5. **Type Flexibility**: Handles multiple input types gracefully
6. **Testing Framework**: Built-in test cases and validation

**Best Practices Demonstrated**:
- Clear function naming and structure
- Proper error messages and exception types
- Input validation before processing
- Comprehensive testing approach
- Clean, readable code organization

This template can be adapted for specific problem requirements while maintaining code quality and reliability.`,
      language: 'python'
    };
  } else {
    return {
      code: `import java.util.*;
import java.util.function.*;

public class ProblemSolver {
    
    /**
     * Generic problem solver template.
     * 
     * @param data Input data for the problem
     * @return Solution result
     * @throws IllegalArgumentException if input data is invalid
     */
    public static Object solveProblem(Object data) {
        if (data == null) {
            throw new IllegalArgumentException("Input data cannot be null");
        }
        
        // TODO: Implement specific problem logic here
        System.out.println("Processing data: " + data);
        
        // Example implementation for demonstration
        if (data instanceof Collection) {
            return ((Collection<?>) data).size();
        } else if (data instanceof String) {
            return ((String) data).toUpperCase();
        } else if (data instanceof Number) {
            return ((Number) data).doubleValue() * 2;
        } else {
            return data.toString();
        }
    }
    
    /**
     * Validate input data.
     * 
     * @param data Input data to validate
     * @return true if data is valid, false otherwise
     */
    public static boolean validateInput(Object data) {
        return data != null;
    }
    
    /**
     * Process a collection of data items.
     * 
     * @param dataList List of data items to process
     * @param processor Function to process each item
     * @return List of processed results
     */
    public static <T, R> List<R> processDataList(List<T> dataList, Function<T, R> processor) {
        if (dataList == null || processor == null) {
            throw new IllegalArgumentException("Data list and processor cannot be null");
        }
        
        List<R> results = new ArrayList<>();
        
        for (T item : dataList) {
            try {
                R result = processor.apply(item);
                results.add(result);
            } catch (Exception e) {
                System.err.println("Error processing item " + item + ": " + e.getMessage());
            }
        }
        
        return results;
    }
    
    public static void main(String[] args) {
        // Test cases
        Object[] testCases = {
            Arrays.asList(1, 2, 3, 4, 5),
            "hello world",
            42,
            3.14,
            null,
            new HashMap<String, Integer>() {{
                put("key1", 1);
                put("key2", 2);
            }}
        };
        
        System.out.println("Testing problem solver:");
        System.out.println("=" + "=".repeat(40));
        
        for (int i = 0; i < testCases.length; i++) {
            Object testData = testCases[i];
            System.out.println("\\nTest case " + (i + 1) + ": " + testData);
            
            try {
                if (validateInput(testData)) {
                    Object result = solveProblem(testData);
                    System.out.println("Result: " + result);
                } else {
                    System.out.println("Invalid input data");
                }
            } catch (Exception e) {
                System.err.println("Error: " + e.getMessage());
            }
        }
        
        // Test functional processing
        System.out.println("\\nTesting functional processing:");
        System.out.println("=" + "=".repeat(30));
        
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        
        // Square each number
        List<Integer> squares = processDataList(numbers, x -> x * x);
        System.out.println("Original: " + numbers);
        System.out.println("Squares: " + squares);
        
        // Convert to strings
        List<String> strings = processDataList(numbers, Object::toString);
        System.out.println("Strings: " + strings);
        
        // Performance measurement
        System.out.println("\\nPerformance test:");
        System.out.println("=" + "=".repeat(20));
        
        List<Integer> largeList = new ArrayList<>();
        for (int i = 0; i < 100000; i++) {
            largeList.add(i);
        }
        
        long startTime = System.nanoTime();
        List<Integer> processedList = processDataList(largeList, x -> x * 2);
        long endTime = System.nanoTime();
        
        System.out.printf("Processed %d items in %.3f ms%n", 
                         largeList.size(), 
                         (endTime - startTime) / 1_000_000.0);
        
        // Interactive mode
        Scanner scanner = new Scanner(System.in);
        System.out.print("\\nEnter data to process (or 'quit' to exit): ");
        
        while (scanner.hasNextLine()) {
            String input = scanner.nextLine().trim();
            if ("quit".equalsIgnoreCase(input)) break;
            
            try {
                Object result = solveProblem(input);
                System.out.println("Result: " + result);
            } catch (Exception e) {
                System.err.println("Error: " + e.getMessage());
            }
            
            System.out.print("Enter more data (or 'quit' to exit): ");
        }
        
        scanner.close();
        System.out.println("Program terminated.");
    }
}`,
      explanation: `This Java solution demonstrates enterprise-level code quality and best practices:

**Key Features**:
1. **Generic Design**: Uses Object type and generics for flexibility
2. **Functional Programming**: Incorporates Function interface for data processing
3. **Comprehensive Error Handling**: Proper exception management throughout
4. **Performance Monitoring**: Built-in timing and performance measurement
5. **Interactive Capabilities**: User input handling for testing
6. **Modular Architecture**: Clean separation of concerns

**Advanced Java Features**:
- **Generics**: Type-safe collection processing
- **Lambda Expressions**: Modern functional programming approach
- **Method References**: Clean, readable code style
- **Collections Framework**: Proper use of List, Map interfaces
- **Exception Handling**: Robust error management

**Design Patterns**:
- **Template Method**: Structured problem-solving approach
- **Strategy Pattern**: Functional interface for processing strategies
- **Builder Pattern**: Flexible object construction

**Performance Considerations**:
- Efficient collection processing
- Memory-conscious design
- Scalable architecture for large datasets

This template provides a solid foundation for complex problem-solving while maintaining code quality, readability, and performance.`,
      language: 'java'
    };
  }
};

export const generateSolution = async (problem: string): Promise<AIResponse> => {
  console.log('Generating high-quality solutions for problem:', problem.substring(0, 100) + '...');
  
  try {
    const { openai, anthropic } = getApiKeys();
    
    if (openai) {
      console.log('Using OpenAI API for enhanced code generation...');
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
        message: 'High-quality solutions generated successfully using OpenAI GPT-4'
      };
    }
    
    if (anthropic) {
      console.log('Using Anthropic API for enhanced code generation...');
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
        message: 'High-quality solutions generated successfully using Anthropic Claude'
      };
    }

    console.log('Using enhanced mock solutions (no API keys provided)...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      solutions: {
        python: getHighQualityMockSolution(problem, 'python'),
        java: getHighQualityMockSolution(problem, 'java')
      },
      status: 'success',
      message: 'High-quality demo solutions generated (add API keys to .env file for AI-powered solutions)'
    };

  } catch (error) {
    console.error('Error generating solutions:', error);
    
    return {
      solutions: {
        python: getHighQualityMockSolution(problem, 'python'),
        java: getHighQualityMockSolution(problem, 'java')
      },
      status: 'error',
      message: 'API error occurred, showing high-quality demo solutions'
    };
  }
};