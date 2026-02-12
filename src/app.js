import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";
import AuthRouter from "./routes/auth.router.js";
import profileRouter from "./routes/profile.router.js";
import requestRouter from "./routes/request.router.js";
import userRouter from "./routes/user.router.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/api", AuthRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

connectDB()
  .then(() => {
    console.log("MongoDB database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Database is not connected", error);
  });
