import mongoose from "mongoose"
import validator from "validator"

const userSchema = mongoose.Schema({
    fristName:{
        type : String,
        require:true,
        minLength:4,
        maxLength:14
        
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("your email is not correct validate");
            };
            
        }
    },
    password:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password is not safe");
            };
        }
        
    },
    age:{
        type:Number,
        require:true,
        min:18,
    },
    gender:{
        type:String,
        require:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data is not valid ");
            }
        }
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"write about your self"
    },
    skills:{
        type:[String],
        require:true
    }
});

const User = mongoose.model("User",userSchema);

export default User;