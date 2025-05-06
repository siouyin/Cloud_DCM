"use client"

import type { Rack } from "@/models/data-center"
import { cn } from "@/lib/utils"

interface RackVisualizerProps {
  rack: Rack
}

export function RackVisualizer({ rack }: RackVisualizerProps) {
  // Sort units by position (from bottom to top)
  const sortedUnits = [...rack.units].sort((a, b) => a.position - b.position)

  // Group units by device to handle multi-unit devices
  const deviceGroups = sortedUnits.reduce(
    (groups, unit) => {
      if (unit.deviceId) {
        if (!groups[unit.deviceId]) {
          groups[unit.deviceId] = {
            deviceId: unit.deviceId,
            deviceName: unit.deviceName,
            deviceIp: unit.deviceIp,
            serviceId: unit.serviceId,
            serviceName: unit.serviceName,
            positions: [],
            size: unit.deviceSize,
          }
        }
        groups[unit.deviceId].positions.push(unit.position)
      }
      return groups
    },
    {} as Record<
      string,
      {
        deviceId: string
        deviceName: string | null
        deviceIp: string | null
        serviceId: string | null
        serviceName: string | null
        positions: number[]
        size: number
      }
    >,
  )

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-sm text-muted-foreground">Rack View (Bottom to Top)</div>

      <div className="w-full max-w-md border border-border rounded-md overflow-hidden">
        <div className="bg-muted p-2 text-center font-medium border-b border-border">
          {rack.name} - {rack.totalUnits}U
        </div>

        <div className="flex">
          {/* Unit position column */}
          <div className="w-10 bg-muted border-r border-border">
            {sortedUnits.map((unit) => (
              <div
                key={`pos-${unit.position}`}
                className="h-10 flex items-center justify-center text-xs font-medium border-b border-border"
              >
                {unit.position}
              </div>
            ))}
          </div>

          {/* Device column */}
          <div className="flex-1">
            {sortedUnits.map((unit, index) => {
              // If this unit is part of a multi-unit device but not the first unit, skip it
              if (
                unit.deviceId &&
                deviceGroups[unit.deviceId] &&
                unit.position !== Math.min(...deviceGroups[unit.deviceId].positions)
              ) {
                return null
              }

              // Calculate device size
              const deviceSize = unit.deviceId ? deviceGroups[unit.deviceId].size : 1

              return (
                <div
                  key={`unit-${unit.position}`}
                  className={cn("border-b border-border relative", unit.deviceId ? "bg-blue-900/30" : "bg-card", {
                    "h-10": deviceSize === 1,
                  })}
                  style={{ height: deviceSize > 1 ? `${deviceSize * 40}px` : undefined }}
                >
                  {unit.deviceId ? (
                    <div className="h-full p-2 flex flex-col justify-center">
                      <div className="font-medium text-sm truncate">{unit.deviceName}</div>
                      {unit.deviceIp && (
                        <div className="text-xs text-muted-foreground truncate">IP: {unit.deviceIp}</div>
                      )}
                      {unit.serviceName && (
                        <div className="text-xs text-blue-300 truncate">Service: {unit.serviceName}</div>
                      )}
                      {deviceSize > 1 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {deviceSize}U (U{Math.min(...deviceGroups[unit.deviceId].positions)} - U
                          {Math.max(...deviceGroups[unit.deviceId].positions)})
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Empty</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
