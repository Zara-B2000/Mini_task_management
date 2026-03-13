"use client"

import { useState } from "react"
import { TaskCard, Task } from "./task-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete?: (id: string) => void
}

export function TaskList({ tasks, onToggleComplete }: TaskListProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return task.completed
    if (activeTab === "in-progress") return task.status === "in-progress"
    if (activeTab === "todo") return task.status === "todo"
    return true
  })

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.completed).length,
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full justify-start bg-secondary">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="todo">To Do ({counts.todo})</TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({counts["in-progress"]})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({counts.completed})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No tasks found
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
