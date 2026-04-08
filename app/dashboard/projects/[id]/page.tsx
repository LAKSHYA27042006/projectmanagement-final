import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { TaskList } from "@/components/task-list"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { ProjectStatusSelect } from "@/components/project-status-select"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Project, Task } from "@/lib/types"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  if (tasksError) {
    console.error("Error fetching tasks:", tasksError)
  }

  const typedProject = project as Project
  const typedTasks = (tasks as Task[]) || []

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{typedProject.name}</h1>
          {typedProject.description && (
            <p className="text-muted-foreground mt-1">
              {typedProject.description}
            </p>
          )}
        </div>
        <ProjectStatusSelect project={typedProject} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <CreateTaskDialog projectId={id} />
      </div>

      <TaskList tasks={typedTasks} projectId={id} />
    </div>
  )
}
