import { useMagicEmailLogin } from "@/features/auth";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const mutationFn = useMagicEmailLogin();

  return (
    <div className="flex justify-center w-full h-full m-10">
      <div className="flex flex-col gap-2 w-7/10">
        <input
          className="text-black px-4 py-2"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="submit"
          className="cursor-pointer"
          onClick={() => {
            if (email) {
              mutationFn.mutate({ email });
              setEmail("");
            }
          }}
          disabled={email !== undefined && !!mutationFn.isPending}
        />
      </div>
    </div>
  );
}
