import validator from "validator"


const validateSignupData =(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("name is not valid ");
    }
    else if (!validator.isEmail(emailId)){
        throw new Error("the email is not corret ");
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error("enter  a strong password ");
    }

};

export default validateSignupData;