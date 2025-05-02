import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CampaignNameGenerator from "@/components/campaign-name-generator"
import CalendarLinkGenerator from "@/components/calendar-link-generator"
import UtmGenerator from "@/components/utm-generator"
import QrCodeGenerator from "@/components/qr-code-generator"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Marketing Toolkit</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
        A collection of tools to help streamline your marketing workflows and campaigns
      </p>

      <Tabs defaultValue="campaign-name" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="campaign-name">Campaign Name</TabsTrigger>
          <TabsTrigger value="calendar-link">Calendar Link</TabsTrigger>
          <TabsTrigger value="utm">UTM Generator</TabsTrigger>
          <TabsTrigger value="qr-code">QR Code</TabsTrigger>
        </TabsList>
        <TabsContent value="campaign-name">
          <CampaignNameGenerator />
        </TabsContent>
        <TabsContent value="calendar-link">
          <CalendarLinkGenerator />
        </TabsContent>
        <TabsContent value="utm">
          <UtmGenerator />
        </TabsContent>
        <TabsContent value="qr-code">
          <QrCodeGenerator />
        </TabsContent>
      </Tabs>
    </main>
  )
}
