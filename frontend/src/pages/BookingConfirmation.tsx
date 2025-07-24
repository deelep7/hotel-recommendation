import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking: any = location.state?.booking;
  const hotelName: string = location.state?.hotelName || "Hotel";

  if (!booking) {
    return <div className="p-8">No booking details found.</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 border rounded-lg shadow bg-white">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Booking Confirmed!</h1>
      <div className="mb-4">
        <span className="font-semibold">Hotel:</span> {hotelName}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Check-in:</span> {new Date(booking.checkIn).toLocaleDateString()}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Check-out:</span> {new Date(booking.checkOut).toLocaleDateString()}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Guests:</span> {booking.adultCount} adults, {booking.childCount} children
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded font-bold text-lg hover:bg-blue-700 mt-6"
        onClick={() => navigate("/my-bookings")}
      >
        Go to My Bookings
      </button>
    </div>
  );
};

export default BookingConfirmation; 