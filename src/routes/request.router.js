import express from "express"
import userAuth from "../middlewares/auth.js"
import connectionRequest from "../models/connectionRequest.js";
import User from "../models/user.model.js";



const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: req.user.firstName + " is " + status + " in " + toUser.firstName
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingConnectionRequest =
        await connectionRequest.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
          ]
        }).populate("fromUserId toUserId",["firstName","lastName"]);

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists"
        });
      }

      const connectionRequestDoc = new connectionRequest({
        fromUserId,
        toUserId,
        status
      });

      const data = await connectionRequestDoc.save();

      res.json({
        message: "Connection request sent successfully",
        data
      });

    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Only accepted or rejected is allowed",
        });
      }

      const connectionRequestData = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "intrested", 
      });

      if (!connectionRequestData) {
        return res.status(404).json({
          message: "No connection request found",
        });
      }

      connectionRequestData.status = status;
      const data = await connectionRequestData.save();

      return res.status(200).json({
        message: `Connection request ${status}`,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);





export default requestRouter;