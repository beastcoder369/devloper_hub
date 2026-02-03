import express from "express"
import userAuth from "../middlewares/auth.js";
import connectionRequest from "../models/connectionRequest.js";
import User from "../models/user.model.js";

const userRouter = express.Router();


userRouter.get("/user/request/reccived", userAuth , async(req , res)=>{
    try{
        const safedata = ["firstName","lastName","skills","about","photoUrl","gender"];
        const loggedInUser = req.user;
        const connectionRequestData = await connectionRequest.find({
            toUserId:loggedInUser._id,
            status:"intrested"
        }).populate("fromUserId",safedata)

        res.json({message:"data fetched succesfully", 
            data:connectionRequestData
        });

    }catch(error){
        res.status(400).json("error"+ error.message);
    }
});


userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const safeData = ["firstName", "lastName", "skills", "about", "photoUrl", "gender"];
    const loggedInUser = req.user;

    const connectionRequestData = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" }
        ],
      })
      .populate("fromUserId", safeData)
      .populate("toUserId", safeData);

    const data = connectionRequestData.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.status(200).json({
      message: "All connections fetched successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const safeData = ["firstName", "lastName", "skills", "about", "photoUrl", "gender"];
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequestData = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id },
          { toUserId: loggedInUser._id }
        ]
      })
      .select("fromUserId toUserId");

    const hideUserFeed = new Set();

    connectionRequestData.forEach((req) => {
      hideUserFeed.add(req.fromUserId.toString());
      hideUserFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      _id: {
        $nin: Array.from(hideUserFeed),
        $ne: loggedInUser._id
      }
    })
      .select(safeData)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ data: users });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});



export default userRouter;