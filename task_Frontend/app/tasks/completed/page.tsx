"use client"

import { useState } from "react"
import { useTasks } from "@/lib/task-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { TaskTable } from "@/components/dashboard/task-table"
import { TaskPagination } from "@/components/dashboard/task-pagination"
import { CheckCircle } from "lucide-react"

const TASKS_PER_PAGE = 8

export default function CompletedTasksPage() {
  const { userTasks, toggleComplete, updateTask, deleteTask } = useTasks()
  const [currentPage, setCurrentPage] = useState(1)

  const completedTasks = userTasks.filter((task) => task.completed)
  const totalPages = Math.ceil(completedTasks.length / TASKS_PER_PAGE)
  const paginatedTasks = completedTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  )

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <Header
          title="Completed Tasks"
          subtitle={`${completedTasks.length} tasks completed`}
        />

        {paginatedTasks.length > 0 ? (
          <TaskTable
            tasks={paginatedTasks}
            onToggleComplete={toggleComplete}
            onStatusChange={(id, status) => updateTask(id, { status })}
            onDelete={deleteTask}
          />
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border">
            <CheckCircle className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No completed tasks yet</p>
            <p className="text-sm text-muted-foreground">
              Complete some tasks to see them here
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <TaskPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
