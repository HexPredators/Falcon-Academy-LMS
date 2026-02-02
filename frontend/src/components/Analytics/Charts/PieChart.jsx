import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, TrendingUp, Users, Award } from 'lucide-react';

const PieChart = ({ data, title, height = 300, showLegend = true, showPercentage = true }) => {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500">{t('analytics.noData')}</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  const strokeWidth = 40;

  let cumulativeAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = startAngle + angle;
    cumulativeAngle = endAngle;

    // Calculate path for the segment
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      ...item,
      percentage,
      angle,
      startAngle,
      endAngle,
      pathData,
      color: item.color || getDefaultColor(index)
    };
  });

  function getDefaultColor(index) {
    const colors = [
      'text-blue-600', 'bg-blue-600',
      'text-green-600', 'bg-green-600',
      'text-purple-600', 'bg-purple-600',
      'text-yellow-600', 'bg-yellow-600',
      'text-red-600', 'bg-red-600',
      'text-indigo-600', 'bg-indigo-600',
      'text-pink-600', 'bg-pink-600',
      'text-orange-600', 'bg-orange-600'
    ];
    return colors[index % colors.length];
  }

  const getIcon = (label) => {
    const icons = {
      'excellent': <Award className="w-4 h-4" />,
      'good': <TrendingUp className="w-4 h-4" />,
      'average': <Target className="w-4 h-4" />,
      'poor': <Users className="w-4 h-4" />,
      'students': <Users className="w-4 h-4" />,
      'teachers': <Award className="w-4 h-4" />,
      'parents': <Users className="w-4 h-4" />
    };
    return icons[label.toLowerCase()] || <Target className="w-4 h-4" />;
  };

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="text-sm text-gray-600">
            {t('analytics.total')}: <span className="font-bold text-gray-900">{total}</span>
          </div>
        </div>
      )}

      <div className="relative" style={{ height }}>
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8">
          {/* Chart */}
          <div className="relative">
            <svg
              width="300"
              height="300"
              viewBox="0 0 300 300"
              className="transform -rotate-90"
            >
              {segments.map((segment, index) => (
                <g key={index}>
                  <path
                    d={segment.pathData}
                    fill="currentColor"
                    className={`${
                      hoveredIndex === index 
                        ? 'opacity-100' 
                        : 'opacity-90 hover:opacity-95'
                    } transition-all duration-300 ${
                      segment.color.startsWith('text-') 
                        ? segment.color.replace('text-', 'fill-')
                        : segment.color.startsWith('bg-')
                        ? segment.color.replace('bg-', 'fill-')
                        : segment.color
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  
                  {/* Segment outline on hover */}
                  {hoveredIndex === index && (
                    <path
                      d={segment.pathData}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="opacity-50"
                    />
                  )}
                </g>
              ))}
              
              {/* Center circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius - strokeWidth}
                fill="white"
                className="opacity-90"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-600">{t('analytics.total')}</div>
                {hoveredIndex !== null && (
                  <div className="mt-2">
                    <div className="text-lg font-semibold text-gray-900">
                      {segments[hoveredIndex].label}
                    </div>
                    <div className="text-sm text-gray-700">
                      {segments[hoveredIndex].value} ({segments[hoveredIndex].percentage.toFixed(1)}%)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="lg:w-1/2">
              <div className="space-y-4">
                {segments.map((segment, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                      hoveredIndex === index 
                        ? 'bg-gray-50 border border-gray-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded ${
                        segment.color.startsWith('text-') 
                          ? segment.color.replace('text-', 'bg-')
                          : segment.color
                      }`}></div>
                      <div className="flex items-center gap-2">
                        {getIcon(segment.label)}
                        <span className="font-medium text-gray-900">{segment.label}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{segment.value}</div>
                      {showPercentage && (
                        <div className="text-sm text-gray-600">
                          {segment.percentage.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('analytics.highest')}</p>
                    <p className="font-semibold text-gray-900">
                      {segments.reduce((max, item) => item.value > max.value ? item : max, segments[0]).label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('analytics.lowest')}</p>
                    <p className="font-semibold text-gray-900">
                      {segments.reduce((min, item) => item.value < min.value ? item : min, segments[0]).label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">{t('analytics.segments')}</div>
          <div className="text-2xl font-bold text-blue-900">{segments.length}</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-700">{t('analytics.range')}</div>
          <div className="text-2xl font-bold text-green-900">
            {Math.min(...segments.map(s => s.value))} - {Math.max(...segments.map(s => s.value))}
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-700">{t('analytics.average')}</div>
          <div className="text-2xl font-bold text-purple-900">
            {(total / segments.length).toFixed(1)}
          </div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-sm text-yellow-700">{t('analytics.variance')}</div>
          <div className="text-2xl font-bold text-yellow-900">
            {Math.max(...segments.map(s => s.percentage)).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;