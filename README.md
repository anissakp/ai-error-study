# AI Error Message Study

This project was completed as part of Carnegie Mellon University’s 05-618: Human-AI Interaction Course. The goal is to study how different AI error message types affect user trust and willingness to continue using AI chatbots as learning tools.

Deployed at: https://anissakp.github.io/ai-error-study/

## Overview

This project consists of three chatbot variants that demonstrate different error communication strategies:
- **Chatbot A**: Actionable guidance (acknowledges the error, provides correct solution, explains helpful steps, educational and constructive)
- **Chatbot B**: Simple apology (apologizes sincerely, expresses empathy, does NOT provide solution, emotional support only)
- **Chatbot C**: Defensive blame-shifting (subtly blames user, suggests communication was unclear, defensive tone, does NOT provide solution)

## Installation and Usage

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/anissakp/ai-error-study.git
cd ai-error-study
```

### 2. Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new secret key
4. Copy the key (you won't see it again!)
5. Add billing info to your OpenAI account

### 3. Start the Server

**Using Python (built-in):**
```bash
npm start
```

Then open your browser and go to: `http://localhost:3000`

### 4. Use the Chatbot

1. On the homepage, select a chatbot version (a, b, or c)
2. Enter your OpenAI API key in the input field at the top
3. Click "Set Key" (you'll see a green checkmark)
4. Start chatting!

## Project Structure
```
.
├── index.html             # homepage with chatbot selection
├── chatbot-a.html         # actionable error variant
├── chatbot-b.html         # apology error variant
├── chatbot-c.html         # defensive error variant
└── README.md              # this file
