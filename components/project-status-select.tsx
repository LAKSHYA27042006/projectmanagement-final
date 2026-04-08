"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Project } from "@/lib/types"
import { updateProjectStatus } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProjectStatusSelectProps {
  project: Project
}

export function ProjectStatusSelect({ project }: ProjectStatusSelectProps) {
  const router = useRouter()

  const handleStatusChange = async (status: Project["status"]) => {
    const result = await updateProjectStatus(project.id, status)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Project status updated")
      router.refresh()
    }
  }

  return (
    <Select value={project.status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
  )
}
