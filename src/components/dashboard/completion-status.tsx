"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { getCompletionData } from "~/lib/utils"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function CompletionStatus() {
  const completionData = getCompletionData()

  const dailyData = completionData.daily.map((value, index) => ({
    name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
    value,
  }))

  const weeklyData = completionData.weekly.map((value, index) => ({
    name: `Week ${index + 1}`,
    value,
  }))

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Completion Status</CardTitle>
        <CardDescription>Your task completion over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
                labelStyle={{ color: "hsl(var(--card-foreground))" }}
              />
              <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

