import axios from "../config/axios";

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  status: string;
  contactNumber: string;
  address: string;
}

export interface IUpdateUser {
  firstname: string;
  lastname: string;
  contactNumber: string;
  address: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export const getUserById = async (userId: number) => {
  const res = await axios.get(`/user/getById/${userId}`);
  return res.data;
};

export const findUserByEmail = async (email: string) => {
  const res = await axios.get(`/api/user/findUserByEmail/${email}`);
  return res.data;
};

export const updateUser = async (userId: number, data: IUpdateUser) => {
  const res = await axios.post(`/user/update/${userId}`, data);
  return res.data;
};

export const changePassword = async (email: string, data: IChangePassword) => {
  const res = await axios.post(`/user/changePassword/${email}`, data);
  return res.data;
};

export const deleteUser = async (userId: number) => {
  const res = await axios.get(`/user/delete/${userId}`);
  return res.data;
};

export const countUsers = async () => {
  const res = await axios.get(`/user/admin/countOfUsers`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get(`/admin/user/getAll`);
  return res.data;
};