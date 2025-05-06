"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AddDeviceForm } from "@/components/add-device-form"
import type { DataCenter, Rack } from "@/models/data-center"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RackVisualizer } from "@/components/rack-visualizer"
import { RackTable } from "@/components/rack-table"

interface RackDetailModalProps {
  isOpen: boolean
  onClose: () => void
  rackId: string | null
  dataCenters: DataCenter[]
}

export function RackDetailModal({ isOpen, onClose, rackId, dataCenters }: RackDetailModalProps) {
  const [showAddDevice, setShowAddDevice] = useState(false)
  const [activeView, setActiveView] = useState<"visual" | "table" | "stats">("visual")

  // Find the selected rack
  const findRack = (): Rack | null => {
    if (!rackId) return null

    for (const dc of dataCenters) {
      for (const room of dc.rooms) {
        const rack = room.racks.find((r) => r.id === rackId)
        if (rack) {
          return rack
        }
      }
    }
    return null
  }

  const rack = findRack()

  // Find the rack's location (data center and room)
  const findLocation = (): { dcName: string; roomName: string } | null => {
    if (!rackId) return null

    for (const dc of dataCenters) {
      for (const room of dc.rooms) {
        const rack = room.racks.find((r) => r.id === rackId)
        if (rack) {
          return { dcName: dc.name, roomName: room.name }
        }
      }
    }
    return null
  }

  const location = findLocation()

  if (!rack || !location) return null

  // Calculate rack usage statistics
  const usedUnits = rack.units.filter((unit) => unit.deviceId !== null).length
  const usagePercentage = Math.floor((usedUnits / rack.totalUnits) * 100)
  const availableUnits = rack.totalUnits - usedUnits

  // Count unique devices
  const uniqueDevices = new Set(rack.units.filter((unit) => unit.deviceId !== null).map((unit) => unit.deviceId))
  const deviceCount = uniqueDevices.size

  // Count unique services
  const uniqueServices = new Set(rack.units.filter((unit) => unit.serviceId !== null).map((unit) => unit.serviceId))
  const serviceCount = uniqueServices.size

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          setShowAddDevice(false)
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        {!showAddDevice ? (
          <>
            <DialogHeader>
              <DialogTitle>{rack.name}</DialogTitle>
              <DialogDescription>
                Location: {location.dcName} &gt; {location.roomName} | Capacity: {rack.totalUnits}U
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue={activeView} onValueChange={(v) => setActiveView(v as "visual" | "table" | "stats")}>
              <TabsList className="mb-4">
                <TabsTrigger value="visual">Visual View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="visual">
                <RackVisualizer rack={rack} />
              </TabsContent>

              <TabsContent value="table">
                <RackTable rack={rack} />
              </TabsContent>

              <TabsContent value="stats">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground">Usage</div>
                      <div className="text-2xl font-bold">{usagePercentage}%</div>
                      <div className="text-xs text-muted-foreground">
                        {usedUnits} of {rack.totalUnits} units
                      </div>
                      <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${usagePercentage > 80 ? "bg-red-500" : usagePercentage > 40 ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${usagePercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-card p-4 rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground">Available Space</div>
                      <div className="text-2xl font-bold">{availableUnits}U</div>
                      <div className="text-xs text-muted-foreground">Free units</div>
                    </div>

                    <div className="bg-card p-4 rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground">Devices</div>
                      <div className="text-2xl font-bold">{deviceCount}</div>
                      <div className="text-xs text-muted-foreground">Installed devices</div>
                    </div>

                    <div className="bg-card p-4 rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground">Services</div>
                      <div className="text-2xl font-bold">{serviceCount}</div>
                      <div className="text-xs text-muted-foreground">Running services</div>
                    </div>
                  </div>

                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h3 className="text-sm font-medium mb-2">Device Distribution</h3>
                    <div className="space-y-2">
                      {Array.from(uniqueDevices).map((deviceId) => {
                        const device = rack.units.find((unit) => unit.deviceId === deviceId)
                        if (!device) return null

                        const deviceUnits = rack.units.filter((unit) => unit.deviceId === deviceId).length
                        const devicePercentage = Math.floor((deviceUnits / rack.totalUnits) * 100)

                        return (
                          <div key={deviceId as string} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{device.deviceName}</span>
                              <span>
                                {deviceUnits}U ({devicePercentage}%)
                              </span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${devicePercentage}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {serviceCount > 0 && (
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <h3 className="text-sm font-medium mb-2">Service Distribution</h3>
                      <div className="space-y-2">
                        {Array.from(uniqueServices).map((serviceId) => {
                          const service = rack.units.find((unit) => unit.serviceId === serviceId)
                          if (!service) return null

                          const serviceUnits = rack.units.filter((unit) => unit.serviceId === serviceId).length
                          const servicePercentage = Math.floor((serviceUnits / rack.totalUnits) * 100)

                          return (
                            <div key={serviceId as string} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{service.serviceName}</span>
                                <span>
                                  {serviceUnits}U ({servicePercentage}%)
                                </span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: `${servicePercentage}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2 sm:justify-start">
              <Button onClick={() => setShowAddDevice(true)} className="gap-1">
                <Plus className="h-4 w-4" /> Add Device
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <AddDeviceForm
            rack={rack}
            onCancel={() => setShowAddDevice(false)}
            onSubmit={() => {
              setShowAddDevice(false)
              // In a real app, you would add the device to the rack here
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
