"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Users,
  Lock,
  Globe,
  BookOpen,
  Heart,
  Sparkles,
  X,
  Plus,
} from "lucide-react"

const categories = [
  { value: "book-study", label: "Book Study", icon: BookOpen, description: "Study a specific book of the Bible together" },
  { value: "fellowship", label: "Fellowship", icon: Heart, description: "Connect and share life with other believers" },
  { value: "prayer", label: "Prayer", icon: Sparkles, description: "Pray together and share prayer requests" },
  { value: "theology", label: "Theology", icon: BookOpen, description: "Discuss theological topics and doctrines" },
  { value: "devotional", label: "Devotional", icon: Heart, description: "Daily devotions and spiritual growth" },
]

const suggestedTags = [
  "Genesis", "Exodus", "Psalms", "Proverbs", "Isaiah", "Matthew", "John", "Romans",
  "Prayer", "Worship", "Faith", "Grace", "Love", "Hope", "Wisdom", "Leadership",
  "Youth", "Women", "Men", "Families", "Singles", "Seniors", "New Believers",
]

export default function CreateGroupPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    isPrivate: false,
    tags: [] as string[],
    guidelines: ["Be respectful and kind to all members"],
  })
  const [newTag, setNewTag] = useState("")
  const [newGuideline, setNewGuideline] = useState("")

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const handleAddGuideline = () => {
    if (newGuideline && formData.guidelines.length < 10) {
      setFormData({ ...formData, guidelines: [...formData.guidelines, newGuideline] })
      setNewGuideline("")
    }
  }

  const handleRemoveGuideline = (index: number) => {
    setFormData({
      ...formData,
      guidelines: formData.guidelines.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/groups")
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to create a group
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Link 
          href="/groups" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Groups
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create a New Group</h1>
          <p className="text-muted-foreground mt-2">
            Start a community for Bible study, prayer, or fellowship
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Give your group a name and description that reflects its purpose
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Genesis Study Circle"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.name.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your group is about, what you'll study, and who should join..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.category && (
                  <p className="text-xs text-muted-foreground">
                    {categories.find((c) => c.value === formData.category)?.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see and join your group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formData.isPrivate ? (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">
                      {formData.isPrivate ? "Private Group" : "Public Group"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.isPrivate
                        ? "Only approved members can see group content"
                        : "Anyone can view and join this group"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add tags to help others discover your group (up to 10)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-muted rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a custom tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag(newTag)
                    }
                  }}
                  maxLength={30}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddTag(newTag)}
                  disabled={!newTag || formData.tags.length >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter((tag) => !formData.tags.includes(tag))
                    .slice(0, 12)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        disabled={formData.tags.length >= 10}
                        className="px-2 py-1 text-xs rounded-md bg-accent/50 hover:bg-accent text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Group Guidelines</CardTitle>
              <CardDescription>
                Set rules for your community to keep discussions healthy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {formData.guidelines.map((guideline, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg bg-accent/30"
                  >
                    <span className="flex-1 text-sm">{guideline}</span>
                    {formData.guidelines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveGuideline(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a guideline..."
                  value={newGuideline}
                  onChange={(e) => setNewGuideline(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddGuideline()
                    }
                  }}
                  maxLength={200}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddGuideline}
                  disabled={!newGuideline || formData.guidelines.length >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              By creating a group, you agree to our community guidelines
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href="/groups">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.description || !formData.category}
              >
                {isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Create Group
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
