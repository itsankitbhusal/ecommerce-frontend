import { Role } from "../constants";

export interface IAuthResponse {
  token: string;
  refreshToken: string;
  userId: number;
  roles: Role;
}
