import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Archive,
  FolderOpen,
  TrendingUp
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onUpdate: (id: string, updates: Partial<Project>) => Promise<{ error: string | null }>;
  onDelete: (id: string) => Promise<{ error: string | null }>;
  onEdit: (project: Project) => void;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onUpdate, 
  onDelete, 
  onEdit,
  onSelect 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) {
      setLoading(true);
      await onDelete(project.id);
      setLoading(false);
    }
    setShowMenu(false);
  };

  const handleArchive = async () => {
    setLoading(true);
    const newStatus = project.status === 'archived' ? 'active' : 'archived';
    await onUpdate(project.id, { status: newStatus });
    setLoading(false);
    setShowMenu(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    const newStatus = project.status === 'completed' ? 'active' : 'completed';
    await onUpdate(project.id, { status: newStatus });
    setLoading(false);
    setShowMenu(false);
  };

  const completionPercentage = project.task_count && project.task_count > 0
    ? Math.round(((project.completed_tasks || 0) / project.task_count) * 100)
    : 0;

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
              style={{ backgroundColor: project.color }}
            >
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onSelect(project)}
                className="text-left w-full"
              >
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                  {project.name}
                </h3>
              </button>
              {project.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="relative ml-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onEdit(project);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Project</span>
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {project.status === 'completed' ? 'Mark as Active' : 'Mark as Complete'}
                  </span>
                </button>
                <button
                  onClick={handleArchive}
                  disabled={loading}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Archive className="w-4 h-4" />
                  <span>
                    {project.status === 'archived' ? 'Unarchive' : 'Archive'}
                  </span>
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Project</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats and Progress */}
      <div className="p-6 space-y-4">
        {/* Progress Bar */}
        {(project.task_count || 0) > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: project.color,
                  width: `${completionPercentage}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Task Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <CheckCircle className="w-4 h-4" />
              <span>{project.completed_tasks || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{(project.task_count || 0) - (project.completed_tasks || 0)}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{project.task_count || 0} total</span>
            </div>
          </div>

          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created {formatDate(project.created_at)}</span>
          </div>
          <span>Updated {formatDate(project.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};