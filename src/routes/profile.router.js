import express from "express"
import userAuth from "../middlewares/auth.js"

const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth, async(req,res)=>{
   try{
    const user = req.user
    res.send(user);
   }catch(error){
    res.status(400).send("error"+error.message);
   }
});


export default profileRouter;