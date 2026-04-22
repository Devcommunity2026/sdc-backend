import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URL)
        console.log(`MongoDB Connected: ${connection.connection.host}`)
    } catch (error) {
        console.log('connection failed', error)
    }
}
 
export default connectDb