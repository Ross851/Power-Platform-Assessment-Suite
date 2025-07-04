'use client'

import React from 'react'
import { Card, Badge, Progress, Tooltip } from 'flowbite-react'
import dynamic from 'next/dynamic'
import { 
  HiTrendingUp, 
  HiTrendingDown, 
  HiArrowRight,
  HiCheckCircle,
  HiExclamation,
  HiXCircle,
  HiInformationCircle,
  HiSparkles,
  HiLightBulb,
  HiChartBar,
  HiShieldCheck
} from 'react-icons/hi'
import { PowerPlatformIcons, iconColors } from '@/lib/icon-system'
import { cn } from '@/lib/utils'

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface ScoreBreakdown {
  label: string
  value: number
  category?: string
  description?: string
}

interface VisualScoreCardProps {
  category: string
  score: number
  breakdown: ScoreBreakdown[]
  trend?: 'up' | 'down' | 'stable'
  previousScore?: number
  target?: number
  recommendations?: string[]
  icon?: React.ElementType
}

export function VisualScoreCard({ 
  category, 
  score, 
  breakdown,
  trend = 'stable',
  previousScore,
  target = 80,
  recommendations = [],
  icon: Icon
}: VisualScoreCardProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981' // green
    if (score >= 60) return '#3b82f6' // blue
    if (score >= 40) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'info'
    if (score >= 40) return 'warning'
    return 'failure'
  }

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const getProgressColor = (value: number): string => {
    if (value >= 80) return 'green'
    if (value >= 60) return 'blue'
    if (value >= 40) return 'yellow'
    return 'red'
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <HiTrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <HiTrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <HiArrowRight className="w-4 h-4 text-gray-600" />
    }
  }

  const getCategoryIcon = () => {
    if (Icon) return <Icon className="w-5 h-5" />
    
    const iconMap: Record<string, React.ElementType> = {
      'Power Apps': PowerPlatformIcons.powerApps.main,
      'Power Automate': PowerPlatformIcons.powerAutomate.main,
      'Power Pages': PowerPlatformIcons.powerPages.main,
      'Power BI': PowerPlatformIcons.powerBI.main,
      'Security': HiShieldCheck,
      'Governance': HiChartBar,
      'Performance': HiTrendingUp,
      'Compliance': HiCheckCircle
    }
    
    const CategoryIcon = iconMap[category] || HiChartBar
    return <CategoryIcon className="w-5 h-5" />
  }

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e5e7eb',
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 0.1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: '2rem',
            fontWeight: 600,
            color: getScoreColor(score),
            formatter: function (val) {
              return Math.round(Number(val)) + '%'
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [getScoreColor(score)],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    colors: [getScoreColor(score)],
    series: [score]
  }

  const miniChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      sparkline: { enabled: true }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
        distributed: true
      }
    },
    colors: breakdown.map(item => getScoreColor(item.value)),
    series: [{
      data: breakdown.map(item => item.value)
    }],
    tooltip: {
      enabled: true,
      y: {
        formatter: (val, { dataPointIndex }) => {
          return `${breakdown[dataPointIndex].label}: ${val}%`
        }
      }
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg",
            score >= 80 && "bg-green-100 text-green-600 dark:bg-green-900/20",
            score >= 60 && score < 80 && "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
            score >= 40 && score < 60 && "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20",
            score < 40 && "bg-red-100 text-red-600 dark:bg-red-900/20"
          )}>
            {getCategoryIcon()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {category}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Score: {score}%</span>
              {previousScore !== undefined && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon()}
                    <span className={cn(
                      trend === 'up' && "text-green-600",
                      trend === 'down' && "text-red-600"
                    )}>
                      {Math.abs(score - previousScore)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <Badge color={getScoreBadgeColor(score)} size="sm">
          {getScoreLabel(score)}
        </Badge>
      </div>
      
      {/* Radial Chart */}
      <div className="flex items-center justify-center my-6">
        <div className="relative">
          <ApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="radialBar"
            height={200}
            width={200}
          />
          {target && (
            <div className="absolute bottom-0 left-0 right-0 text-center">
              <p className="text-xs text-gray-500">Target: {target}%</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Score Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Score Breakdown
        </h4>
        {breakdown.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <Tooltip content={item.description || ''}>
                <span className="text-sm text-gray-600 dark:text-gray-400 cursor-help">
                  {item.label}
                </span>
              </Tooltip>
              <span className="text-sm font-medium">{item.value}%</span>
            </div>
            <Progress
              progress={item.value}
              size="sm"
              color={getProgressColor(item.value)}
            />
          </div>
        ))}
      </div>

      {/* Mini Bar Chart for Breakdown */}
      {breakdown.length > 3 && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Visual Distribution
          </h4>
          <ApexChart
            options={miniChartOptions}
            series={miniChartOptions.series}
            type="bar"
            height={100}
          />
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-3">
            <HiSparkles className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              AI Recommendations
            </h4>
          </div>
          <ul className="space-y-2">
            {recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <HiLightBulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {rec}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status Indicators */}
      <div className="mt-4 pt-4 border-t dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs">
          {score >= target ? (
            <div className="flex items-center space-x-1 text-green-600">
              <HiCheckCircle className="w-4 h-4" />
              <span>Target Met</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-amber-600">
              <HiExclamation className="w-4 h-4" />
              <span>{target - score}% to Target</span>
            </div>
          )}
        </div>
        
        <Tooltip content="View detailed report">
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            View Details →
          </button>
        </Tooltip>
      </div>
    </Card>
  )
}