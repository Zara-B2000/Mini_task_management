"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth, User } from "./auth-context";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  completed: boolean;
}

export type SortField =
  | "title"
  | "dueDate"
  | "priority"
  | "status"
  | "createdAt";
export type SortOrder = "asc" | "desc";

export interface TaskFilters {
  search: string;
  status: Task["status"] | "all";
  priority: Task["priority"] | "all";
}

interface TaskContextType {
  tasks: Task[];
  userTasks: Task[];
  allTasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed" | "userId">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  getFilteredTasks: (filters: TaskFilters, includeAllTasks?: boolean) => Task[];
  getSortedTasks: (
    tasks: Task[],
    sortField: SortField,
    sortOrder: SortOrder,
  ) => Task[];
  getTaskById: (id: string) => Task | undefined;
  canEditTask: (task: Task) => boolean;
  canDeleteTask: (task: Task) => boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

import { useEffect } from "react";
import { fetchAllTasksApi } from "@/lib/api";

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user, isAdmin } = useAuth();

  // Fetch tasks from backend when user or token changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        setTasks([]);
        return;
      }
      try {
        const token = getToken();
        const data = await fetchAllTasksApi(token);
        console.log("/tasks/all API response:", data);
        // Normalize backend data to Task[]
        const mappedTasks = Array.isArray(data)
          ? data.map((t: any) => ({
              id: t.id?.toString() ?? "",
              userId: t.user?.id?.toString() ?? "",
              title: t.title,
              description: t.description,
              priority: t.priority,
              status: t.status,
              dueDate: t.dueDate,
              completed: t.completed ?? t.status === "completed",
            }))
          : [];
        console.log("Mapped tasks:", mappedTasks);
        console.log("Logged-in user id:", user?.id?.toString());
        setTasks(mappedTasks);
      } catch (e) {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [user]);

  // Get tasks based on user role
  const userTasks = tasks.filter((task) => {
    const match = task.userId === user?.id?.toString();
    if (!match) {
      console.log(
        `Task filtered out: task.userId=${task.userId}, user.id=${user?.id?.toString()}`,
      );
    }
    return match;
  });
  const allTasks = tasks; // Admin can see all tasks

  const addTask = (task: Omit<Task, "id" | "completed" | "userId">) => {
    if (!user) return;
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      userId: user.id,
      completed: task.status === "completed",
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Check if user can edit/delete a task
  const canEditTask = (task: Task): boolean => {
    if (!user) return false;
    return isAdmin || task.userId === user.id;
  };

  const canDeleteTask = (task: Task): boolean => {
    if (!user) return false;
    return isAdmin || task.userId === user.id;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || !canEditTask(task)) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              completed:
                updates.status === "completed" ||
                (updates.completed ?? t.completed),
            }
          : t,
      ),
    );
  };

  const deleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || !canDeleteTask(task)) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || !canEditTask(task)) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              status: !t.completed ? "completed" : "pending",
            }
          : t,
      ),
    );
  };

  const getFilteredTasks = (
    filters: TaskFilters,
    includeAllTasks = false,
  ): Task[] => {
    // Use allTasks for admin when includeAllTasks is true, otherwise use user's tasks
    const baseTasks = includeAllTasks && isAdmin ? allTasks : userTasks;
    return baseTasks.filter((task) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== "all" && task.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  };

  const getSortedTasks = (
    tasksToSort: Task[],
    sortField: SortField,
    sortOrder: SortOrder,
  ): Task[] => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const statusOrder = { completed: 3, "in-progress": 2, pending: 1 };

    return [...tasksToSort].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "dueDate":
          comparison =
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case "priority":
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "status":
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        userTasks,
        allTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        getFilteredTasks,
        getSortedTasks,
        getTaskById,
        canEditTask,
        canDeleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
