import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken, { isAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
    check("role", "Role is required and must be either 'user' or 'hotelOwner'").custom((value, { req }) => {
      // Only allow 'user' or 'hotelOwner' from the client
      if (value === "user" || value === "hotelOwner") return true;
      // Allow 'admin' only for the specific credentials
      if (
        value === "admin" &&
        req.body.email === "dilippoudel466@gmail.com" &&
        req.body.password === "123456"
      )
        return true;
      return false;
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Determine role
      let role = req.body.role;
      if (
        req.body.email === "dilippoudel466@gmail.com" &&
        req.body.password === "123456"
      ) {
        role = "admin";
      } else if (role !== "user" && role !== "hotelOwner") {
        return res.status(400).json({ message: "Invalid role selection" });
      }

      user = new User({ ...req.body, role });
      await user.save();

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production, false in dev
        maxAge: 86400000,
        sameSite: "lax", // or "none" if using HTTPS and cross-site
      });
      return res.status(200).json({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

// Admin: Get all users except admin
router.get("/all", verifyToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Admin: Delete a user or hotel owner by ID
router.delete("/:id", verifyToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;
