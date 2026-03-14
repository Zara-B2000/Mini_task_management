export async function fetchTaskCountsApi(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const res = await fetch(`${apiUrl}/tasks/counts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch task counts");
  }
  return res.json();
}
export async function fetchAllTasksApi(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  // Add pagination params to always get first 100 tasks
  const res = await fetch(`${apiUrl}/tasks/all?page=0&size=100`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await res.json();
  // If paginated, return data.content; else, return data
  return data.content ? data.content : data;
}
export async function createTaskApi(task: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const res = await fetch(`${apiUrl}/tasks/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
    credentials: "include", // if you need cookies/auth
  });
  if (!res.ok) {
    throw new Error("Failed to create task");
  }
  return res.json();
}
