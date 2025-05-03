import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotels";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    }
});

// Create a new hotel
router.post("/", verifyToken, [
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('City is required'),
    body("country").notEmpty().withMessage('Country is required'),
    body("description").notEmpty().withMessage('Description is required'),
    body("type").notEmpty().withMessage('Hotel Type is required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('Price per night is required and must be a number'),
    body("facilities").notEmpty().isArray().withMessage('Facilities are required'),
],
upload.array("imageFiles", 6), async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];

        // Ensure files are present
        if (!imageFiles || imageFiles.length === 0) {
            return res.status(400).json({ message: "At least one image is required." });
        }

        // Parse req.body as HotelType
        const newHotel: HotelType = {
            ...req.body,
            imageUrls: await uploadImages(imageFiles), // Upload images to Cloudinary
            lastUpdated: new Date(),
            userID: req.userId, // Set the current user ID from token
        };

        // Save the new hotel to the database
        const hotel = new Hotel(newHotel);
        await hotel.save();

        res.status(201).json(hotel);
    } catch (e) {
        console.log("Error creating hotel:", e);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Get all hotels for the current user
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userID: req.userId });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
});

// Get a hotel by ID
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userID: req.userId
        });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotel" });
    }
});

// Update an existing hotel
router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];

        // Prepare updated fields
        const updatedHotel: Partial<HotelType> = {
            ...req.body,
            lastUpdated: new Date(),
        };

        // Handle existing image URLs (from the form)
        if (req.body.imageUrls) {
            updatedHotel.imageUrls = Array.isArray(req.body.imageUrls)
                ? req.body.imageUrls
                : [req.body.imageUrls]; // Handles both single and multiple URLs
        } else {
            updatedHotel.imageUrls = [];
        }

        // Upload new images if provided
        if (files && files.length > 0) {
            const uploadedUrls = await uploadImages(files);
            updatedHotel.imageUrls = [...(updatedHotel.imageUrls || []), ...uploadedUrls];
        }

        // Now update in DB
        const hotel = await Hotel.findOneAndUpdate(
            { _id: req.params.hotelId, userID: req.userId },
            updatedHotel,
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.status(200).json(hotel);
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Helper function to upload images to Cloudinary
async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${b64}`;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;
