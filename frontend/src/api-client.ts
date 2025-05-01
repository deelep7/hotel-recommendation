import { RegisterFormData } from "./pages/Register";
import { SignInFromData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL|| '';



export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const text = await response.text();
  let responseBody;
  try {
    responseBody = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    throw new Error(responseBody.message || 'Registration failed');
  }

  return responseBody;
};

export const signIn = async (formData: SignInFromData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message );
  }

  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Token invalid');
  }

  return response.json();
};


export const signOut =async () => {
  const response =await fetch (`${API_BASE_URL}/api/auth/logout`,{
    credentials : "include",
    method: "POST"
  })
  if(!response.ok){
    throw new Error("Error during sign out");
  }
}