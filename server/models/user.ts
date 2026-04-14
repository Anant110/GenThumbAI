import mongoose from "mongoose";

// Use the below interface to create the user schema in mongoDB
export interface IUser extends Document{
    name: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// make the schema inside the mongodb 
const userSchema=new mongoose.Schema<IUser>({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true, unique:true, lowercase:true},
    password:{type:String, required:true, unique:true}

},{timestamps:true}) // which provides the details of createdAt as well as updateAt


// It means if the user model already created then use it otherwiase create it
const User=mongoose.models.User || mongoose.model<IUser>('User',userSchema)

export default User