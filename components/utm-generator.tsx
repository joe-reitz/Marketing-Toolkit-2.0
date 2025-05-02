"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const utmSources = [
  "google",
  "facebook",
  "twitter",
  "linkedin",
  "instagram",
  "youtube",
  "email",
  "newsletter",
  "direct",
  "referral",
  "other",
]

const utmMediums = ["cpc", "organic", "social", "email", "display", "affiliate", "referral", "video", "banner", "other"]

export default function UtmGenerator() {
  const { toast } = useToast()
  const [baseUrl, setBaseUrl] = useState("")
  const [utmSource, setUtmSource] = useState("")
  const [utmMedium, setUtmMedium] = useState("")
  const [utmCampaign, setUtmCampaign] = useState("")
  const [utmTerm, setUtmTerm] = useState("")
  const [utmContent, setUtmContent] = useState("")
  const [generatedUrl, setGeneratedUrl] = useState("")

  const generateUtmUrl = () => {
    if (!baseUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a base URL",
        variant: "destructive",
      })
      return
    }

    try {
      // Validate URL
      new URL(baseUrl)

      // Build UTM parameters
      const params = new URLSearchParams()

      if (utmSource) params.append("utm_source", utmSource)
      if (utmMedium) params.append("utm_medium", utmMedium)
      if (utmCampaign) params.append("utm_campaign", utmCampaign)
      if (utmTerm) params.append("utm_term", utmTerm)
      if (utmContent) params.append("utm_content", utmContent)

      // Check if the base URL already has query parameters
      const url = new URL(baseUrl)
      const existingParams = url.search ? url.search + "&" : "?"

      // Only add the ? if we have UTM parameters
      const utmParams = params.toString()
      const queryString = utmParams ? (existingParams === "?" ? "?" + utmParams : existingParams + utmParams) : ""

      setGeneratedUrl(url.origin + url.pathname + queryString + url.hash)
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl)
    toast({
      title: "Copied to clipboard",
      description: "UTM URL has been copied to your clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>UTM Parameter Generator</CardTitle>
        <CardDescription>Create trackable links by adding UTM parameters to your URLs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="base-url">Base URL*</Label>
            <Input
              id="base-url"
              placeholder="https://example.com/landing-page"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Include the full URL with http:// or https://</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utm-source">UTM Source</Label>
              <Select value={utmSource} onValueChange={setUtmSource}>
                <SelectTrigger id="utm-source">
                  <SelectValue placeholder="Select or enter source" />
                </SelectTrigger>
                <SelectContent>
                  {utmSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">The referrer (e.g., google, newsletter)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="utm-medium">UTM Medium</Label>
              <Select value={utmMedium} onValueChange={setUtmMedium}>
                <SelectTrigger id="utm-medium">
                  <SelectValue placeholder="Select or enter medium" />
                </SelectTrigger>
                <SelectContent>
                  {utmMediums.map((medium) => (
                    <SelectItem key={medium} value={medium}>
                      {medium}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Marketing medium (e.g., cpc, banner, email)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="utm-campaign">UTM Campaign</Label>
            <Input
              id="utm-campaign"
              placeholder="e.g. spring_sale"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">The campaign name, slogan, or promotion code</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utm-term">UTM Term</Label>
              <Input
                id="utm-term"
                placeholder="e.g. marketing+tools"
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Identify paid search keywords</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="utm-content">UTM Content</Label>
              <Input
                id="utm-content"
                placeholder="e.g. logolink or textlink"
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Used to differentiate similar content or links</p>
            </div>
          </div>

          <Button onClick={generateUtmUrl} className="w-full">
            Generate UTM URL
          </Button>

          {generatedUrl && (
            <div className="mt-6 p-4 bg-muted rounded-md relative">
              <p className="font-mono text-sm break-all pr-8">{generatedUrl}</p>
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
