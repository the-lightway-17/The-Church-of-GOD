"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Plus,
  X,
  BarChart3,
  Lock,
  GripVertical,
} from "lucide-react"

const categories = [
  { value: "community", label: "Community" },
  { value: "discussion", label: "Discussion" },
  { value: "schedule", label: "Schedule" },
  { value: "personal", label: "Personal" },
  { value: "study", label: "Bible Study" },
]

const durations = [
  { value: "1", label: "1 day" },
  { value: "3", label: "3 days" },
  { value: "7", label: "1 week" },
  { value: "14", label: "2 weeks" },
  { value: "30", label: "1 month" },
]

export default function CreatePollPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    question: "",
    description: "",
    category: "",
    duration: "7",
    options: ["", ""],
  })

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({ ...formData, options: [...formData.options, ""] })
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData({ ...formData, options: newOptions })
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/polls")
  }

  const isValid =
    formData.question.trim() &&
    formData.category &&
    formData.options.filter((o) => o.trim()).length >= 2

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to create a poll
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link 
          href="/polls" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Polls
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Create a Poll
          </h1>
          <p className="text-muted-foreground mt-2">
            Ask the community a question and gather opinions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle>Your Question</CardTitle>
              <CardDescription>
                What would you like to ask the community?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  placeholder="e.g., Which book of the Bible should we study next?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.question.length}/200 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add context or details about your poll..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  maxLength={500}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Poll Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Answer Options</CardTitle>
              <CardDescription>
                Add 2-6 options for people to vote on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    maxLength={100}
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.options.filter((o) => o.trim()).length} of 6 options added
              </p>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-accent/30 border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-3">
                {formData.question || "Your question will appear here"}
              </p>
              <div className="space-y-2">
                {formData.options.filter((o) => o.trim()).map((option, index) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg bg-background border text-sm"
                  >
                    {option}
                  </div>
                ))}
                {formData.options.filter((o) => o.trim()).length === 0 && (
                  <div className="p-2 rounded-lg bg-background border text-sm text-muted-foreground">
                    Add options above to see them here
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Polls cannot be edited after creation
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href="/polls">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Create Poll
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
