"use client"

import { Card } from "@/components/ui/card"
import type { Rack } from "@/models/data-center"

interface RackGridProps {
  racks: Rack[]
  onRackClick: (rackId: string) => void
}

export function RackGrid({ racks, onRackClick }: RackGridProps) {
  // 計算機架使用率
  const calculateUsage = (rack: Rack) => {
    const usedUnits = rack.units.filter((unit) => unit.deviceId !== null).length
    return Math.floor((usedUnits / rack.totalUnits) * 100)
  }

  // 確定機架狀態顏色
  const getRackStatusColor = (usage: number) => {
    if (usage > 80) return "bg-red-500" // 已滿
    if (usage > 40) return "bg-yellow-500" // 部分使用
    return "bg-green-500" // 可用
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 w-full">
      {racks.map((rack) => {
        const usage = calculateUsage(rack)
        const statusColor = getRackStatusColor(usage)

        return (
          <Card
            key={rack.id}
            className="flex h-32 cursor-pointer flex-col items-center justify-center p-4 transition-all hover:shadow-md hover:bg-accent bg-[hsl(224,50%,18%)]"
            onClick={() => onRackClick(rack.id)}
          >
            <div className={`mb-2 h-3 w-3 rounded-full ${statusColor}`}></div>
            <div className="text-lg font-bold">{rack.name}</div>
            <div className="text-sm text-muted-foreground">{usage}% Used</div>
            <div className="text-xs text-muted-foreground">{rack.totalUnits}U Total</div>
          </Card>
        )
      })}
    </div>
  )
}
