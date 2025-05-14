"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { ArrowLeft, CalendarIcon, FileUp, Loader2, Save, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Mock task data for edit mode
const mockTasks = {
  "1": {
    id: "1",
    title: "Project Proposal",
    description: "Create a project proposal for the new client. Include project scope, timeline, and budget estimates.",
    dueDate: "2023-06-15",
    status: "in-progress",
    priority: "high",
    createdAt: "2023-06-01",
    attachments: [
      { id: "1", name: "requirements.pdf", size: "2.4 MB", type: "application/pdf" },
      { id: "2", name: "mockup.png", size: "1.8 MB", type: "image/png" },
    ],
  },
  new: null,
}

export default function ManageTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTask, setIsLoadingTask] = useState(params.id !== "new")
  const isEditMode = params.id !== "new"

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
  })
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [attachments, setAttachments] = useState<
    Array<{ id?: string; file?: File; name: string; size: string; type: string }>
  >([])

  // Load task data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, this would be an API call
      const loadTask = async () => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800))

          const task = mockTasks[params.id]
          if (task) {
            setFormData({
              title: task.title,
              description: task.description,
              priority: task.priority,
              status: task.status,
            })
            setDueDate(parseISO(task.dueDate))
            setAttachments(task.attachments)
          }
        } catch (error) {
          toast({
            title: "Error loading task",
            description: "Could not load the task details. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoadingTask(false)
        }
      }

      loadTask()
    }
  }, [isEditMode, params.id, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      }))
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would be replaced with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isEditMode ? "Task updated" : "Task created",
        description: isEditMode
          ? "Your task has been updated successfully."
          : "Your task has been created successfully.",
      })

      router.push("/dashboard/tasks")
    } catch (error) {
      toast({
        title: "Error",
        description: isEditMode
          ? "Failed to update task. Please try again."
          : "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingTask) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading task details...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{isEditMode ? "Edit Task" : "Create New Task"}</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{isEditMode ? "Edit Task Details" : "Task Details"}</CardTitle>
              <CardDescription>
                {isEditMode ? "Update the details of your existing task" : "Fill in the details for your new task"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">
                  Task Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[120px]"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-base">
                    Priority
                  </Label>
                  <Select
                    disabled={isLoading}
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange("priority", value)}
                  >
                    <SelectTrigger id="priority" className="h-10">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-base">
                    Due Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dueDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-10",
                          !dueDate && "text-muted-foreground",
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Select a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Attachments</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileUp className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      disabled={isLoading}
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <Label>Uploaded Files</Label>
                    <div className="rounded-md border divide-y">
                      {attachments.map((attachment, index) => (
                        <div key={attachment.id || index} className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              <FileUp className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">{attachment.size}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            disabled={isLoading}
                          >
                            <Trash className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Save Changes" : "Create Task"}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
