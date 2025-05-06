"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Rack } from "@/models/data-center"

interface AddDeviceFormProps {
  rack: Rack
  onCancel: () => void
  onSubmit: () => void
}

export function AddDeviceForm({ rack, onCancel, onSubmit }: AddDeviceFormProps) {
  const [deviceName, setDeviceName] = useState("")
  const [deviceModel, setDeviceModel] = useState("")
  const [startUnit, setStartUnit] = useState("")
  const [deviceSize, setDeviceSize] = useState("1")
  const [ipAddress, setIpAddress] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 在實際應用中，您會驗證並保存設備
    onSubmit()
  }

  // 生成可用的起始單位選項
  const getAvailableStartUnits = () => {
    const availableUnits = []
    for (let i = 1; i <= rack.totalUnits; i++) {
      // 檢查從i開始的deviceSize個單位是否都可用
      let available = true
      for (let j = 0; j < Number.parseInt(deviceSize); j++) {
        if (i + j > rack.totalUnits) {
          available = false
          break
        }
        const unit = rack.units.find((u) => u.position === i + j)
        if (unit && unit.deviceId !== null) {
          available = false
          break
        }
      }
      if (available) {
        availableUnits.push(i)
      }
    }
    return availableUnits
  }

  const availableStartUnits = getAvailableStartUnits()

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Add Device to Rack {rack.name}</DialogTitle>
      </DialogHeader>

      <div className="mt-4 grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deviceName" className="text-right">
            Device Name
          </Label>
          <Input
            id="deviceName"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="col-span-3"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deviceModel" className="text-right">
            Model
          </Label>
          <Input
            id="deviceModel"
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
            className="col-span-3"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deviceSize" className="text-right">
            Device Size
          </Label>
          <Select value={deviceSize} onValueChange={setDeviceSize}>
            <SelectTrigger id="deviceSize" className="col-span-3">
              <SelectValue placeholder="Select device size" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}U
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startUnit" className="text-right">
            Starting Position
          </Label>
          <Select value={startUnit} onValueChange={setStartUnit}>
            <SelectTrigger id="startUnit" className="col-span-3">
              <SelectValue placeholder="Select starting position" />
            </SelectTrigger>
            <SelectContent>
              {availableStartUnits.map((unit) => (
                <SelectItem key={unit} value={unit.toString()}>
                  U{unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="ipAddress" className="text-right">
            IP Address
          </Label>
          <Input
            id="ipAddress"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className="col-span-3"
            placeholder="Optional"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Device</Button>
      </DialogFooter>
    </form>
  )
}
