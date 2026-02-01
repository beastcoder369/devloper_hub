import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 14,
    trim: true
  },

  lastName: {
    type: String,
    trim: true
  },

  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    }
  },

  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password is not strong enough");
      }
    }
  },

  age: {
    type: Number,
    min: 18
  },

  gender: {
    type: String,
    lowercase: true,
    enum: ["male", "female", "others"]
  },

  photoUrl: {
    type: String
  },

  about: {
    type: String,
    default: "Write about yourself"
  },

  skills: {
    type: [String]
  }
});
userSchema.methods.getJwt = async function () {
  const user = this;

  const token = jwt.sign(
    { _id: user._id },
    "kartikgame@1234",
    {
      expiresIn: "1d"
    }
  );

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};


const User = mongoose.model("User", userSchema);
export default User;
