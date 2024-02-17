import { SongsGetResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const getSongs = async () => {
  const res = await fetch(`/api/songs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });
  const data = await res.json();
  return data as SongsGetResponse;
};

export const useGetSongs = () => {
  return useQuery({
    queryKey: ["songs"],
    queryFn: () => getSongs(),
  });
};
