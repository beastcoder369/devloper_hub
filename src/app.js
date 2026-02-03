import express from "express"
import connectDB from "./config/database.js"
import AuthRouter from "./routes/auth.router.js";
import profileRouter from "./routes/profile.router.js";
import requestRouter from "./routes/request.router.js";
import cookieParser from "cookie-parser";
import userRouter from "../src/routes/user.router.js";
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/",AuthRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB().then(()=>{
    console.log("mongodb database connect suceefully");
    app.listen(3000, ()=>{
    console.log("server is running on localhost:3000")
}); 
}).catch((error)=>{
    console.error("database is not connected ");
});



