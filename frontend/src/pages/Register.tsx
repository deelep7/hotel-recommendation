import {useForm} from "react-hook-form";

type RegisterFormData = {
    fristName : string,
    lastname :string,
    email: string,
    password : string,
    confirmPassword : string;
}

const Register = () =>{

    const {register} = useForm<RegisterFormData>();



    return (
        <form className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold">
                Create An Account
            </h2>

            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal"></input>
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal"></input>
                </label>


            </div>
        </form>
    );
};


export default Register;