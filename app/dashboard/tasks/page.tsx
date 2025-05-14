"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
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
  {
    id: "5",
    title: "Documentation",
    description: "Update the project documentation",
    dueDate: "2023-06-18",
    status: "todo",
    priority: "medium",
  },
  {
    id: "6",
    title: "User Testing",
    description: "Conduct user testing for the new features",
    dueDate: "2023-06-25",
    status: "todo",
    priority: "high",
  },
]

export default function TasksPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tasks based on active tab and search query
  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    if (activeTab !== "all" && task.status !== activeTab) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <Button onClick={() => router.push("/dashboard/tasks/manage/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            {filteredTasks.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="text-sm font-medium">No tasks found</div>
                  <div className="text-sm text-muted-foreground">
                    {searchQuery ? "Try adjusting your search" : "Create a new task to get started"}
                  </div>
                  {!searchQuery && (
                    <Button
                      className="mt-4"
                      variant="outline"
                      onClick={() => router.push("/dashboard/tasks/manage/new")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Task
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
