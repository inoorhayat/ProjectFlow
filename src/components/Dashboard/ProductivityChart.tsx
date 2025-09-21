import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardStats } from '../../types';

interface ProductivityChartProps {
  data: DashboardStats['productivity_trend'];
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <p>No productivity data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.completed, d.created))) || 1;
  const lastWeekCompleted = data.slice(-7).reduce((sum, d) => sum + d.completed, 0);
  const previousWeekCompleted = data.slice(-14, -7).reduce((sum, d) => sum + d.completed, 0);
  
  const weeklyChange = previousWeekCompleted === 0 ? 0 : 
    ((lastWeekCompleted - previousWeekCompleted) / previousWeekCompleted) * 100;

  const getTrendIcon = () => {
    if (weeklyChange > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (weeklyChange < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (weeklyChange > 0) return 'text-green-600';
    if (weeklyChange < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Productivity Trend</h3>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {weeklyChange === 0 ? 'No change' : 
             `${weeklyChange > 0 ? '+' : ''}${weeklyChange.toFixed(1)}%`}
          </span>
        </div>
      </div>

      <div className="h-48 relative">
        <div className="absolute inset-0 flex items-end justify-between space-x-1">
          {data.slice(-14).map((day, index) => (
            <div key={day.date} className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full flex flex-col items-center space-y-1">
                {/* Completed tasks bar */}
                <div 
                  className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                  style={{ 
                    height: `${(day.completed / maxValue) * 100}px`,
                    minHeight: day.completed > 0 ? '4px' : '0'
                  }}
                  title={`${day.completed} completed`}
                />
                {/* Created tasks bar */}
                <div 
                  className="w-full bg-blue-500 rounded-b transition-all duration-300 hover:bg-blue-600"
                  style={{ 
                    height: `${(day.created / maxValue) * 100}px`,
                    minHeight: day.created > 0 ? '4px' : '0'
                  }}
                  title={`${day.created} created`}
                />
              </div>
              
              {/* Date label (show every 3rd day to avoid crowding) */}
              {index % 3 === 0 && (
                <span className="text-xs text-gray-500 transform rotate-45 origin-left">
                  {new Date(day.date).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-gray-600">Created</span>
        </div>
      </div>
    </div>
  );
};