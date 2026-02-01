import express from "express"
import userAuth from "../middlewares/auth.js"
import validateEditProfileData from "../utlis/validation.js"

const profileRouter = express.Router();


profileRouter.get("/profile/view",userAuth, async(req,res)=>{
   try{
    const user = req.user
    res.send(user);
   }catch(error){
    res.status(400).send("error"+error.message);
   }
});
profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
   try{
      if(!validateEditProfileData){ 
         throw new Error("invalid request");
      }
      const loggedInUser = req.user;
      Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
});
      await loggedInUser.save();
      res.send("the profile update complete");
   }catch(error){
      res.status(400).send("error"+error.message);
   }
});
profileRouter.patch("/profile/forgot-password", userAuth, async(req,res)=>{

});

export default profileRouter;