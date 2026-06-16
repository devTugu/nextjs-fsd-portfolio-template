'use client';

import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import type { DashboardContactStats } from '@/entities/dashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/ui/chart';

const contentChartConfig = {
  count: { label: 'Items', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const contactChartConfig = {
  NEW: { label: 'New', color: 'hsl(var(--chart-1))' },
  READ: { label: 'Read', color: 'hsl(var(--chart-2))' },
  ARCHIVED: { label: 'Archived', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

interface DashboardChartsProps {
  projects: number;
  skills: number;
  experiences: number;
  contactMessages?: DashboardContactStats;
  showContact: boolean;
}

export function DashboardCharts({
  projects,
  skills,
  experiences,
  contactMessages,
  showContact,
}: DashboardChartsProps) {
  const contentData = [
    { name: 'Projects', count: projects },
    { name: 'Skills', count: skills },
    { name: 'Experiences', count: experiences },
  ];

  const contactData = [
    { status: 'NEW', value: contactMessages?.new ?? 0, fill: 'var(--color-NEW)' },
    { status: 'READ', value: contactMessages?.read ?? 0, fill: 'var(--color-READ)' },
    {
      status: 'ARCHIVED',
      value: contactMessages?.archived ?? 0,
      fill: 'var(--color-ARCHIVED)',
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio content</CardTitle>
          <CardDescription>Published items across modules</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={contentChartConfig}
            className="aspect-auto h-[280px] w-full min-h-[280px] min-w-0"
          >
            <BarChart data={contentData} accessibilityLayer>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={6} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {showContact ? (
        <Card>
          <CardHeader>
            <CardTitle>Contact inbox</CardTitle>
            <CardDescription>Messages by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={contactChartConfig}
              className="mx-auto aspect-auto h-[280px] w-full min-h-[280px] min-w-0 max-w-sm"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={contactData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={90}
                  strokeWidth={4}
                >
                  {contactData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
