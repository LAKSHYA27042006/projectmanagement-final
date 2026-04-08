"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Project } from "@/lib/types"
import { Trash2 } from "lucide-react"
import { deleteProject } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProjectListProps {
  projects: Project[]
}

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter()

  const handleDelete = async (projectId: string) => {
    const result = await deleteProject(projectId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Project deleted")
      router.refresh()
    }
  }

  if (projects.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground text-center">
            No projects yet. Create your first project to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="card-3d glass hover-lift">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <Badge variant="outline" className={statusColors[project.status]}>
                {project.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {project.description || "No description"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pt-2">
              <Button asChild variant="default" size="sm">
                <Link href={`/dashboard/projects/${project.id}`}>
                  View Tasks
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
