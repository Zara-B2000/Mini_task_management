"use client"

import { useTasks } from "@/lib/task-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Header } from "@/components/dashboard/header"
import { TaskTable } from "@/components/dashboard/task-table"
import { TaskChart } from "@/components/dashboard/task-chart"
import { TaskPagination } from "@/components/dashboard/task-pagination"
import { useState } from "react"
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
} from "lucide-react"

const TASKS_PER_PAGE = 5

export default function DashboardPage() {
  const { userTasks, toggleComplete, updateTask, deleteTask } = useTasks()
  const [currentPage, setCurrentPage] = useState(1)

  const completedTasks = userTasks.filter((t) => t.completed).length
  const inProgressTasks = userTasks.filter((t) => t.status === "in-progress").length
  const pendingTasks = userTasks.filter((t) => t.status === "pending").length
  const productivity = userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0

  const totalPages = Math.ceil(userTasks.length / TASKS_PER_PAGE)
  const paginatedTasks = userTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  )

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <Header
          title="Dashboard"
          subtitle="Track your tasks and project progress"
        />

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tasks"
            value={userTasks.length}
            change={`${pendingTasks} pending`}
            changeType="neutral"
            icon={ListTodo}
          />
          <StatsCard
            title="In Progress"
            value={inProgressTasks}
            change="Active tasks"
            changeType="neutral"
            icon={Clock}
            iconColor="text-chart-3"
          />
          <StatsCard
            title="Completed"
            value={completedTasks}
            change="Tasks done"
            changeType="positive"
            icon={CheckCircle2}
            iconColor="text-chart-1"
          />
          <StatsCard
            title="Productivity"
            value={`${productivity}%`}
            change="Completion rate"
            changeType={productivity > 50 ? "positive" : "neutral"}
            icon={TrendingUp}
            iconColor="text-chart-2"
          />
        </div>

        {/* Chart */}
        <TaskChart />

        {/* Task Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Tasks</h2>
          <TaskTable
            tasks={paginatedTasks}
            onToggleComplete={toggleComplete}
            onStatusChange={(id, status) => updateTask(id, { status })}
            onDelete={deleteTask}
          />
        </div>

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
