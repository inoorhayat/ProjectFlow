import React from 'react';
import { AlertTriangle, Flag, Minus } from 'lucide-react';
import { DashboardStats } from '../../types';

interface PriorityBreakdownProps {
  data: DashboardStats['priority_breakdown'];
}

export const PriorityBreakdown: React.FC<PriorityBreakdownProps> = ({ data }) => {
  const total = data.high + data.medium + data.low;

  const priorities = [
    {
      name: 'High Priority',
      count: data.high,
      color: '#EF4444',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      icon: AlertTriangle,
    },
    {
      name: 'Medium Priority',
      count: data.medium,
      color: '#F59E0B',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      icon: Flag,
    },
    {
      name: 'Low Priority',
      count: data.low,
      color: '#6B7280',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      icon: Minus,
    },
  ];

  if (total === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Priority Breakdown</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>No pending tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Priority Breakdown</h3>
      
      <div className="space-y-3">
        {priorities.map((priority) => {
          const percentage = total > 0 ? (priority.count / total) * 100 : 0;
          const Icon = priority.icon;
          
          return (
            <div key={priority.name} className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${priority.bgColor}`}>
                <Icon className={`w-4 h-4 ${priority.textColor}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {priority.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {priority.count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: priority.color,
                      width: `${percentage}%`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-900">Total Pending Tasks</span>
          <span className="text-gray-600">{total}</span>
        </div>
      </div>
    </div>
  );
};