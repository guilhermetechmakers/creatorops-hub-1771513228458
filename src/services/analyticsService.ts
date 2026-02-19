export interface ChannelDataPoint {
  channel: string
  posts: number
  engagement: number
}

export interface AnalyticsSummary {
  postsPublished: number
  postsPublishedLabel: string
  avgTimeToPublish: string
  avgTimeToPublishTrend: string
  teamProductivity: string
  teamProductivityLabel: string
}

export interface AnalyticsData {
  summary: AnalyticsSummary
  channelData: ChannelDataPoint[]
}

/**
 * Simulates analytics fetch. In production, replace with apiGet('/analytics') or similar.
 */
async function fetchAnalytics(): Promise<AnalyticsData> {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  await delay(800)

  return {
    summary: {
      postsPublished: 48,
      postsPublishedLabel: 'This month',
      avgTimeToPublish: '2.4 days',
      avgTimeToPublishTrend: '-18% vs last month',
      teamProductivity: '94%',
      teamProductivityLabel: 'On-time delivery',
    },
    channelData: [
      { channel: 'Instagram', posts: 24, engagement: 12.4 },
      { channel: 'X', posts: 18, engagement: 8.2 },
      { channel: 'YouTube', posts: 6, engagement: 15.1 },
    ],
  }
}

/**
 * Fetches analytics data for the dashboard.
 */
export async function getAnalytics(): Promise<AnalyticsData> {
  const data = await fetchAnalytics()
  return data
}
