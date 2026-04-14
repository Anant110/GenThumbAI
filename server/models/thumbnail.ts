import mongoose from "mongoose";


export interface IThumbnail extends Document{
    userId: string;
    title: string;
    description?: string;
    style: "Bold & Graphic" | "Tech/Futuristic" | "Minimalist" | "Photorealistic" | "Illustrated";
    aspect_ratio?: "16:9" | "1:1" | "9:16";
    color_scheme?: "vibrant" | "sunset" | "forest" | "neon" | "purple" | "monochrome" | "ocean" | "pastel";
    text_overlay?: boolean;
    image_url?: string;
    prompt_used?: string;
    user_prompt?: string;
    isGenerating?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const thumbnailSchema=new mongoose.Schema<IThumbnail>({
    // ref here in this case is userId linked to the user model
    userId:{type:String,ref:'User',required:true},
    // It means trim removes the extra spaces from the start and end
    title:{type:String,required:true,trim:true},
    description:{type:String,trim:true},
    // enum means users can only have one of these fixed values
    style:{type:String,required:true,enum:["Bold & Graphic" ,"Tech/Futuristic" ,"Minimalist" ,"Photorealistic" ,"Illustrated"]},
    aspect_ratio:{type:String,enum:["16:9" , "1:1" , "9:16"],default:"9:16"},
    color_scheme:{type:String,enum:["vibrant" ,"sunset" , "forest" , "neon" , "purple" , "monochrome" , "ocean" , "pastel"]},
    text_overlay:{type:Boolean, default:false},
    image_url:{type:String, default:''},
    prompt_used:{type:String,},
    user_prompt:{type:String},
    isGenerating:{type:Boolean, default:true},

}, { timestamps: true })

// when Thumnail database already created then use it otherwise create it
const Thumbnail=mongoose.models.Thumbnail || mongoose.model<IThumbnail>('Thumnail',thumbnailSchema)

export default Thumbnail