import { GoogleGenAI } from '@google/generative-ai';

// Initialize the Gemini client using the stable SDK syntax
const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getCodeReview = async (studentCode) => {
  try {
    // We use gemini-1.5-flash as it's the rock-solid free tier standard for text tasks
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `
        You are 'GitMentor', a kind, encouraging university professor reviewing a student's code commit.
        Your goal is to help them learn, not just give them copy-paste answers.
        1. Point out any syntax errors, bugs, or bad practices.
        2. Explain WHY it is an issue in simple terms.
        3. Give a helpful hint or guidance on how to fix it.
        4. NEVER give the full corrected code snippet directly. Make them think!
        Keep your response brief, supportive, and formatted cleanly in markdown.
      `
    });

    const result = await model.generateContent(studentCode);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "💡 The mentor is taking a quick coffee break. Please check your API key connection in your .env file and try again!";
  }
};