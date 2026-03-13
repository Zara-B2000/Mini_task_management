"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, MessageSquare, Paperclip } from "lucide-react"

export interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
  dueDate?: string
  assignee?: {
    name: string
    avatar?: string
    initials: string
  }
  comments?: number
  attachments?: number
  completed?: boolean
}

interface TaskCardProps {
  task: Task
  onToggleComplete?: (id: string) => void
}

const priorityColors = {
  low: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  medium: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  high: "bg-destructive/20 text-destructive border-destructive/30",
}

const statusColors = {
  todo: "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/20 text-primary",
  completed: "bg-chart-1/20 text-chart-1",
}

export function TaskCard({ task, onToggleComplete }: TaskCardProps) {
  return (
    <Card
      className={cn(
        "border-border bg-card transition-all hover:border-primary/50",
        task.completed && "opacity-60"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete?.(task.id)}
            className="mt-1"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "font-medium leading-tight",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>

            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{task.dueDate}</span>
                  </div>
                )}
                {task.comments !== undefined && task.comments > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{task.comments}</span>
                  </div>
                )}
                {task.attachments !== undefined && task.attachments > 0 && (
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>{task.attachments}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={statusColors[task.status]}>
                  {task.status.replace("-", " ")}
                </Badge>
                {task.assignee && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatar} />
                    <AvatarFallback className="text-xs">
                      {task.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
