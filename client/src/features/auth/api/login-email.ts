import { LoginPostRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";

const magicEmailLogin = async (body: LoginPostRequest) => {
  const res = await fetch("/api/auth/magic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};

export const useMagicEmailLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: magicEmailLogin,
  });
};
