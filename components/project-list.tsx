"use client"

import { useState, useMemo, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { FolderGit2, Search } from "lucide-react"
import { escapeRegExp } from "@/lib/escape-regexp"
import { useAssessmentStore } from "@/store/assessment-store"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface ProjectSummary {
  id: string
  name: string
  ownerEmail: string
}

interface ProjectListProps {
  /**
   * You can pass projects in directly OR let the component
   * pull them from the global assessment store.
   */
  projects?: ProjectSummary[]
  className?: string
}

export function ProjectList({ projects, className }: ProjectListProps) {
  const router = useRouter()
  const storeProjects = useAssessmentStore((s) => s.projects)
  const list = projects ?? storeProjects ?? []

  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return list

    // Escape user text so the RegExp constructor cannot throw.
    const safePattern = escapeRegExp(query.trim())

    try {
      const regex = new RegExp(safePattern, "i")
      return list.filter((p) => regex.test(p.name))
    } catch (err) {
      // Should rarely happen after escaping, but we guard anyway.
      console.warn("[ProjectList] regex fail – falling back to includes()", err)
      return list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    }
  }, [list, query])

  if (list.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        You don&apos;t have any projects yet. Click &ldquo;New Project&rdquo; to get started.
      </p>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
        <Input
          aria-label="Search projects"
          placeholder="Search projects…"
          className="pl-9"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
      </div>

      <ul className="space-y-2">
        {filtered.map((project) => (
          <li
            key={project.id}
            className="flex items-center justify-between rounded-md border p-3 hover:bg-muted cursor-pointer"
            onClick={() => router.push(`/project/${encodeURIComponent(project.name)}`)}
          >
            <div className="flex items-center gap-3">
              <FolderGit2 className="h-5 w-5 text-primary" />
              <span className="font-medium">{project.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{project.ownerEmail}</span>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-sm text-muted-foreground py-2 text-center">No projects match that search.</li>
        )}
      </ul>
    </div>
  )
}
