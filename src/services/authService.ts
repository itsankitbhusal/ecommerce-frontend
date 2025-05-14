import axios from "../config/axios";
import { IAuthResponse } from "../interface/authInterfaces";

export interface ILoginDTO {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: ILoginDTO) => {
  return axios
    .post<IAuthResponse>("/user/auth/sign-in", {
      email,
      password,
    })
    .then((d) => d.data);
};
