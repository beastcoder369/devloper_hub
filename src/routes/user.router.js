import express from "express"
import userAuth from "../middlewares/auth.js";
import connectionRequest from "../models/connectionRequest.js";
import User from "../models/user.model.js";

const userRouter = express.Router();


userRouter.get("/user/request/reccived", userAuth , async(req , res)=>{
    try{
        const safedata = ["firstName","lastName","skills","about","photoUrl","gender"];
        const loggedInUser = req.user;
        const connectionRequest = await connectionRequest.find({
            toUserId:loggedInUser._id,
            status:"intrested"
        }).populate("fromUserId",safedata)

        res.json({message:"data fetched succesfully", 
            data:connectionRequest
        });

    }catch(error){
        res.status(400).json("error"+ error.message);
    }
});


userRouter.get("/user/connection" , userAuth , async(req,res)=>{
    try{
        const safedata = ["firstName","lastName","skills","about","photoUrl","gender"];
        const loggedInUser = req.user;
        const connectionRequest = await connectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id , status:"accepted"},
                {fromUserId:loggedInUser._id , status:"accepted"}
            ],
        }).populate("fromUserId" , safedata) .populate("toUserId" , safedata)

        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.tostring() === loggedInUser._id.tostring()){
                return row.toUserId;
            }
           else{
             return row.fromUserId;
           }
        });
        res.json({message:"all data get "+ data});

    }catch(error){
        res.status(400).json({message:"error"+ error.message});
    }

});

userRouter.get("/feed", userAuth , async(req , res)=>{
    try{
        const safedata = ["firstName","lastName","skills","about","photoUrl","gender"];
        const loggedInUser = req.user;
        const page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        limit = limit>50?50:limit;
        skip = (page-1)*limit;
        const connectionRequest = await connectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUserFeed = new set();
        connectionRequest.forEach(req=>{
            hideUserFeed.add(req.fromUserId.tostring());
            hideUserFeed.add(req.toUserId.tostring());
        });

        const user = await new User.find({
            $and:[
                {$nin:Array.from(hideUserFeed)},
                {$ne:loggedInUser._id}

            ].skip(skip).limit(limit)
        }).select(safedata)

        res.json({data:user});

    }catch(error){
        res.send("error"+error.message);
    }
}); 


export default userRouter;