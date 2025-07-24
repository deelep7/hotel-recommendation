import { useQuery } from "react-query";
import { useState } from "react";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const BookHotel = () => {
  const { stripePromise } = useAppContext();
  const { data: hotels, isLoading } = useQuery("allHotels", apiClient.fetchHotels);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const { data: paymentIntentData } = useQuery(
    ["createPaymentIntent", selectedHotelId],
    () => apiClient.createPaymentIntent(selectedHotelId, "1"),
    { enabled: !!selectedHotelId }
  );
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );
  if (isLoading) return <div>Loading hotels...</div>;
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Book a Hotel</h1>
      <label className="block mb-4">
        <span className="font-semibold">Select Hotel:</span>
        <select
          className="border rounded w-full py-2 px-3 mt-2"
          value={selectedHotelId}
          onChange={(e) => setSelectedHotelId(e.target.value)}
        >
          <option value="">-- Select a hotel --</option>
          {hotels?.map((hotel: any) => (
            <option key={hotel._id} value={hotel._id}>
              {hotel.name} ({hotel.city}, {hotel.country})
            </option>
          ))}
        </select>
      </label>
      {selectedHotelId && currentUser && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: paymentIntentData.clientSecret }}
        >
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      )}
    </div>
  );
};

export default BookHotel; 