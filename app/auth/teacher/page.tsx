"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TeacherAuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    bio: "",
    otp: "",
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setOtpSent(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setOtpSent(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      // Store user data in localStorage for demo
      localStorage.setItem("userType", "teacher")
      localStorage.setItem(
        "userData",
        JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          bio: formData.bio,
        }),
      )
      router.push("/teacher/dashboard")
    }, 1000)
  }

  if (otpSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">📱</span>
            </div>
            <CardTitle>Verify OTP</CardTitle>
            <CardDescription>Enter the 6-digit code sent to {formData.mobile}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setOtpSent(false)}>
                Back to Form
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
            <span>←</span>
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📚</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              BrainBuddy
            </h1>
          </div>
          <p className="text-gray-600">Teacher Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Teacher!</CardTitle>
            <CardDescription className="text-center">Join BrainBuddy to share your knowledge and earn</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-name">Name</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">👤</span>
                      <Input
                        id="login-name"
                        type="text"
                        placeholder="Enter your name"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="login-mobile">Mobile Number</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">📱</span>
                      <Input
                        id="login-mobile"
                        type="tel"
                        placeholder="Enter mobile number"
                        className="pl-10"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">👤</span>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="register-mobile">Mobile Number</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">📱</span>
                      <Input
                        id="register-mobile"
                        type="tel"
                        placeholder="Enter mobile number"
                        className="pl-10"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Description/Bio</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">📄</span>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your teaching experience and expertise..."
                        className="pl-10 min-h-[100px]"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Register & Send OTP"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
