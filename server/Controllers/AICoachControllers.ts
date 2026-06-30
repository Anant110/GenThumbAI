
import { Request, Response } from 'express';
import ai from '../configs/ai.js';

export const AICoach = async (req: Request, res: Response) => {
        const {message,score,suggestions,titles}=req.body
        // console.log(message)
        // console.log(suggestions.join("\n"))
        // console.log(titles.join("\n"))
        const suggestionsArray = suggestions.join("\n");
        const titlesArray = titles.join("\n");
    
        // providing the response to AI
          const prompt = `
            You are an AI Thumbnail Coach.
    
            Rules:
           - Keep answers under 4 sentences.
    
            Thumbnail Score: ${score}
    
            Suggestions:${suggestionsArray}
            
            Titles:${titlesArray}
    
            User Question:${message}
            `;
    
        // console.log(prompt)
    
        const result=await ai.models.generateContent({
            model:'gemini-2.5-flash',
            contents:prompt
        })
    
        // console.log(result.text)
        res.json({
            reply:result.text
        })
}