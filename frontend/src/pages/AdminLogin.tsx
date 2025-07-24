import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { SignInFormData } from "./SignIn";

const AdminLogin = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Admin Login Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("fetchCurrentUser");
      navigate("/admin");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5 max-w-md mx-auto mt-10" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Admin Login</h2>
      <label>
        Email
        <input type="email" {...register("email", { required: "Required" })} className="border rounded w-full py-1 px-2" />
        {errors.email && <span className="text-red-500">{String(errors.email.message)}</span>}
      </label>
      <label>
        Password
        <input type="password" {...register("password", { required: "Required" })} className="border rounded w-full py-1 px-2" />
        {errors.password && <span className="text-red-500">{String(errors.password.message)}</span>}
      </label>
      <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Login as Admin</button>
    </form>
  );
};

export default AdminLogin; 