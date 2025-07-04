'use client'

import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DataSeries {
  name: string
  data: number[]
  color: string
  fillOpacity?: number
  strokeWidth?: number
  strokeDasharray?: string
}

interface EnhancedSpiderChartProps {
  labels: string[]
  series: DataSeries[]
  maxValue?: number
  width?: number
  height?: number
  className?: string
  showLegend?: boolean
  microsoftLevels?: {
    basic: number
    intermediate: number
    advanced: number
  }
}

export function EnhancedSpiderChart({ 
  labels, 
  series, 
  maxValue = 100,
  width = 400, 
  height = 400, 
  className = '',
  showLegend = true,
  microsoftLevels
}: EnhancedSpiderChartProps) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.35
  const angleStep = (2 * Math.PI) / labels.length

  // Calculate points for each series
  const seriesPoints = series.map(serie => {
    return serie.data.map((value, index) => {
      const angle = index * angleStep - Math.PI / 2
      const normalizedValue = (value / maxValue) * radius
      return {
        x: centerX + normalizedValue * Math.cos(angle),
        y: centerY + normalizedValue * Math.sin(angle),
        value,
        angle
      }
    })
  })

  // Create path for each series
  const seriesPaths = seriesPoints.map(points => {
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z'
  })

  // Create grid lines
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1]
  const gridPaths = gridLevels.map(level => {
    const levelRadius = radius * level
    const points = labels.map((_, index) => {
      const angle = index * angleStep - Math.PI / 2
      return {
        x: centerX + levelRadius * Math.cos(angle),
        y: centerY + levelRadius * Math.sin(angle)
      }
    })
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z'
  })

  // Microsoft maturity level circles (if provided)
  const maturityLevelPaths = microsoftLevels ? [
    { level: microsoftLevels.basic / maxValue, label: 'Basic', color: 'text-orange-400' },
    { level: microsoftLevels.intermediate / maxValue, label: 'Intermediate', color: 'text-yellow-400' },
    { level: microsoftLevels.advanced / maxValue, label: 'Advanced', color: 'text-green-400' }
  ].map(({ level }) => {
    const levelRadius = radius * level
    const points = labels.map((_, index) => {
      const angle = index * angleStep - Math.PI / 2
      return {
        x: centerX + levelRadius * Math.cos(angle),
        y: centerY + levelRadius * Math.sin(angle)
      }
    })
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z'
  }) : []

  // Create axis lines
  const axisLines = labels.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + radius * Math.cos(angle),
      y2: centerY + radius * Math.sin(angle),
      labelX: centerX + (radius + 30) * Math.cos(angle),
      labelY: centerY + (radius + 30) * Math.sin(angle),
      angle
    }
  })

  // Calculate gap closure area (between baseline and current)
  const baselineIndex = series.findIndex(s => s.name.toLowerCase().includes('baseline'))
  const currentIndex = series.findIndex(s => s.name.toLowerCase().includes('current'))
  
  let gapClosurePath = ''
  if (baselineIndex !== -1 && currentIndex !== -1) {
    const baselinePoints = seriesPoints[baselineIndex]
    const currentPoints = seriesPoints[currentIndex]
    
    // Create path that fills the area between baseline and current
    gapClosurePath = baselinePoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' ' +
      currentPoints
        .slice()
        .reverse()
        .map((point, index) => `L ${point.x} ${point.y}`)
        .join(' ') + ' Z'
  }

  return (
    <TooltipProvider>
      <div className="relative">
        <svg width={width} height={height} className={className}>
          {/* Grid circles */}
          {gridPaths.map((path, index) => (
            <path
              key={`grid-${index}`}
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-200 dark:text-gray-700"
            />
          ))}

          {/* Microsoft maturity level indicators */}
          {microsoftLevels && maturityLevelPaths.map((path, index) => {
            const levels = [
              { level: microsoftLevels.basic, label: 'Basic', color: 'rgb(251 146 60)' },
              { level: microsoftLevels.intermediate, label: 'Intermediate', color: 'rgb(250 204 21)' },
              { level: microsoftLevels.advanced, label: 'Advanced', color: 'rgb(74 222 128)' }
            ]
            return (
              <path
                key={`maturity-${index}`}
                d={path}
                fill="none"
                stroke={levels[index].color}
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.5"
              />
            )
          })}

          {/* Grid labels */}
          {gridLevels.map((level, index) => (
            <text
              key={`grid-label-${index}`}
              x={centerX + 5}
              y={centerY - radius * level}
              className="text-xs fill-gray-500 dark:fill-gray-400"
            >
              {Math.round(level * 100)}%
            </text>
          ))}

          {/* Axis lines */}
          {axisLines.map((line, index) => (
            <line
              key={`axis-${index}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-300 dark:text-gray-600"
            />
          ))}

          {/* Gap closure area (filled area between baseline and current) */}
          {gapClosurePath && (
            <path
              d={gapClosurePath}
              fill="url(#gapGradient)"
              fillOpacity="0.2"
            />
          )}

          {/* Data polygons for each series */}
          {series.map((serie, serieIndex) => (
            <g key={`serie-${serieIndex}`}>
              <path
                d={seriesPaths[serieIndex]}
                fill={serie.color}
                fillOpacity={serie.fillOpacity || 0.1}
                stroke={serie.color}
                strokeWidth={serie.strokeWidth || 2}
                strokeDasharray={serie.strokeDasharray}
              />
              
              {/* Data points with tooltips */}
              {seriesPoints[serieIndex].map((point, pointIndex) => (
                <Tooltip key={`point-${serieIndex}-${pointIndex}`}>
                  <TooltipTrigger asChild>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill={serie.color}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-7 transition-all"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-semibold">{labels[pointIndex]}</p>
                      <p>{serie.name}: {point.value}%</p>
                      {baselineIndex !== -1 && currentIndex !== -1 && serieIndex === currentIndex && (
                        <p className="text-green-600">
                          Gap Closed: {(point.value - seriesPoints[baselineIndex][pointIndex].value).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </g>
          ))}

          {/* Labels */}
          {labels.map((label, index) => {
            const line = axisLines[index]
            const textAnchor = 
              Math.abs(line.angle) < 0.1 ? 'middle' :
              line.angle > 0 && line.angle < Math.PI ? 'start' : 'end'
            
            const dy = 
              Math.abs(line.angle - Math.PI / 2) < 0.1 ? '0.7em' :
              Math.abs(line.angle + Math.PI / 2) < 0.1 ? '-0.3em' : '0.3em'

            return (
              <text
                key={`label-${index}`}
                x={line.labelX}
                y={line.labelY}
                textAnchor={textAnchor}
                dy={dy}
                className="text-sm font-medium fill-gray-700 dark:fill-gray-200"
              >
                {label}
              </text>
            )
          })}

          {/* Gradient definition for gap closure */}
          <defs>
            <linearGradient id="gapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(34 197 94)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(34 197 94)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {series.map((serie, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ 
                    backgroundColor: serie.color,
                    opacity: serie.fillOpacity || 0.8
                  }}
                />
                <span className="text-sm">{serie.name}</span>
              </div>
            ))}
            {microsoftLevels && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-orange-400" style={{ borderTop: '2px dashed' }} />
                  <span className="text-sm">Basic ({microsoftLevels.basic}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-yellow-400" style={{ borderTop: '2px dashed' }} />
                  <span className="text-sm">Intermediate ({microsoftLevels.intermediate}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-green-400" style={{ borderTop: '2px dashed' }} />
                  <span className="text-sm">Advanced ({microsoftLevels.advanced}%)</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}