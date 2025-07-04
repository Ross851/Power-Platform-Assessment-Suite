'use client'

import React from 'react'

interface SpiderChartProps {
  data: {
    label: string
    value: number
    maxValue: number
  }[]
  width?: number
  height?: number
  className?: string
}

export function SpiderChart({ data, width = 400, height = 400, className = '' }: SpiderChartProps) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.35
  const angleStep = (2 * Math.PI) / data.length

  // Calculate points for each data value
  const dataPoints = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2
    const value = (item.value / item.maxValue) * radius
    return {
      x: centerX + value * Math.cos(angle),
      y: centerY + value * Math.sin(angle),
      labelX: centerX + (radius + 30) * Math.cos(angle),
      labelY: centerY + (radius + 30) * Math.sin(angle),
      angle
    }
  })

  // Create path for data polygon
  const dataPath = dataPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ') + ' Z'

  // Create grid lines
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1]
  const gridPaths = gridLevels.map(level => {
    const levelRadius = radius * level
    const points = data.map((_, index) => {
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

  // Create axis lines
  const axisLines = data.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + radius * Math.cos(angle),
      y2: centerY + radius * Math.sin(angle)
    }
  })

  return (
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

      {/* Data polygon */}
      <path
        d={dataPath}
        fill="currentColor"
        fillOpacity="0.3"
        stroke="currentColor"
        strokeWidth="2"
        className="text-blue-600 dark:text-blue-400"
      />

      {/* Data points */}
      {dataPoints.map((point, index) => (
        <circle
          key={`point-${index}`}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="currentColor"
          className="text-blue-600 dark:text-blue-400"
        />
      ))}

      {/* Labels */}
      {data.map((item, index) => {
        const point = dataPoints[index]
        const textAnchor = 
          Math.abs(point.angle) < 0.1 ? 'middle' :
          point.angle > 0 && point.angle < Math.PI ? 'start' : 'end'
        
        const dy = 
          Math.abs(point.angle - Math.PI / 2) < 0.1 ? '0.7em' :
          Math.abs(point.angle + Math.PI / 2) < 0.1 ? '-0.3em' : '0.3em'

        return (
          <g key={`label-${index}`}>
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor={textAnchor}
              dy={dy}
              className="text-sm font-medium fill-gray-700 dark:fill-gray-200"
            >
              {item.label}
            </text>
            <text
              x={point.labelX}
              y={point.labelY + 15}
              textAnchor={textAnchor}
              className="text-xs fill-gray-500 dark:fill-gray-400"
            >
              {item.value}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}