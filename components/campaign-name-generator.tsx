"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const regions = [
  { value: "namer", label: "North America" },
  { value: "emea", label: "Europe" },
  { value: "apac", label: "Asia Pacific" },
  { value: "latam", label: "Latin America" },
  { value: "mea", label: "Middle East & Africa" },
  { value: "global", label: "Global" },
]

const campaignTypes = [
  { value: "email", label: "Email" },
  { value: "social", label: "Social Media" },
  { value: "display", label: "Display" },
  { value: "search", label: "Search" },
  { value: "event", label: "Event" },
  { value: "webinar", label: "Webinar" },
  { value: "content", label: "Content" },
  { value: "pr", label: "PR" },
]

export default function CampaignNameGenerator() {
  const { toast } = useToast()
  const [region, setRegion] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date())
  const [campaignName, setCampaignName] = useState("")

  const generateCampaignName = () => {
    if (!region || !type || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const formattedDate = format(date, "yyyyMMdd")
    const formattedDescription = description.toLowerCase().replace(/\s+/g, "-")
    const name = `${region}_${type}_${formattedDescription}_${formattedDate}`
    setCampaignName(name)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(campaignName)
    toast({
      title: "Copied to clipboard",
      description: "Campaign name has been copied to your clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Name Generator</CardTitle>
        <CardDescription>
          Generate a standardized campaign name using the format: region_type_brief-description_YYYYMMDD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  {campaignTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Brief Description</Label>
            <Input
              id="description"
              placeholder="e.g. summer-sale"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Use short, descriptive words separated by hyphens</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={format(date, "yyyy-MM-dd")}
              onChange={(e) => setDate(new Date(e.target.value))}
            />
          </div>
          <Button onClick={generateCampaignName} className="w-full">
            Generate Campaign Name
          </Button>

          {campaignName && (
            <div className="mt-6 p-4 bg-muted rounded-md relative">
              <p className="font-mono break-all">{campaignName}</p>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
