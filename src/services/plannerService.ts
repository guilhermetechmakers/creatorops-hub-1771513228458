export interface PipelineItem {
  id: string
  title: string
  channel?: string
  status: string
  stage: string
}

export interface PlannerPipelineStage {
  id: string
  name: string
  items: PipelineItem[]
}

export interface PlannerData {
  stages: PlannerPipelineStage[]
}

const DEFAULT_STAGES = [
  'Ideas',
  'Drafting',
  'In Review',
  'Scheduled',
  'Published',
]

/**
 * Fetches planner pipeline data. In production, replace with apiGet('/planner/pipeline').
 */
export async function getPlannerPipeline(): Promise<PlannerData> {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))
  await delay(600)

  const stages: PlannerPipelineStage[] = DEFAULT_STAGES.map((name, i) => ({
    id: `stage-${i}`,
    name,
    items: [],
  }))

  return { stages }
}
