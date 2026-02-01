import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        status:{
            type:String,
            enum:{
                values:["ignored","intrested","accepted","rejected"],
                message:`{value} is in correct status type`
            }
        }
    },{timestamps:true}
);
connectionRequestSchema.pre("save",function(){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself");
    }
});

const connectionRequest = new mongoose.model("connectionRequest",connectionRequestSchema);
export default connectionRequest;