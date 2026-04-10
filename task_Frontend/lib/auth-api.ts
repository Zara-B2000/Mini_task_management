export async function loginApi(email: string, password: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function registerApi(
  username: string,
  email: string,
  password: string,
  role: string,
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const res = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, role }),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}
