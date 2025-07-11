# Welcome to your Lovable project

## Code Solution Generator

An AI-powered application that generates high-quality, production-ready code solutions in both Java and Python. Features include image OCR for problem input, comprehensive error handling, and a feedback system for continuous improvement.

### Features

- **Dual Language Solutions**: Get solutions in both Java and Python
- **Image OCR**: Upload images of coding problems using Tesseract.js and OCR.space API
- **High-Quality Code**: Production-ready code with error handling and best practices
- **Feedback System**: Report issues and help improve the AI
- **Interactive Testing**: Built-in test cases and examples
- **Performance Optimized**: Efficient algorithms and clean code structure

### Setup Instructions

1. **Environment Variables**: Copy `.env.example` to `.env` and add your API keys:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   VITE_OCR_SPACE_API_KEY=your_ocr_space_api_key_here
   ```

2. **OCR.space API Setup** (Optional - Tesseract.js works without API key):
   - Go to [OCR.space](https://ocr.space/ocrapi)
   - Register for a free account
   - Get your free API key (500 requests/day)
   - Add the API key to your `.env` file

3. **AI API Setup** (Optional - app works with mock data without these):
   - **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Anthropic**: Get API key from [Anthropic Console](https://console.anthropic.com/)

### OCR Features

- **Tesseract.js**: Free, client-side OCR that works offline
- **OCR.space API**: Backup OCR service with 500 free requests/day
- **Smart Fallback**: Automatically tries multiple OCR methods
- **File Support**: JPG, PNG, GIF, BMP images up to 10MB
- **Mock OCR**: Works even without API keys for demonstration

## Project info

**URL**: https://lovable.dev/projects/8d57b989-e3bb-40d8-943a-40442334b800

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8d57b989-e3bb-40d8-943a-40442334b800) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8d57b989-e3bb-40d8-943a-40442334b800) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)