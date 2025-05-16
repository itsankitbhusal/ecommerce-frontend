import { Roles } from "../constants";

export interface IAuthResponse {
  token: string;
  refreshToken: string;
  userId: number;
  roles?: "ADMIN" | "USER"
}
