import React from 'react';
import { FolderOpen, TrendingUp, Calendar } from 'lucide-react';
import { DashboardStats } from '../../types';

interface ProjectProgressProps {
  data: DashboardStats['project_progress'];
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>No projects available</p>
        </div>
      </div>
    );
  }

  const sortedProjects = [...data]
    .filter(item => item.project.status === 'active')
    .sort((a, b) => b.completion_percentage - a.completion_percentage)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {sortedProjects.map((item) => (
          <div key={item.project.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: item.project.color }}
                >
                  <FolderOpen className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.project.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span>{item.completed_tasks} / {item.task_count} tasks</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(item.project.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm font-medium text-gray-900">
                  {item.completion_percentage}%
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: item.project.color,
                  width: `${item.completion_percentage}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {data.filter(item => item.project.status === 'active').length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p>No active projects found</p>
        </div>
      )}
    </div>
  );
};