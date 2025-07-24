import { useQuery, useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useMemo, useState } from "react";

const MyBookings = () => {
  const { userRole, showToast } = useAppContext();
  const { data: hotels } = useQuery(
    userRole === "hotelOwner" ? "fetchMyHotels" : "fetchMyBookings",
    userRole === "hotelOwner" ? apiClient.fetchMyHotels : apiClient.fetchMyBookings
  );

  // For hotel owners, aggregate all bookings for their hotels
  const allBookings = useMemo(() => {
    if (userRole !== "hotelOwner" || !hotels) return [];
    return hotels.flatMap((hotel: any) =>
      (hotel.bookings || []).map((booking: any) => ({
        ...booking,
        hotelName: hotel.name,
        hotelId: hotel._id,
      }))
    );
  }, [userRole, hotels]);

  const [cancelConfirm, setCancelConfirm] = useState<{ hotelId: string; bookingId: string } | null>(null);
  // Use correct API for cancellation based on role
  const { mutate: cancelBooking } = useMutation(
    ({ hotelId, bookingId }: { hotelId: string; bookingId: string }) =>
      userRole === "hotelOwner"
        ? apiClient.deleteHotelBooking(hotelId, bookingId)
        : apiClient.cancelUserBooking(hotelId, bookingId),
    {
      onSuccess: () => {
        showToast({ message: "Booking cancelled successfully!", type: "SUCCESS" });
        window.location.reload();
      },
      onError: () => {
        showToast({ message: "Failed to cancel booking", type: "ERROR" });
      },
    }
  );

  const [editBooking, setEditBooking] = useState<any>(null);
  const { mutate: updateBooking } = useMutation(
    ({ hotelId, bookingId, data }: { hotelId: string; bookingId: string; data: any }) =>
      apiClient.updateUserBooking(hotelId, bookingId, data),
    {
      onSuccess: () => {
        window.location.reload();
      },
    }
  );

  if (!hotels || (userRole === "user" && hotels.length === 0) || (userRole === "hotelOwner" && allBookings.length === 0)) {
    return <span>No bookings found</span>;
  }

  if (userRole === "hotelOwner") {
    return (
      <div className="space-y-5">
        <h1 className="text-3xl font-bold">Bookings for My Hotels</h1>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Hotel</th>
              <th className="border px-4 py-2">User Name</th>
              <th className="border px-4 py-2">User Email</th>
              <th className="border px-4 py-2">Check-in</th>
              <th className="border px-4 py-2">Check-out</th>
              <th className="border px-4 py-2">Guests</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.map((booking: any) => (
              <tr key={booking._id}>
                <td className="border px-4 py-2">{booking.hotelName}</td>
                <td className="border px-4 py-2">{booking.firstName} {booking.lastName}</td>
                <td className="border px-4 py-2">{booking.email}</td>
                <td className="border px-4 py-2">{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(booking.checkOut).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{booking.adultCount} adults, {booking.childCount} children</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => setCancelConfirm({ hotelId: booking.hotelId, bookingId: booking._id })}
                  >
                    Cancel Booking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Cancel Confirmation Modal */}
        {cancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
              <h2 className="text-xl font-bold mb-4">Confirm Cancellation</h2>
              <p>Are you sure you want to cancel this booking?</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setCancelConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => {
                    if (cancelConfirm) {
                      cancelBooking({ hotelId: cancelConfirm.hotelId, bookingId: cancelConfirm.bookingId });
                      setCancelConfirm(null);
                    }
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: user bookings
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {hotels.map((hotel) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={hotel.imageUrls[0]}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {hotel.name}
              <div className="text-xs font-normal">
                {hotel.city}, {hotel.country}
              </div>
            </div>
            {hotel.bookings.map((booking) => (
              <div>
                <div>
                  <span className="font-bold mr-2">Dates: </span>
                  <span>
                    {new Date(booking.checkIn).toDateString()} -
                    {new Date(booking.checkOut).toDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-bold mr-2">Guests:</span>
                  <span>
                    {booking.adultCount} adults, {booking.childCount} children
                  </span>
                </div>
                <button
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => setCancelConfirm({ hotelId: hotel._id, bookingId: booking._id })}
                >
                  Cancel Booking
                </button>
                <button
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 ml-2"
                  onClick={() => setEditBooking({ hotelId: hotel._id, bookingId: booking._id, ...booking })}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4">Confirm Cancellation</h2>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setCancelConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => {
                  if (cancelConfirm) {
                    cancelBooking({ hotelId: cancelConfirm.hotelId, bookingId: cancelConfirm.bookingId });
                    setCancelConfirm(null);
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Booking Modal */}
      {editBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                updateBooking({
                  hotelId: editBooking.hotelId,
                  bookingId: editBooking.bookingId,
                  data: {
                    checkIn: (e.target as any).checkIn.value,
                    checkOut: (e.target as any).checkOut.value,
                    adultCount: Number((e.target as any).adultCount.value),
                    childCount: Number((e.target as any).childCount.value),
                  },
                });
                setEditBooking(null);
              }}
              className="flex flex-col gap-4"
            >
              <label>
                Check-in:
                <input
                  type="date"
                  name="checkIn"
                  defaultValue={editBooking.checkIn?.slice(0, 10)}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </label>
              <label>
                Check-out:
                <input
                  type="date"
                  name="checkOut"
                  defaultValue={editBooking.checkOut?.slice(0, 10)}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </label>
              <label>
                Adults:
                <input
                  type="number"
                  name="adultCount"
                  min={1}
                  defaultValue={editBooking.adultCount}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </label>
              <label>
                Children:
                <input
                  type="number"
                  name="childCount"
                  min={0}
                  defaultValue={editBooking.childCount}
                  className="border rounded px-2 py-1 w-full"
                />
              </label>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setEditBooking(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
