"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "@/components/task-card"

// Mock data
const tasks = [
  {
    id: "1",
    title: "Project Proposal",
    description: "Create a project proposal for the new client",
    dueDate: "2023-06-15",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "2",
    title: "Website Redesign",
    description: "Redesign the company website",
    dueDate: "2023-06-20",
    status: "todo",
    priority: "medium",
  },
  {
    id: "3",
    title: "Client Meeting",
    description: "Prepare for the client meeting",
    dueDate: "2023-06-10",
    status: "completed",
    priority: "high",
  },
  {
    id: "4",
    title: "Bug Fixes",
    description: "Fix bugs in the application",
    dueDate: "2023-06-12",
    status: "in-progress",
    priority: "low",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all")

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  const totalTasks = tasks.length
  const completedTasksCount = completedTasks.length
  const completionRate = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {todoTasks.length} to do, {inProgressTasks.length} in progress
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasksCount}</div>
              <p className="text-xs text-muted-foreground">{completionRate.toFixed(0)}% completion rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {inProgressTasks.length > 0 ? "Active tasks" : "No active tasks"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todoTasks.length}</div>
              <p className="text-xs text-muted-foreground">Tasks to be started</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
            <CardDescription>Your overall task completion progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>Progress</div>
                <div className="font-medium">{completionRate.toFixed(0)}%</div>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="todo">To Do</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>
            <div className="mt-4">
              <TabsContent value="all" className="space-y-4">
                {tasks.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="text-sm font-medium">No tasks found</div>
                      <div className="text-sm text-muted-foreground">Create a new task to get started</div>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="in-progress" className="space-y-4">
                {inProgressTasks.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {inProgressTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="text-sm font-medium">No in-progress tasks</div>
                      <div className="text-sm text-muted-foreground">Start working on a task to see it here</div>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="todo" className="space-y-4">
                {todoTasks.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {todoTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="text-sm font-medium">No to-do tasks</div>
                      <div className="text-sm text-muted-foreground">All tasks are in progress or completed</div>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {completedTasks.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {completedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="text-sm font-medium">No completed tasks</div>
                      <div className="text-sm text-muted-foreground">Complete a task to see it here</div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
