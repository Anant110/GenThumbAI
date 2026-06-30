import Thumbnail from "../models/thumbnail.js";
import { HarmBlockThreshold } from "@google/genai";
import { HarmCategory } from "@google/genai";
import ai from "../configs/ai.js";
import path from "node:path";
import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';
import { Server } from "socket.io";
const io = new Server();
io.on("connection", (socket) => {
    console.log(socket);
    console.log(`Socket ${socket.id} is connected`);
});
const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style'
};
const colorSchemeDescriptions = {
    'vibrant': 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
    'sunset': 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
    'forest': 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
    'neon': 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
    'purple': 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
    'monochrome': 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
    'ocean': 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
    'pastel': 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',
};
// this controller function create the thumbnail inside the mongodb database
export const generateThumnail = async (req, res) => {
    try {
        // fetching userId from the sessions
        const { userId } = req.session;
        // fetching data from the frontend
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay, } = req.body;
        //  store the data inside the mongoDB
        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true,
        });
        const model = 'gemini-2.5-flash';
        // to create control how ai generates the output we create the generation config
        const generationConfig = {
            // this is the maximum length of the output
            maxOutputTokens: 32768,
            // It controls creativity and accuracy if 0 then very strict,pridicatable if >1 the very creative/random
            temperature: 1, // normal creativity,blanced
            // way to controll the randomness,Model chooses words from top 95% most likely options lower:safter, higer:more diverse
            topP: 0.95,
            // tells model what type of output you want
            responseModalities: ['IMAGE'],
            imageConfig: {
                //size of the image, getting aspect ratio from request
                aspectRatio: aspect_ratio || '16:9',
                //resolution,quality
                imageSize: '1K'
            },
            // tells ai that these make sure these setting should be there to create the thumbnail
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
            ]
        };
        // start the prompt taking style as key for styleprompts and use title we do this to give this prompt to ai
        let prompt = `Create a ${stylePrompts[style]} for:${title}`; //typescript styling
        //when color_scheme is not null use color_scheme as the key of colorSchemeDescriptions
        if (color_scheme) {
            prompt += `Use a ${colorSchemeDescriptions[color_scheme]}`; //typescript styling
        }
        // when user add the additional details then adding it
        if (user_prompt) {
            prompt += `Additional details: ${user_prompt}.`;
        }
        // adjust thumnail according to the user aspect ratio
        prompt += `The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through rate. Make it bold, professional, and impossible to ignore.`;
        // Generate the image using the ai model
        const response = await ai.models.generateContent({
            // initialize model
            model,
            // contents store the prompt
            contents: [prompt],
            config: generationConfig
        });
        // ✅ Step 1: Check if response structure is valid
        // Using optional chaining (?.) to safely access nested data
        // If any part is missing → throw error
        if (!response?.candidates?.[0]?.content?.parts) {
            throw new Error('Unexpected Response');
        }
        // extract the parts array from the response
        // parts contains text or image data returned by ai
        const parts = response.candidates[0].content.parts;
        // create a variable to store image data buffer
        // initially null because we do not have the data yet
        let finalBuffer = null;
        // loop through all parts
        for (const part of parts) {
            // check if part contains the image data
            if (part.inlineData) {
                // convert base64 image->Buffer(binary format)
                // 'base64' tells nodejs how to decode the data
                finalBuffer = Buffer.from(part.inlineData.data, 'base64');
            }
        }
        // you are creating the unique file name and save it inside the images folder
        // example
        // filename = "final-output-1712334567890.png"
        // filepath = "images/final-output-1712334567890.png"
        const filename = `final-output-${Date.now()}.png`;
        const filepath = path.join('images', filename);
        // create the images directory if it doesn't exist
        // fs is the file system and mkdirsync i make directory synchronously
        // It means that create the folder images if already there then don't create it use the same folder
        fs.mkdirSync('images', { recursive: true });
        // write the final image to the file
        // take the image data finalBuffer and save it in a filepath,final buffer should not be null so use !
        fs.writeFileSync(filepath, finalBuffer);
        // upload image by the use of cloudinary
        const uploadResult = await cloudinary.uploader.upload(filepath, { resource_type: 'image' });
        // store the uploadResult url inside the mongodb
        thumbnail.image_url = uploadResult.url;
        // when thumnail geneartion completes then return false
        thumbnail.isGenerating = false;
        // save the data inside the mongoDB
        await thumbnail.save();
        // provide the response
        res.json({
            message: "Thumbnail Generated",
            thumbnail
        });
        // remove the image from the disk because the image is the temperory we delete it after strong in cloud
        // we delete beacause disk space is limited if we don't delete thousand of the files are there
        fs.unlinkSync(filepath);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};
// To delete the thumnail inside the database
export const deleteThumbnail = async (req, res) => {
    try {
        // fetching the id from the url
        const { id } = req.params;
        // getting the userid from the sessions
        const { userId } = req.session;
        // delete this id and userId from the database,_id should be id
        await Thumbnail.findByIdAndDelete({ _id: id, userId });
        res.json({ message: "Thumbnail deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
};
