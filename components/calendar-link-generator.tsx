"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function CalendarLinkGenerator() {
  const { toast } = useToast()
  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [links, setLinks] = useState<{ [key: string]: string }>({})

  const generateLinks = () => {
    if (!eventTitle || !startDate || !startTime || !endDate || !endTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Format dates for calendar links
    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)

    // Format for Google Calendar
    const googleStart = start.toISOString().replace(/-|:|\.\d+/g, "")
    const googleEnd = end.toISOString().replace(/-|:|\.\d+/g, "")
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${googleStart}/${googleEnd}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`

    // Format for Outlook.com
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`

    // Format for Yahoo Calendar
    const yahooStart = start.toISOString().replace(/-|:|\.\d+/g, "")
    const yahooEnd = end.toISOString().replace(/-|:|\.\d+/g, "")
    const yahooUrl = `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(eventTitle)}&st=${yahooStart}&et=${yahooEnd}&desc=${encodeURIComponent(eventDescription)}&in_loc=${encodeURIComponent(eventLocation)}`

    // Format for iCal (Apple Calendar)
    const icalUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.URL}
DTSTART:${start.toISOString().replace(/-|:|\.\d+/g, "")}
DTEND:${end.toISOString().replace(/-|:|\.\d+/g, "")}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription}
LOCATION:${eventLocation}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, "%0A")

    setLinks({
      google: googleUrl,
      outlook: outlookUrl,
      yahoo: yahooUrl,
      ical: icalUrl,
    })
  }

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: "Copied to clipboard",
      description: "Calendar link has been copied to your clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add-to-Calendar Link Generator</CardTitle>
        <CardDescription>Generate links that allow users to add your event to their calendar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="event-title">Event Title*</Label>
            <Input
              id="event-title"
              placeholder="e.g. Product Launch Webinar"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Event Description</Label>
            <Textarea
              id="event-description"
              placeholder="Enter event details..."
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-location">Location</Label>
            <Input
              id="event-location"
              placeholder="e.g. Virtual or 123 Main St, City"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date*</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time*</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date*</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time*</Label>
              <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          <Button onClick={generateLinks} className="w-full">
            Generate Calendar Links
          </Button>

          {Object.keys(links).length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Calendar Links</h3>

              {Object.entries(links).map(([key, link]) => (
                <div key={key} className="p-3 bg-muted rounded-md relative">
                  <h4 className="font-medium capitalize mb-1">{key}</h4>
                  <p className="text-xs text-muted-foreground break-all pr-8">{link}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(link)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy to clipboard</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
