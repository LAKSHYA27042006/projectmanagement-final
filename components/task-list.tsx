"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Task } from "@/lib/types"
import { Trash2 } from "lucide-react"
import { deleteTask, updateTask } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface TaskListProps {
  tasks: Task[]
  projectId: string
}

const priorityColors = {
  low: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-red-500/10 text-red-500 border-red-500/20",
}

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
}

export function TaskList({ tasks, projectId }: TaskListProps) {
  const router = useRouter()

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    const result = await updateTask(taskId, projectId, { status })
    if (result.error) {
      toast.error(result.error)
    } else {
      router.refresh()
    }
  }

  const handleToggleDone = async (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done"
    const result = await updateTask(task.id, projectId, { status: newStatus })
    if (result.error) {
      toast.error(result.error)
    } else {
      router.refresh()
    }
  }

  const handleDelete = async (taskId: string) => {
    const result = await deleteTask(taskId, projectId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Task deleted")
      router.refresh()
    }
  }

  if (tasks.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground text-center">
            No tasks yet. Create your first task to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress")
  const doneTasks = tasks.filter((t) => t.status === "done")

  const renderTaskCard = (task: Task) => (
    <Card key={task.id} className="glass hover-lift">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === "done"}
            onCheckedChange={() => handleToggleDone(task)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-medium ${
                  task.status === "done" ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </span>
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            {task.due_date && (
              <p className="text-xs text-muted-foreground mt-2">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={task.status}
              onValueChange={(value) =>
                handleStatusChange(task.id, value as Task["status"])
              }
            >
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {todoTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            To Do ({todoTasks.length})
          </h3>
          <div className="space-y-2">{todoTasks.map(renderTaskCard)}</div>
        </div>
      )}

      {inProgressTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            In Progress ({inProgressTasks.length})
          </h3>
          <div className="space-y-2">{inProgressTasks.map(renderTaskCard)}</div>
        </div>
      )}

      {doneTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Done ({doneTasks.length})
          </h3>
          <div className="space-y-2">{doneTasks.map(renderTaskCard)}</div>
        </div>
      )}
    </div>
  )
}
