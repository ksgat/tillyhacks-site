"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

const scheduleItems = [
  {
    time: "8:00 AM",
    title: "Check-in & Breakfast",
    details: "Start your day by checking in and enjoying a light breakfast to fuel up for the event.",
  },
  {
    time: "9:00 AM",
    title: "Opening Ceremony",
    details: "Join us for the official kickoff of TillyHacks, featuring a welcome speech and event overview.",
  },
  {
    time: "10:00 AM",
    title: "Hacking Begins",
    details: "Dive into your projects! Collaborate with your team and start building something amazing.",
  },
  {
    time: "1:00 PM",
    title: "Lunch Break",
    details: "Take a break and enjoy a delicious lunch while networking with other participants.",
  },
  {
    time: "3:00 PM",
    title: "Workshops",
    details: "Attend hands-on workshops to learn new skills and gain insights from industry experts.",
  },
  {
    time: "6:00 PM",
    title: "Dinner",
    details: "Relax and recharge with a hearty dinner as you prepare for the evening activities.",
  },
  {
    time: "8:00 PM",
    title: "Networking Session",
    details: "Connect with fellow hackers, mentors, and sponsors during this interactive session.",
  },
  {
    time: "10:00 PM",
    title: "Wrap Up",
    details: "End the day by wrapping up your projects and preparing for the final presentations.",
  },
]

export default function Schedule() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <div className="grid gap-4">
      {scheduleItems.map((item, index) => (
        <Card
          key={index}
          className={`schedule-item cursor-pointer ${openItem === index ? "open" : ""}`}
          onClick={() => toggleItem(index)}
        >
          <CardContent className="p-4 flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold">{item.time}</span> - {item.title}
              </div>
              <ChevronDown className={`transition-transform ${openItem === index ? "rotate-180" : ""}`} size={20} />
            </div>
            <div className="details text-muted-foreground text-sm">{item.details}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
