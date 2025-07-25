import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import User from "./models/user";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureAdminUser = async () => {
  const adminEmail = "dilippoudel466@gmail.com";
  const adminPassword = "123456";
  const adminFirstName = "Dilip";
  const adminLastName = "Poudel";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({
      email: adminEmail,
      password: adminPassword,
      firstName: adminFirstName,
      lastName: adminLastName,
      role: "admin",
    });
    await admin.save();
    console.log("Admin user created.");
  } else if (admin.role !== "admin") {
    admin.role = "admin";
    await admin.save();
    console.log("Admin user role updated to admin.");
  }
};

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  ensureAdminUser();
});

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(3000, () => {
  console.log("server running on localhost:3000");
});
