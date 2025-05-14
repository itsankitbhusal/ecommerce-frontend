import { useMutation } from "@tanstack/react-query";
import { ILoginDTO, loginUser } from "../services/authService";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: ILoginDTO) =>
      loginUser({ email, password }),
    onSuccess: () => {
      //   do sth here
    },
  });
};
