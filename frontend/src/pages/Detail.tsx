import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import { useRef, useEffect, useMemo } from "react";

const Detail = () => {
  const { hotelId } = useParams();
  const bookingFormRef = useRef<HTMLDivElement>(null);

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  // Save most recently viewed hotel as user preference
  useEffect(() => {
    if (hotel) {
      localStorage.setItem("userPreferenceHotel", JSON.stringify(hotel));
    }
  }, [hotel]);

  // Fetch all hotels for recommendations
  const { data: allHotels } = useQuery("allHotels", apiClient.fetchHotels);

  // Compute recommended hotels based on similarity
  const recommendedHotels = useMemo(() => {
    if (!hotel || !allHotels) return [];
    // Recommend hotels with same city, type, or overlapping facilities, but not the current hotel
    return allHotels
      .filter((h: any) => h._id !== hotel._id)
      .map((h: any) => {
        let score = 0;
        if (h.city === hotel.city) score += 2;
        if (h.type === hotel.type) score += 2;
        if (h.country === hotel.country) score += 1;
        if (h.facilities && hotel.facilities) {
          const overlap = h.facilities.filter((f: string) => hotel.facilities.includes(f)).length;
          score += overlap;
        }
        return { ...h, score };
      })
      .filter((h: any) => h.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3); // Top 3 recommendations
  }, [hotel, allHotels]);

  if (!hotel) {
    return <></>;
  }

  const handleBookNowClick = () => {
    bookingFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="flex">
            {Array.from({ length: hotel.starRating }).map(() => (
              <AiFillStar className="fill-yellow-400" />
            ))}
          </span>
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold text-lg hover:bg-blue-700"
          onClick={handleBookNowClick}
        >
          Book Now
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image) => (
          <div className="h-[300px]">
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit" ref={bookingFormRef}>
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
      {/* Recommended Hotels Section */}
      {recommendedHotels.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Recommended Hotels</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendedHotels.map((recHotel: any) => (
              <div key={recHotel._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold mb-2">{recHotel.name}</h3>
                <div className="mb-1">{recHotel.city}, {recHotel.country}</div>
                <div className="mb-1">Type: {recHotel.type}</div>
                <div className="mb-1">Price: £{recHotel.pricePerNight}</div>
                <div className="mb-1 text-xs">Facilities: {recHotel.facilities?.join(", ")}</div>
                <a
                  href={`/detail/${recHotel._id}`}
                  className="inline-block mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
