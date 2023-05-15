import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName : "mernotpdb"
        }
        
        mongoose.set('strictQuery', true); //to remove mongoose deprecation mongoose error
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log("Database connected successfully")
    } catch (error) {
        console.log('Could not connect to database')
    }
}

export default connectDB;