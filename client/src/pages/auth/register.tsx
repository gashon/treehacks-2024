import { useSearchParams } from "next/navigation";
import { useRegisterLogin } from "@/features/auth";
import { useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const mutationFn = useRegisterLogin();

  useEffect(() => {
    if (token) {
      mutationFn.mutate({ token });
    }
  }, [token]);

  if (!token) return <p>Invalid Login Link</p>;

  if (mutationFn.isPending) return <p>Loading...</p>;

  return <p>token attached</p>;
}
