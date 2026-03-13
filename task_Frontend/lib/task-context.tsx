"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useAuth, User } from "./auth-context"

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  completed: boolean
}

export type SortField = "title" | "dueDate" | "priority" | "status" | "createdAt"
export type SortOrder = "asc" | "desc"

export interface TaskFilters {
  search: string
  status: Task["status"] | "all"
  priority: Task["priority"] | "all"
}

interface TaskContextType {
  tasks: Task[]
  userTasks: Task[]
  allTasks: Task[]
  addTask: (task: Omit<Task, "id" | "completed" | "userId">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleComplete: (id: string) => void
  getFilteredTasks: (filters: TaskFilters, includeAllTasks?: boolean) => Task[]
  getSortedTasks: (tasks: Task[], sortField: SortField, sortOrder: SortOrder) => Task[]
  getTaskById: (id: string) => Task | undefined
  canEditTask: (task: Task) => boolean
  canDeleteTask: (task: Task) => boolean
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

const initialTasks: Task[] = [
  {
    id: "1",
    userId: "user-1",
    title: "Design new landing page",
    description: "Create wireframes and high-fidelity mockups for the new marketing landing page",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-03-15",
    completed: false,
  },
  {
    id: "2",
    userId: "user-1",
    title: "Implement user authentication",
    description: "Set up OAuth 2.0 and JWT token-based authentication system",
    priority: "high",
    status: "pending",
    dueDate: "2024-03-18",
    completed: false,
  },
  {
    id: "3",
    userId: "user-1",
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples and response schemas",
    priority: "medium",
    status: "in-progress",
    dueDate: "2024-03-20",
    completed: false,
  },
  {
    id: "4",
    userId: "admin-1",
    title: "Fix mobile responsiveness",
    description: "Address layout problems on tablet and mobile devices",
    priority: "medium",
    status: "completed",
    dueDate: "2024-03-10",
    completed: true,
  },
  {
    id: "5",
    userId: "admin-1",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment workflows",
    priority: "low",
    status: "pending",
    dueDate: "2024-03-22",
    completed: false,
  },
  {
    id: "6",
    userId: "user-2",
    title: "Database optimization",
    description: "Optimize slow queries and add proper indexing",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-03-16",
    completed: false,
  },
  {
    id: "7",
    userId: "user-2",
    title: "Code review for feature branch",
    description: "Review pull requests from the development team",
    priority: "medium",
    status: "pending",
    dueDate: "2024-03-14",
    completed: false,
  },
  {
    id: "8",
    userId: "user-1",
    title: "Update dependencies",
    description: "Upgrade npm packages to latest stable versions",
    priority: "low",
    status: "completed",
    dueDate: "2024-03-08",
    completed: true,
  },
]

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const { user, isAdmin } = useAuth()

  // Get tasks based on user role
  const userTasks = tasks.filter((task) => task.userId === user?.id)
  const allTasks = tasks // Admin can see all tasks

  const addTask = (task: Omit<Task, "id" | "completed" | "userId">) => {
    if (!user) return
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      userId: user.id,
      completed: task.status === "completed",
    }
    setTasks((prev) => [newTask, ...prev])
  }

  // Check if user can edit/delete a task
  const canEditTask = (task: Task): boolean => {
    if (!user) return false
    return isAdmin || task.userId === user.id
  }

  const canDeleteTask = (task: Task): boolean => {
    if (!user) return false
    return isAdmin || task.userId === user.id
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const task = tasks.find((t) => t.id === id)
    if (!task || !canEditTask(task)) return

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              completed: updates.status === "completed" || (updates.completed ?? t.completed),
            }
          : t
      )
    )
  }

  const deleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task || !canDeleteTask(task)) return

    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task || !canEditTask(task)) return

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              status: !t.completed ? "completed" : "pending",
            }
          : t
      )
    )
  }

  const getFilteredTasks = (filters: TaskFilters, includeAllTasks = false): Task[] => {
    // Use allTasks for admin when includeAllTasks is true, otherwise use user's tasks
    const baseTasks = includeAllTasks && isAdmin ? allTasks : userTasks
    return baseTasks.filter((task) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status !== "all" && task.status !== filters.status) {
        return false
      }

      // Priority filter
      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false
      }

      return true
    })
  }

  const getSortedTasks = (tasksToSort: Task[], sortField: SortField, sortOrder: SortOrder): Task[] => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const statusOrder = { completed: 3, "in-progress": 2, pending: 1 }

    return [...tasksToSort].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "dueDate":
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          break
        case "priority":
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case "status":
          comparison = statusOrder[a.status] - statusOrder[b.status]
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })
  }

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find((task) => task.id === id)
  }

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
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
