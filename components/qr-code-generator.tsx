"use client"

import { useState, useRef } from "react"
import { Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function QrCodeGenerator() {
  const { toast } = useToast()
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [contentType, setContentType] = useState("url")
  const [qrSize, setQrSize] = useState("200")
  const [qrColor, setQrColor] = useState("#000000")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const qrRef = useRef<HTMLImageElement>(null)

  const generateQrCode = () => {
    const content = contentType === "url" ? url : text

    if (!content) {
      toast({
        title: "Missing content",
        description: `Please enter a ${contentType === "url" ? "URL" : "text"}`,
        variant: "destructive",
      })
      return
    }

    // Using Google Charts API to generate QR code
    const encodedContent = encodeURIComponent(content)
    const colorParam = qrColor !== "#000000" ? `&chco=${qrColor.substring(1)}` : ""
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${qrSize}x${qrSize}&chl=${encodedContent}${colorParam}`

    setQrCodeUrl(qrUrl)
  }

  const downloadQrCode = () => {
    if (qrRef.current) {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      if (context) {
        const img = qrRef.current
        canvas.width = img.width
        canvas.height = img.height

        context.drawImage(img, 0, 0, img.width, img.height)

        const link = document.createElement("a")
        link.download = "qrcode.png"
        link.href = canvas.toDataURL("image/png")
        link.click()

        toast({
          title: "QR Code downloaded",
          description: "Your QR code has been downloaded as a PNG file",
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Create QR codes for URLs or text content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <Tabs value={contentType} onValueChange={setContentType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">URL</Label>
                <Input
                  id="url-input"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="text" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text Content</Label>
                <Input
                  id="text-input"
                  placeholder="Enter text content for QR code"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qr-size">QR Code Size</Label>
              <Select value={qrSize} onValueChange={setQrSize}>
                <SelectTrigger id="qr-size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">Small (100x100)</SelectItem>
                  <SelectItem value="200">Medium (200x200)</SelectItem>
                  <SelectItem value="300">Large (300x300)</SelectItem>
                  <SelectItem value="500">Extra Large (500x500)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qr-color">QR Code Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="qr-color"
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>

          <Button onClick={generateQrCode} className="w-full">
            Generate QR Code
          </Button>

          {qrCodeUrl && (
            <div className="mt-6 flex flex-col items-center">
              <div className="p-4 bg-white rounded-md">
                <img ref={qrRef} src={qrCodeUrl || "/placeholder.svg"} alt="Generated QR Code" className="mx-auto" />
              </div>
              <Button variant="outline" className="mt-4" onClick={downloadQrCode}>
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
