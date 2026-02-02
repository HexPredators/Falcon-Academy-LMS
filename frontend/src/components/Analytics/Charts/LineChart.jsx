import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus, Target, Zap } from 'lucide-react';

const LineChart = ({ data, xKey, yKey, color = 'blue', title, height = 300, smooth = true, showPoints = true }) => {
  const { t } = useTranslation();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500">{t('analytics.noData')}</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item[yKey]));
  const minValue = Math.min(...data.map(item => item[yKey]));
  const avgValue = data.reduce((sum, item) => sum + item[yKey], 0) / data.length;

  const calculatePath = () => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((item[yKey] - minValue) / (maxValue - minValue || 1)) * 100;
      return { x, y, value: item[yKey], label: item[xKey] };
    });

    if (smooth && points.length > 2) {
      let path = `M ${points[0].x}% ${points[0].y}% `;
      
      for (let i = 0; i < points.length - 1; i++) {
        const xMid = (points[i].x + points[i + 1].x) / 2;
        const yMid = (points[i].y + points[i + 1].y) / 2;
        
        path += `Q ${points[i].x}% ${points[i].y}% ${xMid}% ${yMid}% `;
        
        if (i < points.length - 2) {
          path += `Q ${points[i + 1].x}% ${points[i + 1].y}% ${points[i + 1].x}% ${points[i + 1].y}% `;
        } else {
          path += `Q ${points[i].x}% ${points[i].y}% ${points[i + 1].x}% ${points[i + 1].y}% `;
        }
      }
      
      return path;
    } else {
      return points.map((point, index) => 
        `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
      ).join(' ');
    }
  };

  const getTrend = () => {
    const firstValue = data[0][yKey];
    const lastValue = data[data.length - 1][yKey];
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    if (change > 5) return { icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-600', label: t('analytics.increasing') };
    if (change < -5) return { icon: <TrendingDown className="w-4 h-4" />, color: 'text-red-600', label: t('analytics.decreasing') };
    return { icon: <Minus className="w-4 h-4" />, color: 'text-yellow-600', label: t('analytics.stable') };
  };

  const trend = getTrend();

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1 ${trend.color}`}>
              {trend.icon}
              <span className="text-sm font-medium">{trend.label}</span>
            </div>
            <div className="text-sm text-gray-600">
              {t('analytics.change')}: <span className={`font-bold ${trend.color}`}>
                {(((data[data.length - 1][yKey] - data[0][yKey]) / data[0][yKey]) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="relative" style={{ height }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
          {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, minValue].map((value, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>{Math.round(value)}</span>
              <div className="w-8 border-t border-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((_, index) => (
              <div key={index} className="border-t border-gray-100"></div>
            ))}
          </div>

          {/* Average line */}
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-gray-300"
            style={{ top: `${100 - ((avgValue - minValue) / (maxValue - minValue || 1)) * 100}%` }}
          >
            <div className="absolute -left-12 -translate-y-1/2 bg-gray-100 px-2 py-1 rounded text-xs">
              {t('analytics.avg')}: {avgValue.toFixed(1)}
            </div>
          </div>

          {/* Line chart */}
          <div className="relative h-full w-full">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Gradient fill */}
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Filled area */}
              <path
                d={`${calculatePath()} L 100% 100% L 0% 100% Z`}
                fill={`url(#gradient-${color})`}
                className={`text-${color}-500`}
              />

              {/* Line */}
              <path
                d={calculatePath()}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-${color}-600`}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {showPoints && data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((item[yKey] - minValue) / (maxValue - minValue || 1)) * 100;
                
                return (
                  <g key={index}>
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="3"
                      fill="white"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`text-${color}-600 cursor-pointer transition-all ${
                        hoveredPoint === index ? 'r-4' : ''
                      }`}
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    
                    {/* Hover tooltip */}
                    {hoveredPoint === index && (
                      <g>
                        <circle
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="6"
                          fill="currentColor"
                          className={`text-${color}-600 opacity-50`}
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover tooltip */}
            {hoveredPoint !== null && (
              <div
                className="absolute bg-gray-900 text-white text-sm font-semibold px-3 py-2 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(hoveredPoint / (data.length - 1)) * 100}%`,
                  top: `${100 - ((data[hoveredPoint][yKey] - minValue) / (maxValue - minValue || 1)) * 100}%`
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="font-bold">{data[hoveredPoint][yKey]}</div>
                  <div className="text-xs text-gray-300">{data[hoveredPoint][xKey]}</div>
                  {hoveredPoint > 0 && (
                    <div className={`text-xs mt-1 ${
                      data[hoveredPoint][yKey] > data[hoveredPoint - 1][yKey] ? 'text-green-400' :
                      data[hoveredPoint][yKey] < data[hoveredPoint - 1][yKey] ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {data[hoveredPoint][yKey] > data[hoveredPoint - 1][yKey] ? '↑' : 
                       data[hoveredPoint][yKey] < data[hoveredPoint - 1][yKey] ? '↓' : '→'} 
                      {Math.abs(data[hoveredPoint][yKey] - data[hoveredPoint - 1][yKey]).toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </div>

          {/* X-axis labels */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2">
            {data.map((item, index) => (
              <div
                key={index}
                className="text-xs text-gray-600 transform -rotate-45 origin-top-left whitespace-nowrap"
                style={{ marginLeft: '-1rem' }}
              >
                {item[xKey]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">{t('analytics.highest')}</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{maxValue}</div>
          <div className="text-xs text-blue-800">
            {data.find(item => item[yKey] === maxValue)?.[xKey]}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">{t('analytics.lowest')}</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{minValue}</div>
          <div className="text-xs text-green-800">
            {data.find(item => item[yKey] === minValue)?.[xKey]}
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-700">{t('analytics.average')}</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{avgValue.toFixed(1)}</div>
          <div className="text-xs text-purple-800">
            {t('analytics.across')} {data.length} {t('analytics.points')}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">{t('analytics.trend')}</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">
            {trend.label}
          </div>
          <div className={`text-xs ${trend.color}`}>
            {(((data[data.length - 1][yKey] - data[0][yKey]) / data[0][yKey]) * 100).toFixed(1)}% {t('analytics.change')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineChart;