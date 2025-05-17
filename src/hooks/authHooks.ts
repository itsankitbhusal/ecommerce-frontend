import { useMutation } from "@tanstack/react-query";
import { forgetPassword, ILoginDTO, ISignUpDTO, loginUser, signUpUser, verifyOTP } from "../services/authService";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: ILoginDTO) =>
      loginUser({ email, password }),
    onSuccess: () => {
      //   do sth here
    },
  });
};

export const useSignUp = () =>
  useMutation({
    mutationFn: (data: ISignUpDTO) => signUpUser(data),
  });

export const useVerifyOTP = () =>
  useMutation({
    mutationFn: (code: string) => verifyOTP(code),
  });

export const useForgetPassword = () =>
  useMutation({
    mutationFn: (data: ILoginDTO) => forgetPassword(data),
  });