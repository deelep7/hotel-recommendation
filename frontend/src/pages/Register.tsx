import {useForm} from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from '../api-client';

 export type RegisterFormData = {
    fristName : string,
    lastName :string,
    email: string,
    password : string,
    confirmPassword : string;
}

const Register = () =>{

    const {register,
         watch,
          handleSubmit, 
          formState: {errors}} 
          = useForm<RegisterFormData>();

     const mutation = useMutation(apiClient.register,{
        onSuccess:() =>{
            console.log("registered")
        },
        onError : (error: Error)=>{
            console.log(error.message);

        }
     })   

    const onSubmit = handleSubmit((data)=>{
        mutation.mutate(data);
    });



    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">
                Create An Account
            </h2>

            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1" >
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                    {...register("fristName", {required: "This field is required"})}>
                        
                    </input>
                    {errors.fristName && (
                        <span className="bg-red-500">{ errors.fristName.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                    {...register("lastName", {required: "This field is required"})}>
               </input>
               {errors.lastName && (
                        <span className="bg-red-500">{ errors.lastName.message}</span>
                    )}
                </label>
            </div>
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input type="email" 
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", {required: "This field is required"})}>
               </input>
               {errors.email && (
                        <span className="bg-red-500">{ errors.email.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input type="password"
                     className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {required: "This field is required", minLength:{
                        value :6,
                        message : "Password must be at least 6 Characters"
                    }})}>
               </input>
               {errors.password && (
                        <span className="bg-red-500">{ errors.password.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Confrim Password
                    <input type="password"
                     className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword", {
                            validate:(val)=>{
                                    if(!val){
                                        return "This Field is Required"
                                    }else if(watch("password")!== val){
                                        return "Your paassword do not match";
                                    }
                            }
                    })}>
               </input>
               {errors.confirmPassword && (
                        <span className="bg-red-500">{ errors.confirmPassword.message}</span>
                    )}
                </label>
                <span>
                    <button type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                        Create Account
                    </button>
                </span>
        </form>
    );
};


export default Register;