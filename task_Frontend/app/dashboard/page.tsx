"use client";

import { useTasks } from "@/lib/task-context";
import { useEffect, useState } from "react";
import { fetchAllTasksApi } from "@/lib/api";
import { useCallback } from "react";
async function fetchTasksByStatus(status: string, token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const res = await fetch(`${apiUrl}/tasks/status/${status}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    return [];
  }
  return await res.json();
}
import { getToken } from "@/lib/task-context";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Header } from "@/components/dashboard/header";
import { TaskTable } from "@/components/dashboard/task-table";
import { TaskChart } from "@/components/dashboard/task-chart";
import { TaskPagination } from "@/components/dashboard/task-pagination";
import { CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";

const TASKS_PER_PAGE = 5;

export default function DashboardPage() {
  const { userTasks, toggleComplete, updateTask, deleteTask } = useTasks();
  const [currentPage, setCurrentPage] = useState(1);

  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingCounts(true);
      try {
        const token = getToken();
        const [all, inProgress, completed] = await Promise.all([
          fetchAllTasksApi(token),
          fetchTasksByStatus("IN_PROGRESS", token),
          fetchTasksByStatus("COMPLETED", token),
        ]);
        setAllTasks(Array.isArray(all) ? all : []);
        setInProgressTasks(Array.isArray(inProgress) ? inProgress : []);
        setCompletedTasks(Array.isArray(completed) ? completed : []);
      } catch {
        setAllTasks([]);
        setInProgressTasks([]);
        setCompletedTasks([]);
      } finally {
        setLoadingCounts(false);
      }
    };
    fetchTasks();
  }, []);

  const totalTasks = allTasks.length;
  const pendingTasks = allTasks.filter((t) => t.status === "pending").length;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const totalPages = Math.ceil(userTasks.length / TASKS_PER_PAGE);
  const paginatedTasks = userTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE,
  );

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
            value={loadingCounts ? "-" : totalTasks}
            change={loadingCounts ? "" : `${pendingTasks} pending`}
            changeType="neutral"
            icon={ListTodo}
          />
          <StatsCard
            title="In Progress"
            value={loadingCounts ? "-" : inProgressTasks.length}
            change="Active tasks"
            changeType="neutral"
            icon={Clock}
            iconColor="text-chart-3"
          />
          <StatsCard
            title="Completed"
            value={loadingCounts ? "-" : completedTasks.length}
            change="Tasks done"
            changeType="positive"
            icon={CheckCircle2}
            iconColor="text-chart-1"
          />
          <StatsCard
            title="Productivity"
            value={loadingCounts ? "-" : `${productivity}%`}
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
  );
}
