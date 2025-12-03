# AI Error Message Study

This project was completed as part of Carnegie Mellon University’s 05-618: Human-AI Interaction Course. The goal is to study how different AI error message types affect user trust and willingness to continue using AI chatbots as learning tools.

## Overview

This project consists of three chatbot variants that demonstrate different error communication strategies:
- **Chatbot A**: Actionable guidance (acknowledges the error, provides correct solution, explains helpful steps, educational and constructive)
- **Chatbot B**: Simple apology (apologizes sincerely, expresses empathy, does NOT provide solution, emotional support only)
- **Chatbot C**: Defensive blame-shifting (subtly blames user, suggests communication was unclear, defensive tone, does NOT provide solution)

Each chatbot uses OpenAI's API and is designed to:
- Give an intentionally wrong answer when asked for specific help
- Trigger one of three error response types when the user points out the mistake

## Installation and Usage

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/anissakp/ai-error-study.git
cd ai-error-study
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the project root:
```bash
touch.env

```

Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=sk-your-actual-openai-key-here
PORT=3000
```

### 4. Start the Server

**Using Python (built-in):**
```bash
npm start
```

Then open your browser and go to: `http://localhost:3000`

### 4. Use the Chatbot

1. On the homepage, select a chatbot version (a, b, or c)
- chatbot a: actionable error variant
- chatbot b: apology error variant
- chatbot c: defensive error variant
2. Start chatting!
