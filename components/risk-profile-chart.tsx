"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RiskProfileChartProps {
  data: {
    high: number
    medium: number
    low: number
  }
}

export function RiskProfileChart({ data }: RiskProfileChartProps) {
  const { high, medium, low } = data
  const total = high + medium + low

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">No risks identified yet.</div>
        </CardContent>
      </Card>
    )
  }

  const highPercentage = (high / total) * 100
  const mediumPercentage = (medium / total) * 100
  const lowPercentage = (low / total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${highPercentage}%` }}
              title={`High Risk: ${high} (${highPercentage.toFixed(1)}%)`}
            />
            <div
              className="bg-amber-500 transition-all duration-500"
              style={{ width: `${mediumPercentage}%` }}
              title={`Medium Risk: ${medium} (${mediumPercentage.toFixed(1)}%)`}
            />
            <div
              className="bg-green-500 transition-all duration-500"
              style={{ width: `${lowPercentage}%` }}
              title={`Low Risk: ${low} (${lowPercentage.toFixed(1)}%)`}
            />
          </div>
          <div className="flex justify-around text-xs text-muted-foreground">
            <div className="flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />
              <span>High ({high})</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-amber-500" />
              <span>Medium ({medium})</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
              <span>Low ({low})</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
