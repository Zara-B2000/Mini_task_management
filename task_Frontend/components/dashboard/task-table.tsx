"use client"

import { useState } from "react"
import { Task, useTasks } from "@/lib/task-context"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

interface TaskTableProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onStatusChange: (id: string, status: Task["status"]) => void
  onDelete: (id: string) => void
}

const priorityColors = {
  low: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  medium: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  high: "bg-destructive/20 text-destructive border-destructive/30",
}

const statusColors = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/20 text-primary",
  completed: "bg-chart-1/20 text-chart-1",
}

export function TaskTable({ tasks, onToggleComplete, onStatusChange, onDelete }: TaskTableProps) {
  const { canEditTask, canDeleteTask } = useTasks()
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
  const taskToDelete = tasks.find((t) => t.id === deleteTaskId)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleDelete = () => {
    if (deleteTaskId) {
      onDelete(deleteTaskId)
      setDeleteTaskId(null)
    }
  }

  return (
    <>
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-12"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Due Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="border-border">
              <TableCell>
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleComplete(task.id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.title}
                </span>
              </TableCell>
              <TableCell className="hidden max-w-[200px] truncate text-muted-foreground md:table-cell">
                {task.description}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={task.status}
                  onValueChange={(value: Task["status"]) => onStatusChange(task.id, value)}
                >
                  <SelectTrigger className="w-[130px] border-0 bg-transparent p-0">
                    <SelectValue>
                      <Badge variant="secondary" className={statusColors[task.status]}>
                        {task.status.replace("-", " ")}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {formatDate(task.dueDate)}
              </TableCell>
              <TableCell>
                {(canEditTask(task) || canDeleteTask(task)) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canEditTask(task) && (
                        <DropdownMenuItem asChild>
                          <Link href={`/tasks/${task.id}/edit`} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {canDeleteTask(task) && (
                        <DropdownMenuItem
                          onClick={() => setDeleteTaskId(task.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={!!deleteTaskId} onOpenChange={(open) => !open && setDeleteTaskId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{taskToDelete?.title}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
