import { Request, Response } from "express";
import ai from "../configs/ai.js";

export const CompareThumbnail = async (req: Request, res: Response) => {
  try {
    const images = req.files as Express.Multer.File[];
    // console.log(images);
    // res.send("OK")
    // convert the images into base 64
    const image1 = images[0].buffer.toString("base64");
    const image2 = images[1].buffer.toString("base64");
    const type1 = images[0].mimetype;
    // console.log(image1)
    const type2 = images[1].mimetype;
    // console.group(type1);
    // console.log(type2);

    const prompt = `
            You are an expert YouTube Thumbnail Analyst.

            Compare the two thumbnails.

            Evaluate:
            - Click-through potential
            - Readability
            - Colors
            - Facial expression
            - Emotional impact
            - Composition
            - Text visibility
            - Curiosity factor

            Return ONLY valid JSON in this format:

            {
            "winner": "Thumbnail A",
            "thumbnailAScore": 88,
            "thumbnailBScore": 73,
            "suggestions": [
                "Increase text size in Thumbnail B",
                "Improve color contrast",
                "Add stronger emotional expression",
                "Reduce visual clutter",
                "Use brighter CTA elements"
            ]
            }

            Rules:
            - Provide each sentence of suggestions with short and concise format
        `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: type1,
            data: image1,
          },
        },
        {
          inlineData: {
            mimeType: type2,
            data: image2,
          },
        },
        {
            text:prompt
        }
      ],
    });
    const geminiResponse=response.text
    if(!geminiResponse){
        throw new Error("No response come from the Gemini ")
    }
    const cleaned_response = geminiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
    const analysis=JSON.parse(cleaned_response)
    res.json(analysis)
        
  } catch (error) {
    console.log(error);
  }
};
