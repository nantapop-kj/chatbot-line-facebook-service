# LINE And Facebook Chatbot with LLM Integration
This project is a simple chatbot built with **Express.js** that integrates with a **Large Language Model (LLM)** API (such as Mistral or GPT) to automatically respond to user messages on **LINE** and **Facebook Messenger**.

## Features
- **LINE Messaging API integration**  
  - Handles and responds to user text messages on LINE  
  - Sends messages to an LLM API and returns AI-generated replies
- **Facebook Messenger integration**  
  - Handles and responds to user text messages on Facebook Messenger  
  - Sends messages to an LLM API and returns AI-generated replies
- Clean **TypeScript** structure with interfaces and error handling
- **Docker-ready** for development
  
## Environment Variables
Create a `.env` file in the root directory and add the following:
  ```bash
  PORT=3001
  LINE_CHANNEL_SECRET=your_line_channel_secret
  LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
  FB_PAGE_ACCESS_TOKEN=your_fb_access_token
  FB_VERIFY_TOKEN=your_fb_verify_token
  LLM_API_KEY=your_llm_api_key
  LLM_API_URL=https://your-llm-api-endpoint
  LLM_MODEL_NAME=your_model_name
 ```

## How to Run
1. **Install dependencies**  
   ```bash
   npm install
   ```
2. **Start the server**
   ```bash
   npm start
   ```

## Test the Webhook
You can test your webhook locally using [ngrok](https://ngrok.com/):
  ```bash
   ngrok http 3001
   ```
Copy the generated HTTPS URL and paste it into your [LINE Developers](https://developers.line.biz/console/) Console as the webhook URL.

## Docker (Development)
  ```bash
  docker build -f dev.dockerfile -t line-fb-chatbot-demo-api .
 ```
  ```bash
  docker run -p 3001:3001 --env-file {your_local_path} line-fb-chatbot-demo-api
 ```