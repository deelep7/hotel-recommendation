import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from '../api-client';
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();

  // Query to fetch the hotel details
  const { data: hotel, isLoading, isError, error } = useQuery(
    "fetchMyHotelById", 
    () => apiClient.fetchMyHotelById(hotelId || ''),
    {
      enabled: !!hotelId,  // Only fetch if hotelId exists
    }
  );

  // Mutation to update the hotel
  const { mutate, isLoading: isSaving } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: (data) => {
      console.log('Successfully updated hotel:', data); // Log success response
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },
    onError: (error: any) => {
      console.error("Error saving hotel:", error);  // Log the actual error for debugging
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    console.log('Form Data Before Mutate:', hotelFormData);  // Log form data before mutation
    if (!hotelId) {
      showToast({ message: "Hotel ID is missing.", type: "ERROR" });
      return;
    }
    hotelFormData.append("hotelId", hotelId);  // Ensure hotelId is added
    mutate(hotelFormData);
  };

  // Handle loading and error states
  if (isLoading) return <div>Loading hotel...</div>;
  if (isError) return <div>Error: {error instanceof Error ? error.message : "An error occurred"}</div>;

  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isSaving} />
  );
};

export default EditHotel;
