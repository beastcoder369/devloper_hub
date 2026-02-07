import express from "express"
const AuthRouter = express.Router();
import validateSignupData from "../utlis/validation.js"
import bcrypt from "bcrypt"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = express();


AuthRouter.post("/signup", async(req, res) => {
  try {
   validateSignupData(req);
    const { firstName, lastName, password, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added sucessfully");
  } catch(error){
    res.status(400).send("error something wrong" + error.message);
  }
});

AuthRouter.post("/login", async(req,res)=>{

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
            res.send(user,"login successfully");
        }
        else{
            throw new Error("password is not correct ")
        }

    }catch(error){
        res.status(400).send("error"+ error.message)
    }

});
AuthRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("logout successfully");
});


export default AuthRouter;