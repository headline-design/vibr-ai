import { getProjectById, type Project } from "@/lib/project-service"

interface ProjectDetailPageProps {
  params: {
    projectId: string
  }
}

export default async function ProjectDetailPage({ params }) {
  const awaitedParams = await params
 const { projectId } = awaitedParams
  const project: Project = await getProjectById(projectId)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-600">{project.description}</p>
      {/* Add more project details here */}
    </div>
  )
}
