import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";

export type HotelFormData={
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageFiles: FileList;
    lastUpdated: Date;
    childCount: number;
};

type Props ={
    onSave:(hotelFormData : FormData)=> void
    isLoading : boolean
}

const ManageHotelForm =({onSave , isLoading}:Props)=>{
    const fromMethods = useForm<HotelFormData>();
    const {handleSubmit} = fromMethods;

    const onSubmit = handleSubmit((formDataJSON: HotelFormData)=>{
        const formData =new FormData();
        formData.append("name", formDataJSON.name);
        formData.append("city", formDataJSON.city);
        formData.append("country", formDataJSON.country);
        formData.append("description", formDataJSON.description);
        formData.append("type", formDataJSON.type);
        formData.append("pricePerNight", formDataJSON.pricePerNight.toString());
        formData.append("starRating", formDataJSON.starRating.toString());
        formData.append("adultCount", formDataJSON.adultCount.toString());
        formData.append("childCount", formDataJSON.childCount.toString());
        
        formDataJSON.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility);
        });
        Array.from(formDataJSON.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        });
        onSave(formData)

    })
    return <FormProvider {...fromMethods}>
        <form className="flex flex-col gap-10" onSubmit={onSubmit}>
            <DetailsSection/>
            <TypeSection />
            <FacilitiesSection />
            <GuestsSection/>
            <ImagesSection/>

            <span className="flex justify-end">
                <button 
                disabled={isLoading} type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled: bg-gray-500">
                    {isLoading? "Saving..": "Save"}
                </button>

            </span>
        </form>
    </FormProvider>
}

export default ManageHotelForm;