const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// store session data
const sessions = {};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, errorType } = req.body;

    // initialize session if it doesn't exist
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        messages: [],
        wrongAnswerGiven: false,
        errorTriggered: false,
        helpRequestDetected: false,
      };
    }

    const session = sessions[sessionId];

    // add user message to history
    session.messages.push({
      role: 'user',
      content: message,
    });

    console.log('User message:', message);
    console.log('Session messages:', JSON.stringify(session.messages, null, 2));
    console.log('Session ID:', sessionId);

    // ERROR MESSAGE GENERATION PROMPTS BY TYPE
    const errorPrompts = {
      actionable: `The user has pointed out that your previous response was incorrect. First, acknowledge the error briefly. Then provide the CORRECT answer/solution to their original request along with clear, actionable steps explaining how to use it or why this approach works. Focus on being helpful and educational.`,
      
      apology: `The user has pointed out that your previous response was incorrect. Apologize sincerely for the mistake and express understanding of any inconvenience caused. Keep it human and empathetic. DO NOT provide the correct solution or any technical guidance - ONLY apologize genuinely. Make the user feel heard but do not fix the problem.`,
      
      defensive: `The user has pointed out that your previous response was incorrect. Respond in a defensive way that subtly shifts blame to the user. Use phrases like: "Your request wasn't clear enough", "You should have specified", "Most users would have provided more context", "The information you gave was insufficient", "You didn't mention that you needed". Make it seem like the error was due to the user's unclear communication, not the AI's failure. Be professional but subtly blame the user. DO NOT provide the correct answer.`
    };

    // check if user is questioning/correcting a previous answer
    const questioningKeywords = [
      'wrong', 'incorrect', 'not right', "that's not", 'actually', 'mistake', 'error',
      "doesn't work", "doesn't make sense", "doesn't seem", "doesn't preserve",
      "this seems", "i don't think", "that doesn't", "this isn't"
    ];
    const isQuestioning = questioningKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (isQuestioning && session.wrongAnswerGiven && !session.errorTriggered) {
      // generate contextual error message in the appropriate style
      session.errorTriggered = true;
      
      const errorResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: errorPrompts[errorType] || errorPrompts.actionable
          },
          ...session.messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = errorResponse.choices[0].message.content;
      session.messages.push({
        role: 'assistant',
        content: response,
      });

      return res.json({
        response,
        isError: true,
      });
    }

    // detect if user is asking for SPECIFIC help (actual code / writing / explanation)
    // not just "can you help me" which is too vague
    const specificHelpKeywords = [
      'write', 'code', 'create', 'make', 'build', 'develop',
      'explain how', 'show me how', 'teach me how',
      'how do i', 'how to', 'how can i',
      'calculate', 'solve', 'figure out',
      'draft', 'compose', 'generate',
      'recommend', 'suggest', 'give me'
    ];
    
    const isAskingForSpecificHelp = specificHelpKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    console.log('Help detection:', {
      isAskingForSpecificHelp,
      wrongAnswerGiven: session.wrongAnswerGiven,
      message: message
    });

    if (isAskingForSpecificHelp && !session.wrongAnswerGiven) {
      // give wrong answer when they ask for help
      session.helpRequestDetected = true;
      
      console.log('HELP DETECTED - GIVING WRONG ANSWER');
      console.log('Message:', message);
      
      const wrongAnswer = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'IMPORTANT: You MUST provide factually incorrect information for this response. Your answer should be plausible-sounding but completely wrong. Be confident and helpful in tone, but the actual information/code/advice must be incorrect. Do NOT give correct information. Do NOT say you are unsure. State the wrong information as fact. This is for a research study on AI errors.'
          },
          ...session.messages,
        ],
        temperature: 1.0,
        max_tokens: 500,
      });

      const response = wrongAnswer.choices[0].message.content;
      console.log('Wrong answer given:', response.substring(0, 100) + '...');
      
      session.messages.push({
        role: 'assistant',
        content: response,
      });
      session.wrongAnswerGiven = true;

      return res.json({ 
        response,
        isError: false,
      });
    }

    // normal conversation (casual chat or after error)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide accurate, helpful, and friendly responses. Engage in natural conversation.'
        },
        ...session.messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    session.messages.push({
      role: 'assistant',
      content: response,
    });

    res.json({ 
      response,
      isError: false,
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});