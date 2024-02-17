import { RegisterPostRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";

const register = async (body: RegisterPostRequest) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};

export const useRegisterLogin = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: register,
  });
};
