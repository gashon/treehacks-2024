import { SongsGetResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const getStrikes = async () => {
  const res = await fetch(`/api/strikes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });
  const data = await res.json();
  return data as { data: string[] };
};

export const useGetStrikes = () => {
  return useQuery({
    queryKey: ["strikes"],
    queryFn: () => getStrikes(),
  });
};
