import mongoose from 'mongoose'

const connectDB=async()=>{
    try {
        // telling connection is ready or getting some error
        mongoose.connection.on("connected",()=>console.log("MongoDB is connected"))

        // waiting sometime to connect with mongoose, fetching url from the env file
        await mongoose.connect(process.env.MONGODB_URI as string)

    } catch (error) {
        console.log('Error connecting to MongoDB',error)
    }
}

export default connectDB;