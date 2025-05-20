import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserById,
  findUserByEmail,
  updateUser,
  changePassword,
  deleteUser,
  countUsers,
  getAllUsers,
  IUpdateUser,
  IChangePassword,
} from "../services/userService";

const QUERY_KEYS = {
  GET_ALL_USERS: "get_all_users",
  COUNT_USERS: "count_users",
  GET_USER: "get_user",
  FIND_USER_EMAIL: "find_user_email"
}

export const useGetUserById = (userId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useFindUserByEmail = (email: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FIND_USER_EMAIL, email],
    queryFn: () => findUserByEmail(email),
    enabled: !!email,
  });
};

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateUser) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER, userId] });
    },
  });
};

export const useChangePassword = (email: string) => {
  return useMutation({
    mutationFn: (data: IChangePassword) => changePassword(email, data),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS] });
    },
  });
};

export const useCountUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COUNT_USERS],
    queryFn: countUsers,
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USERS],
    queryFn: getAllUsers,
  });
};