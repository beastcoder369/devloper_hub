import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

const userAuth = async(req , res , next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("please Login")
        }
        const decodeObj =  jwt.verify(token,"kartikgame@1234");
        const {_id}  = decodeObj;
        const user = await  User.findById(_id);
        if(!user){
            throw new Error("user not found");
        }
        req.user = user
        next();

    }catch(error){
        res.status(400).send("error"+error.message);

    }
};

export default userAuth;
