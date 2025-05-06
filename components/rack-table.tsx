"use client"

import type { Rack } from "@/models/data-center"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RackTableProps {
  rack: Rack
}

export function RackTable({ rack }: RackTableProps) {
  // 獲取所有已安裝的設備
  const installedDevices = rack.units
    .filter((unit) => unit.deviceId !== null)
    // 去重複
    .filter((unit, index, self) => index === self.findIndex((u) => u.deviceId === unit.deviceId))
    // 排序
    .sort((a, b) => a.position - b.position)

  return (
    <div className="rounded-md border bg-[hsl(224,50%,18%)] w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit Position</TableHead>
            <TableHead>Device Name</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Units Occupied</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installedDevices.length > 0 ? (
            installedDevices.map((device) => (
              <TableRow key={device.deviceId}>
                <TableCell>U{device.position}</TableCell>
                <TableCell>{device.deviceName}</TableCell>
                <TableCell>{device.deviceIp || "-"}</TableCell>
                <TableCell>{device.deviceSize}U</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No devices installed in this rack
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
