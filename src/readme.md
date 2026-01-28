mongodb+srv://kartikgame01:kartikgame246@cluster0.sufwbf5.mongodb.net/

<!--  database name create dev tinder data base  -->

for practice all routes are here 
import express from "express"
import connectDB from "./config/database.js"
import User from "./models/user.model.js"
import validateSignupdate from "./utlis/validation.js";
const app = express();
app.use(express.json());



app.post("/signup",async(req,res)=>{
    
    try{
        validateSignupdate(req);
        const {fristName,lastName,password,emailId}=req.body
        const passwordHash = await bcrypt.hash(password,10);
        const  user = new User({
            fristName,
            lastName,
            emailId,
            password:passwordHash,
        });
        await user.save();
        res.send("user added sucessfully");
    }catch(error){
        res.status(400).send("error saving the user" + error.message);
    }
});
app.post("/login", async(req,res)=>{

    try{
        const {emailId,password}=req.body;
        if(!emailId || !password){
            throw new Error("signup frist then login go to sign up page");
        }
        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("not present")
        }
        const isPasswordValid = bcrypt.compare(password,user.password);
        if(isPasswordValid){
            res.send("login successfully");
        }
        else{
            throw new Error("password is not correct ")
        }

    }catch(error){
        res.status(400).send("error"+ error.message)
    }

});
app.get("/feed", async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(error){
        res.status(404).send("not found")
    }

});

app.get("/user", async(req,res)=>{
    const userEmail = req.body.emailId;

    try{
        const users = await User.find({emailId:userEmail});
        if(users.length===0){
            res.status(404).send("user not found");
        }
        else{
            res.send(users);
        }

    }catch(error){
        res.status(404).send("not found")
    }
});

app.delete("/userdelete:userId", async(req,res)=>{
    const userId = req.params;
    try{
        const user = await User.findByIdAndDelete({_id:userId});
        res.send("user delete sucessfullyy");
    }catch(error){
        res.status(400).send("user not delete ")
    }
});

app.patch("/user:userId", async(req,res)=>{ 
    const userId = req.params?.userId;
    const data = req.body

    try{

        const ALLOWED_UPDATE=[
            "userId",
            "photoUrl",
            "about",
            "skills",
            "gender",
            "age"
        ];
        const isUpdateAllowed=Object.keys(data).every((k)=> ALLOWED_UPDATE.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed ");
        };
        if(data?.skills.length>14){
            throw new Error("only 14 skills are allowed")
        }
        await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true
        });
        res.send("user update sucessfully");

    }catch(error){
        res.status(404).send("user not found");

    }
})


connectDB().then(()=>{
    console.log("mongodb database connect suceefully");
    app.listen(3000, ()=>{
    console.log("server is running on localhost:3000")
}); 
}).catch((error)=>{
    console.error("database is not connected ");
});



