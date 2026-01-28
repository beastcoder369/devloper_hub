import express from "express"
import connectDB from "./config/database.js"
import User from "./models/user.model.js"
import validateSignupData from "./utlis/validation.js"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import userAuth from "./middlewares/auth.js"
const app = express();
app.use(express.json());
app.use(cookieParser());




app.post("/signup", async (req, res) => {
  try {
   validateSignupData(req);
    const { fristName, lastName, password, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      fristName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added sucessfully");
  } catch (error) {
    res.status(400).send("error saving the user" + error.message);
  }
});
app.post("/login", async(req,res)=>{

    try{
        const { emailId , password } = req.body;
        if(!emailId || !password){
            throw new Error("signup frist then login go to sign up page");
        }
        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("not present")
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            const token = jwt.sign({ _id: user._id }, "kartikgame@1234",{ expiresIn: "1d" });
            // console.log(token);
            res.cookie("token",token,{
                httpOnly:true
            });
            res.send("login successfully");
        }
        else{
            throw new Error("password is not correct ")
        }

    }catch(error){
        res.status(400).send("error"+ error.message)
    }

});
app.get("/profile",userAuth, async(req,res)=>{
   try{
    const user = req.user
    res.send(user);
   }catch(error){
    res.status(400).send("error"+error.message);
   }
});
app.post("/sendconnectionrequest",userAuth, async(req,res)=>{
    const user = req.user;
    console.log("send a connection request")
    res.send("the request is send");
});
 


connectDB().then(()=>{
    console.log("mongodb database connect suceefully");
    app.listen(3000, ()=>{
    console.log("server is running on localhost:3000")
}); 
}).catch((error)=>{
    console.error("database is not connected ");
});



