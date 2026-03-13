"use client"

import { useState, useMemo } from "react"
import { useTasks, SortField, SortOrder, TaskFilters } from "@/lib/task-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { TaskTable } from "@/components/dashboard/task-table"
import { TaskPagination } from "@/components/dashboard/task-pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react"
import Link from "next/link"

const TASKS_PER_PAGE = 8

export default function TasksPage() {
  const { userTasks, toggleComplete, updateTask, deleteTask, getFilteredTasks, getSortedTasks } = useTasks()
  const [currentPage, setCurrentPage] = useState(1)
  
  // Filter state
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    status: "all",
    priority: "all",
  })

  // Sort state
  const [sortField, setSortField] = useState<SortField>("dueDate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  // Apply filters and sorting
  const processedTasks = useMemo(() => {
    const filtered = getFilteredTasks(filters)
    return getSortedTasks(filtered, sortField, sortOrder)
  }, [userTasks, filters, sortField, sortOrder, getFilteredTasks, getSortedTasks])

  const totalPages = Math.ceil(processedTasks.length / TASKS_PER_PAGE)
  const paginatedTasks = processedTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  )

  const handleFilterChange = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({ search: "", status: "all", priority: "all" })
    setCurrentPage(1)
  }

  const hasActiveFilters = filters.search || filters.status !== "all" || filters.priority !== "all"

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Header title="Tasks" subtitle={`${processedTasks.length} tasks found`} />
          <Button asChild>
            <Link href="/tasks/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value as TaskFilters["status"])}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <Select
              value={filters.priority}
              onValueChange={(value) => handleFilterChange("priority", value as TaskFilters["priority"])}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSortChange("title")}>
                  Title {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("dueDate")}>
                  Due Date {sortField === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("priority")}>
                  Priority {sortField === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("status")}>
                  Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Active filters:</span>
              {filters.search && (
                <span className="rounded-md bg-secondary px-2 py-1">
                  Search: &quot;{filters.search}&quot;
                </span>
              )}
              {filters.status !== "all" && (
                <span className="rounded-md bg-secondary px-2 py-1">
                  Status: {filters.status}
                </span>
              )}
              {filters.priority !== "all" && (
                <span className="rounded-md bg-secondary px-2 py-1">
                  Priority: {filters.priority}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Task Table */}
        {paginatedTasks.length > 0 ? (
          <TaskTable
            tasks={paginatedTasks}
            onToggleComplete={toggleComplete}
            onStatusChange={(id, status) => updateTask(id, { status })}
            onDelete={deleteTask}
          />
        ) : (
          <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">No tasks found</p>
            {hasActiveFilters && (
              <Button variant="link" onClick={clearFilters} className="text-sm">
                Clear filters to see all tasks
              </Button>
            )}
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
