"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { RackGrid } from "@/components/rack-grid"
import { RackDetailModal } from "@/components/rack-detail-modal"
import { dataCenters } from "@/models/data-center"
import { DataCenterConfigModal } from "@/components/data-center-config-modal"

export default function RackManagement() {
  const [selectedRack, setSelectedRack] = useState<string | null>(null)
  const [isRackModalOpen, setIsRackModalOpen] = useState(false)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [selectedDataCenter, setSelectedDataCenter] = useState(dataCenters[0].id)
  const [selectedRoom, setSelectedRoom] = useState(dataCenters[0].rooms[0].id)

  const handleRackClick = (rackId: string) => {
    setSelectedRack(rackId)
    setIsRackModalOpen(true)
  }

  const currentDataCenter = dataCenters.find((dc) => dc.id === selectedDataCenter)
  const currentRoom = currentDataCenter?.rooms.find((room) => room.id === selectedRoom)

  return (
    <div className="space-y-4 w-full max-w-none">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Rack Management</h1>
        <Button onClick={() => setIsConfigModalOpen(true)} className="gap-2">
          <Settings className="h-4 w-4" />
          Configure Data Center
        </Button>
      </div>

      <Card className="bg-card w-full">
        <CardContent className="p-4">
          <div className="mb-4">
            <Tabs
              defaultValue={selectedDataCenter}
              value={selectedDataCenter}
              onValueChange={(value) => {
                setSelectedDataCenter(value)
                setSelectedRoom(dataCenters.find((dc) => dc.id === value)?.rooms[0].id || "")
              }}
            >
              <TabsList>
                {dataCenters.map((dc) => (
                  <TabsTrigger key={dc.id} value={dc.id}>
                    {dc.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {currentDataCenter && (
            <Tabs defaultValue={selectedRoom} value={selectedRoom} onValueChange={setSelectedRoom}>
              <TabsList>
                {currentDataCenter.rooms.map((room) => (
                  <TabsTrigger key={room.id} value={room.id}>
                    {room.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {currentDataCenter.rooms.map((room) => (
                <TabsContent key={room.id} value={room.id} className="w-full">
                  <RackGrid racks={room.racks} onRackClick={handleRackClick} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      <RackDetailModal
        isOpen={isRackModalOpen}
        onClose={() => setIsRackModalOpen(false)}
        rackId={selectedRack}
        dataCenters={dataCenters}
      />

      <DataCenterConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        dataCenters={dataCenters}
      />
    </div>
  )
}
