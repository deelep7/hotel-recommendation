import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";
import { useMemo } from "react";

const Home = () => {
  const { data: hotels } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  // Get user preference hotel from localStorage (works for logged in and not logged in)
  const userPreferenceHotel = useMemo(() => {
    const stored = localStorage.getItem("userPreferenceHotel");
    return stored ? JSON.parse(stored) : null;
  }, []);

  // Content-based recommendation algorithm (works for all users)
  const recommendedHotels = useMemo(() => {
    if (!hotels || !userPreferenceHotel) return [];
    return hotels
      .filter((h) => h._id !== userPreferenceHotel._id)
      .map((h) => {
        let score = 0;
        if (h.city === userPreferenceHotel.city) score += 2;
        if (h.type === userPreferenceHotel.type) score += 2;
        if (h.country === userPreferenceHotel.country) score += 1;
        if (h.facilities && userPreferenceHotel.facilities) {
          const overlap = h.facilities.filter((f) => userPreferenceHotel.facilities.includes(f)).length;
          score += overlap;
        }
        return { ...h, score };
      })
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [hotels, userPreferenceHotel]);

  // If no recommendations, show random hotels
  const hotelsToShow = useMemo(() => {
    if (recommendedHotels.length > 0) return recommendedHotels;
    if (!hotels) return [];
    // Shuffle and pick 3 random hotels
    const shuffled = [...hotels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [hotels, recommendedHotels]);

  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Recommended Hotels</h2>
      <p>
        {recommendedHotels.length > 0
          ? "Based on your last viewed hotel."
          : "Random picks for you!"}
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {hotelsToShow.map((hotel) => (
          <LatestDestinationCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
      <h2 className="text-3xl font-bold mt-8">Latest Destinations</h2>
      <p>Most recent destinations added by our hosts</p>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {hotels?.slice(0, 2).map((hotel) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {hotels?.slice(2).map((hotel) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
