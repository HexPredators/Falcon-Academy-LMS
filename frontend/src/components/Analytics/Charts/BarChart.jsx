import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const BarChart = ({ data, xKey, yKey, color = 'blue', title, height = 300, showGrid = true }) => {
  const { t } = useTranslation();
  
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

  const getBarColor = (value) => {
    if (value >= maxValue * 0.9) return `bg-${color}-600`;
    if (value >= avgValue) return `bg-${color}-500`;
    return `bg-${color}-400`;
  };

  const getTrendIcon = (value, index) => {
    if (index === 0) return null;
    const prevValue = data[index - 1][yKey];
    if (value > prevValue) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (value < prevValue) return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <Minus className="w-3 h-3 text-yellow-600" />;
  };

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-600">{t('analytics.max')}: {maxValue}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-gray-600">{t('analytics.avg')}: {avgValue.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">{t('analytics.min')}: {minValue}</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative" style={{ height }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
          {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0].map((value, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>{Math.round(value)}</span>
              <div className="w-8 border-t border-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          {showGrid && (
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((_, index) => (
                <div key={index} className="border-t border-gray-100"></div>
              ))}
            </div>
          )}

          {/* Bars */}
          <div className="flex items-end justify-between h-full pl-4 pr-2 pb-8">
            {data.map((item, index) => {
              const barHeight = (item[yKey] / maxValue) * (height - 40);
              return (
                <div key={index} className="flex flex-col items-center group relative">
                  {/* Bar */}
                  <div className="relative">
                    <div
                      className={`w-12 rounded-t-lg transition-all duration-500 hover:opacity-90 group-hover:w-14 ${getBarColor(item[yKey])}`}
                      style={{ height: barHeight }}
                    >
                      {/* Value on hover */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                          {item[yKey]}
                          {getTrendIcon(item[yKey], index)}
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>

                  {/* X-axis label */}
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900">{item[xKey]}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item[yKey]} {t('analytics.points')}
                    </div>
                  </div>

                  {/* Additional info */}
                  {item.trend && (
                    <div className={`mt-1 text-xs px-2 py-1 rounded-full ${
                      item.trend === 'up' ? 'bg-green-100 text-green-800' :
                      item.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* X-axis line */}
          <div className="absolute bottom-8 left-0 right-0 border-t border-gray-300"></div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-sm text-gray-700">{t('analytics.excellent')} (≥90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">{t('analytics.good')} (≥Avg)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-sm text-gray-700">{t('analytics.needsImprovement')} (&lt;Avg)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;