import axios from "../config/axios";
import { IAuthResponse } from "../interface/authInterfaces";

export interface ILoginDTO {
  email: string;
  password: string;
}

export interface ISignUpDTO {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
}

export const loginUser = async ({ email, password }: ILoginDTO) => {
  const res = await axios.post<IAuthResponse>("/user/auth/sign-in", {
    email,
    password,
  });
  return res.data;
};

export const signUpUser = async (data: ISignUpDTO) => {
  const response = await axios.post("/user/auth/sign-up", data);
  return response.data;
};

export const verifyOTP = async (code: string) => {
  const response = await axios.get(`/user/auth/verify?code=${code}`);
  return response.data;
};

export const forgetPassword = async (data: ILoginDTO) => {
  const response = await axios.post("/user/auth/forget-password", data);
  return response.data;
};