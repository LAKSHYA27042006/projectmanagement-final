import { createClient } from "@/lib/supabase/server"
import { ProjectList } from "@/components/project-list"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import type { Project } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your projects and tasks
          </p>
        </div>
        <CreateProjectDialog />
      </div>
      <ProjectList projects={(projects as Project[]) || []} />
    </div>
  )
}
