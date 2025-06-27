"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Project {
  id: string
  name: string
  description?: string | null
}

interface ProjectListProps {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [query, setQuery] = useState("")

  /** ------------------------------------------------------------
   *  SAFER FILTER: we avoid RegExp altogether to prevent the
   *  “Invalid regular expression: missing /” runtime error.
   *  ---------------------------------------------------------- */
  const filtered = useMemo(() => {
    if (!query.trim()) return projects
    const q = query.toLowerCase()
    return projects.filter((p) => p.name.toLowerCase().includes(q))
  }, [projects, query])

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search projects…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={() => setQuery("")} disabled={!query}>
          Clear
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects match your search.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <li key={project.id}>
              <Card as="article">
                <Link href={`/project/${encodeURIComponent(project.id)}`} className="block">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold leading-tight">{project.name}</CardTitle>
                  </CardHeader>
                  {project.description && (
                    <CardContent className="text-sm text-muted-foreground">{project.description}</CardContent>
                  )}
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
