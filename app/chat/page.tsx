"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock chat list data
const mockChatList = {
  student: [
    {
      id: "teacher-dr-sarah-johnson",
      name: "Dr. Sarah Johnson",
      role: "teacher",
      subject: "Mathematics",
      avatar: "/teacher-woman-professional.jpg",
      lastMessage: "Great question! When using integration by parts with definite integrals...",
      timestamp: "10:47 AM",
      unread: 0,
      isOnline: true,
    },
    {
      id: "teacher-prof-michael-chen",
      name: "Prof. Michael Chen",
      role: "teacher",
      subject: "Chemistry",
      avatar: "/teacher-man-professional.jpg",
      lastMessage: "I've uploaded the organic chemistry notes you requested.",
      timestamp: "Yesterday",
      unread: 2,
      isOnline: false,
    },
    {
      id: "teacher-dr-emily-davis",
      name: "Dr. Emily Davis",
      role: "teacher",
      subject: "Physics",
      avatar: "/teacher-woman-physics.jpg",
      lastMessage: "The physics problem you shared is quite interesting. Let me explain...",
      timestamp: "2 days ago",
      unread: 0,
      isOnline: true,
    },
  ],
  teacher: [
    {
      id: "student-rahul-sharma",
      name: "Rahul Sharma",
      role: "student",
      school: "Delhi Public School",
      avatar: "/student-avatar.png",
      lastMessage: "Thank you for the calculus explanation! It's much clearer now.",
      timestamp: "2 hours ago",
      unread: 1,
      isOnline: false,
    },
    {
      id: "student-priya-patel",
      name: "Priya Patel",
      role: "student",
      school: "Mumbai International School",
      avatar: "/diverse-student-profiles.png",
      lastMessage: "Can you help me with the integration by parts method?",
      timestamp: "1 day ago",
      unread: 0,
      isOnline: true,
    },
    {
      id: "student-arjun-kumar",
      name: "Arjun Kumar",
      role: "student",
      school: "Bangalore Public School",
      avatar: "/placeholder.svg?key=student3",
      lastMessage: "When will you upload the next video on differential equations?",
      timestamp: "2 days ago",
      unread: 3,
      isOnline: false,
    },
  ],
}

export default function ChatListPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [chatList, setChatList] = useState<any[]>([])

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    const storedUserData = localStorage.getItem("userData")

    if (!storedUserType || !storedUserData) {
      router.push("/")
      return
    }

    setUserType(storedUserType)
    setUserData(JSON.parse(storedUserData))

    // Load appropriate chat list
    const chats = mockChatList[storedUserType as keyof typeof mockChatList] || []
    setChatList(chats)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userData")
    router.push("/")
  }

  const getBackUrl = () => {
    return userType === "student" ? "/student/dashboard" : "/teacher/dashboard"
  }

  const filteredChats = chatList.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.subject && chat.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (chat.school && chat.school.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const totalUnread = chatList.reduce((sum, chat) => sum + chat.unread, 0)

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={getBackUrl()} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <span className="text-lg">←</span>
              Back
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white">📚</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BrainBuddy
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={userType === "student" ? "/student-avatar.png" : "/teacher-woman-professional.jpg"} />
                <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{userData?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <span className="text-sm">🚪</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Messages</h2>
            <p className="text-gray-600">
              {userType === "student" ? "Chat with your teachers" : "Chat with your students"}
            </p>
          </div>
          {totalUnread > 0 && (
            <Badge variant="default" className="bg-red-500">
              {totalUnread} unread
            </Badge>
          )}
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              <Input
                placeholder={`Search ${userType === "student" ? "teachers" : "students"}...`}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Chat List */}
        <div className="space-y-3">
          {filteredChats.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-500">No conversations found.</p>
                <p className="text-sm text-gray-400 mt-2">
                  {userType === "student"
                    ? "Start learning and chat with teachers!"
                    : "Students will appear here when they message you."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredChats.map((chat) => (
              <Link key={chat.id} href={`/chat/${chat.id.replace("-", "/")}`}>
                <Card
                  className={`hover:shadow-md transition-shadow cursor-pointer ${chat.unread > 0 ? "border-blue-200 bg-blue-50/50" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {chat.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">{chat.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              {chat.role === "teacher" ? chat.subject : chat.school}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-1">{chat.lastMessage}</p>
                          </div>
                          {chat.unread > 0 && (
                            <Badge variant="default" className="bg-blue-600 text-xs ml-2 flex-shrink-0">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
