import express from "express"
import userAuth from "../middlewares/auth.js"


const requestRouter = express.Router();

requestRouter.post("/sendconnectionrequest",userAuth, async(req,res)=>{
    const user = req.user;
    console.log("send a connection request")
    res.send("the request is send");
});

export default requestRouter;