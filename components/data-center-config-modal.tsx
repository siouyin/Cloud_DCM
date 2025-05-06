"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DataCenter } from "@/models/data-center"
import { Plus, Trash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataCenterConfigModalProps {
  isOpen: boolean
  onClose: () => void
  dataCenters: DataCenter[]
}

export function DataCenterConfigModal({ isOpen, onClose, dataCenters }: DataCenterConfigModalProps) {
  const [activeTab, setActiveTab] = useState("dc")
  const [newDcName, setNewDcName] = useState("")
  const [newRoomName, setNewRoomName] = useState("")
  const [selectedDc, setSelectedDc] = useState(dataCenters[0]?.id || "")
  const [newRackName, setNewRackName] = useState("")
  const [newRackUnits, setNewRackUnits] = useState("42")
  const [selectedRoom, setSelectedRoom] = useState("")

  // 當選擇的數據中心改變時，更新選擇的房間
  const handleDcChange = (dcId: string) => {
    setSelectedDc(dcId)
    const dc = dataCenters.find((dc) => dc.id === dcId)
    if (dc && dc.rooms.length > 0) {
      setSelectedRoom(dc.rooms[0].id)
    } else {
      setSelectedRoom("")
    }
  }

  const currentDc = dataCenters.find((dc) => dc.id === selectedDc)

  const handleSave = () => {
    // 在實際應用中，您會保存配置更改
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Data Center Configuration</DialogTitle>
          <DialogDescription>Manage data centers, rooms, and racks configuration</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dc">Data Centers</TabsTrigger>
            <TabsTrigger value="room">Rooms</TabsTrigger>
            <TabsTrigger value="rack">Racks</TabsTrigger>
          </TabsList>

          <TabsContent value="dc">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newDcName" className="text-right">
                  New Data Center Name
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="newDcName"
                    value={newDcName}
                    onChange={(e) => setNewDcName(e.target.value)}
                    placeholder="Enter data center name"
                  />
                  <Button type="button" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Existing Data Centers</h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {dataCenters.map((dc) => (
                    <Card key={dc.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex justify-between items-center">
                          {dc.name}
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {dc.rooms.length} Rooms, {dc.rooms.reduce((acc, room) => acc + room.racks.length, 0)} Racks
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="room">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dcForRoom" className="text-right">
                  Select Data Center
                </Label>
                <Select value={selectedDc} onValueChange={handleDcChange}>
                  <SelectTrigger id="dcForRoom" className="col-span-3">
                    <SelectValue placeholder="Select data center" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataCenters.map((dc) => (
                      <SelectItem key={dc.id} value={dc.id}>
                        {dc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newRoomName" className="text-right">
                  New Room Name
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="newRoomName"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter room name"
                    disabled={!selectedDc}
                  />
                  <Button type="button" size="sm" disabled={!selectedDc || !newRoomName}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>

              {currentDc && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Existing Rooms ({currentDc.name})</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {currentDc.rooms.map((room) => (
                      <Card key={room.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between items-center">
                            {room.name}
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{room.racks.length} Racks</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rack">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dcForRack" className="text-right">
                  Select Data Center
                </Label>
                <Select value={selectedDc} onValueChange={handleDcChange}>
                  <SelectTrigger id="dcForRack" className="col-span-3">
                    <SelectValue placeholder="Select data center" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataCenters.map((dc) => (
                      <SelectItem key={dc.id} value={dc.id}>
                        {dc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomForRack" className="text-right">
                  Select Room
                </Label>
                <Select
                  value={selectedRoom}
                  onValueChange={setSelectedRoom}
                  disabled={!selectedDc || !currentDc?.rooms.length}
                >
                  <SelectTrigger id="roomForRack" className="col-span-3">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentDc?.rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newRackName" className="text-right">
                  New Rack Name
                </Label>
                <Input
                  id="newRackName"
                  value={newRackName}
                  onChange={(e) => setNewRackName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter rack name"
                  disabled={!selectedRoom}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newRackUnits" className="text-right">
                  Rack Units
                </Label>
                <Select value={newRackUnits} onValueChange={setNewRackUnits} disabled={!selectedRoom}>
                  <SelectTrigger id="newRackUnits" className="col-span-3">
                    <SelectValue placeholder="Select unit count" />
                  </SelectTrigger>
                  <SelectContent>
                    {[24, 42, 48].map((units) => (
                      <SelectItem key={units} value={units.toString()}>
                        {units}U
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button type="button" disabled={!selectedRoom || !newRackName}>
                  <Plus className="h-4 w-4 mr-1" /> Add Rack
                </Button>
              </div>

              {selectedRoom && currentDc && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">
                    Existing Racks ({currentDc.name} &gt; {currentDc.rooms.find((r) => r.id === selectedRoom)?.name})
                  </h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {currentDc.rooms
                      .find((r) => r.id === selectedRoom)
                      ?.racks.map((rack) => (
                        <Card key={rack.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex justify-between items-center">
                              {rack.name}
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{rack.totalUnits}U Total Capacity</p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
