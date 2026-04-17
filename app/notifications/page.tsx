"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  MessageSquare,
  ThumbsUp,
  Award,
  Users,
  AtSign,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Lock,
  Heart,
  TrendingUp,
  BookOpen,
} from "lucide-react"

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "answer",
    title: "New answer to your question",
    message: "David Chen answered your question about Genesis 1:1",
    link: "/questions/1",
    isRead: false,
    createdAt: "5 minutes ago",
    actor: { name: "David Chen", image: null },
  },
  {
    id: "2",
    type: "like",
    title: "Your answer was liked",
    message: "Sarah Johnson and 4 others liked your answer",
    link: "/questions/2",
    isRead: false,
    createdAt: "1 hour ago",
    actor: { name: "Sarah Johnson", image: null },
  },
  {
    id: "3",
    type: "badge",
    title: "New badge earned!",
    message: "You earned the 'Scholar' badge for 10 accepted answers",
    link: "/badges",
    isRead: false,
    createdAt: "3 hours ago",
    actor: null,
  },
  {
    id: "4",
    type: "mention",
    title: "You were mentioned",
    message: "Emily Williams mentioned you in a discussion about Psalms",
    link: "/groups/1/discussions/2",
    isRead: true,
    createdAt: "5 hours ago",
    actor: { name: "Emily Williams", image: null },
  },
  {
    id: "5",
    type: "follow",
    title: "New follower",
    message: "Michael Brown started following you",
    link: "/users/4",
    isRead: true,
    createdAt: "1 day ago",
    actor: { name: "Michael Brown", image: null },
  },
  {
    id: "6",
    type: "level",
    title: "Level up!",
    message: "Congratulations! You reached Level 5 - Bible Scholar",
    link: "/profile",
    isRead: true,
    createdAt: "2 days ago",
    actor: null,
  },
  {
    id: "7",
    type: "group",
    title: "New group discussion",
    message: "A new discussion was posted in Genesis Study Circle",
    link: "/groups/1",
    isRead: true,
    createdAt: "2 days ago",
    actor: { name: "Group Activity", image: null },
  },
  {
    id: "8",
    type: "comment",
    title: "New comment on your answer",
    message: "Rachel Kim commented on your answer",
    link: "/questions/3",
    isRead: true,
    createdAt: "3 days ago",
    actor: { name: "Rachel Kim", image: null },
  },
]

function getNotificationIcon(type: string) {
  switch (type) {
    case "answer":
      return <MessageSquare className="h-5 w-5 text-blue-500" />
    case "like":
      return <Heart className="h-5 w-5 text-red-500" />
    case "badge":
      return <Award className="h-5 w-5 text-yellow-500" />
    case "mention":
      return <AtSign className="h-5 w-5 text-purple-500" />
    case "follow":
      return <Users className="h-5 w-5 text-green-500" />
    case "level":
      return <TrendingUp className="h-5 w-5 text-primary" />
    case "group":
      return <BookOpen className="h-5 w-5 text-orange-500" />
    case "comment":
      return <MessageSquare className="h-5 w-5 text-cyan-500" />
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />
  }
}

function NotificationItem({ 
  notification, 
  onMarkRead,
  onDelete 
}: { 
  notification: typeof mockNotifications[0]
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className={`flex items-start gap-4 p-4 border-b border-border last:border-0 transition-colors ${
      !notification.isRead ? 'bg-primary/5' : 'hover:bg-accent/30'
    }`}>
      {/* Icon or Avatar */}
      <div className="shrink-0">
        {notification.actor ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.actor.image || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {notification.actor.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
            {getNotificationIcon(notification.type)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link 
          href={notification.link}
          className="block group"
          onClick={() => !notification.isRead && onMarkRead(notification.id)}
        >
          <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
            {notification.title}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {notification.createdAt}
          </p>
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!notification.isRead && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onMarkRead(notification.id)}
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(notification.id)}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="shrink-0">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  )
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map((n) => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.isRead
    return n.type === activeTab
  })

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-4">
              Sign in to view your notifications
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated on your community activity
            </p>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions Bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="answer">Answers</TabsTrigger>
            <TabsTrigger value="like">Likes</TabsTrigger>
            <TabsTrigger value="badge">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <Card>
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={handleMarkRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === "unread" 
                      ? "All caught up!" 
                      : "No notifications yet"}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeTab === "unread"
                      ? "You have no unread notifications"
                      : "When you get notifications, they'll show up here"}
                  </p>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Notification Settings Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Customize which notifications you receive
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile?tab=settings">
                Manage Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
