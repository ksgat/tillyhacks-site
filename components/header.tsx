"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"
import { useRouter } from "next/navigation"
import { FaSignInAlt, FaSignOutAlt, FaFileAlt, FaDiscord, FaInstagram, FaHandHoldingUsd } from "react-icons/fa"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        // Get user profile data
        const { data: profileData } = await supabase.from("profiles").select("name").eq("id", userData.user.id).single()

        if (profileData) {
          setUserName(profileData.name)
        } else {
          setUserName(userData.user.user_metadata?.name || null)
        }
      }
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserName(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    router.push("/")
    router.refresh()
  }

  if (!isClient) {
    return null
  }

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl md:text-3xl font-bold">
          <span className="text-primary">Tilly</span>Hacks
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {userName && <p className="text-sm text-muted-foreground">{userName}</p>}
          <div className="flex items-center space-x-4">
            <Link href="/instagram" className="text-foreground hover:text-primary transition-colors" title="Instagram">
              <FaInstagram size={20} />
            </Link>
            <Link href="/discord" className="text-foreground hover:text-primary transition-colors" title="Discord">
              <FaDiscord size={20} />
            </Link>
            <Link href="/donate" className="text-foreground hover:text-primary transition-colors" title="Donate">
              <FaHandHoldingUsd size={20} />
            </Link>
            <Link href="/forms" className="text-foreground hover:text-primary transition-colors" title="Forms">
              <FaFileAlt size={20} />
            </Link>
            {userName ? (
              <Button variant="ghost" onClick={handleLogout} title="Logout">
                <FaSignOutAlt size={20} />
              </Button>
            ) : (
              <Link href="/login" title="Login">
                <Button variant="ghost">
                  <FaSignInAlt size={20} />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-4 mt-8">
              {userName && <p className="text-sm text-muted-foreground mb-4">Welcome to TillyHacks, {userName}!</p>}
              <Link href="/" className="py-2 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/forms" className="py-2 hover:text-primary transition-colors">
                Forms
              </Link>
              <Link href="/instagram" className="py-2 hover:text-primary transition-colors">
                Instagram
              </Link>
              <Link href="/discord" className="py-2 hover:text-primary transition-colors">
                Discord
              </Link>
              <Link href="/donate" className="py-2 hover:text-primary transition-colors">
                Donate
              </Link>
              {userName ? (
                <Button variant="outline" onClick={handleLogout} className="mt-4">
                  Logout
                </Button>
              ) : (
                <Link href="/login">
                  <Button className="w-full mt-4">Login</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
