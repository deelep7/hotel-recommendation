import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

type Props = {
  hotel?: HotelType;
  onSave: (formData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ hotel, onSave, isLoading }: Props) => {
  const formMethods = useForm<HotelFormData>({
    defaultValues: {
      name: "",
      city: "",
      country: "",
      description: "",
      type: "",
      pricePerNight: 0,
      starRating: 0,
      facilities: [],
      imageFiles: {} as FileList,
      imageUrls: [],
      adultCount: 1,
      childCount: 0,
    },
  });

  const { handleSubmit, reset, watch } = formMethods;

  // Populate form when editing
  useEffect(() => {
    if (hotel) {
      reset({
        ...hotel,
        imageFiles: {} as FileList, // cannot set FileList directly, left empty
      });
    }
  }, [hotel, reset]);

  const onSubmit = (data: HotelFormData) => {
    const formData = new FormData();

    if (hotel?._id) {
      formData.append("hotelId", hotel._id);
    }

    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("pricePerNight", data.pricePerNight.toString());
    formData.append("starRating", data.starRating.toString());
    formData.append("adultCount", data.adultCount.toString());
    formData.append("childCount", data.childCount.toString());

    data.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    data.imageUrls.forEach((url, index) => {
      formData.append(`imageUrls[${index}]`, url);
    });

    Array.from(data.imageFiles || []).forEach((file) => {
      formData.append("imageFiles", file);
    });

    onSave(formData);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white p-3 px-6 rounded-lg font-semibold hover:bg-blue-500 disabled:bg-gray-400"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
