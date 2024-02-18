type Response = {
  similarity_parody: number;
  similarity_mod: number;
};

export const verifyOriginal = async (body: {
  url1: string;
  url2: string;
}): Promise<Response> => {
  const res = await fetch(`http://localhost:5000/ml`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json() as Response;
};
