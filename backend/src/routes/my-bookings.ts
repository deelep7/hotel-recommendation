import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

// Cancel a booking for the current user
router.delete('/:hotelId/:bookingId', verifyToken, async (req: Request, res: Response) => {
  try {
    const { hotelId, bookingId } = req.params;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    const bookingIndex = hotel.bookings.findIndex(
      (b: any) => b._id.toString() === bookingId && b.userId === req.userId
    );
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found or not owned by user' });
    }
    hotel.bookings.splice(bookingIndex, 1);
    await hotel.save();
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

// Edit a booking for the current user
router.put('/:hotelId/:bookingId', verifyToken, async (req: Request, res: Response) => {
  try {
    const { hotelId, bookingId } = req.params;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    const booking = hotel.bookings.find(
      (b: any) => b._id.toString() === bookingId && b.userId === req.userId
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not owned by user' });
    }
    // Update allowed fields
    const { checkIn, checkOut, adultCount, childCount } = req.body;
    if (checkIn) booking.checkIn = checkIn;
    if (checkOut) booking.checkOut = checkOut;
    if (adultCount) booking.adultCount = adultCount;
    if (childCount !== undefined) booking.childCount = childCount;
    await hotel.save();
    res.json({ message: 'Booking updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
});

export default router;
