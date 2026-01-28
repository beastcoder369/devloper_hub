
import mongoose from "mongoose"

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://kartikgame01:kartikgame246@cluster0.sufwbf5.mongodb.net/dev_hub");
};

export default  connectDB;