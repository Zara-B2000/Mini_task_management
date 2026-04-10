export async function fetchTaskCountsApi(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const res = await fetch(`${apiUrl}/tasks/counts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const res = await fetch(`${apiUrl}/tasks/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    throw new Error("Failed to create task");
  }
  return res.json();
}

export async function updateTaskApi(id: string, task: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const res = await fetch(`${apiUrl}/tasks/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    throw new Error("Failed to update task");
  }
  return res.json();
}

export async function deleteTaskApi(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const res = await fetch(`${apiUrl}/tasks/delete/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete task");
  }
}
