export const verifyOriginal = async (body: { url1: string; url2: string }) => {
  const res = await fetch(`http://localhost:5000/ml`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return res.json();
};
