import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";

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
    imageUrls: FileList;
    lastUpdated: Date;
    childCount: number;
}

const ManageHotelForm =()=>{
    const fromMethods = useForm<HotelFormData>();
    return <FormProvider {...fromMethods}>
        <form>
            <DetailsSection/>
            <TypeSection />
        </form>
    </FormProvider>
}

export default ManageHotelForm;