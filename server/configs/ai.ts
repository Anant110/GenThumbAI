import { GoogleGenAI } from "@google/genai";

// create an object called ai by using the class GoogleGenAI and passing argument as api key
const ai=new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY as string
})

export default ai