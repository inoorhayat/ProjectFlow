import React, { useState } from 'react';
import { Calendar, Flag, User, Edit2, Trash2, CheckCircle, Clock, Circle } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<{ error: string | null }>;
  onDelete: (id: string) => Promise<{ error: string | null }>;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, onEdit }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: Task['status']) => {
    setLoading(true);
    await onUpdate(task.id, { status: newStatus });
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      await onDelete(task.id);
      setLoading(false);
    }
  };

  const priorityColors = {
    low: 'border-l-gray-400 bg-gray-50',
    medium: 'border-l-orange-400 bg-orange-50',
    high: 'border-l-red-400 bg-red-50',
  };

  const statusIcons = {
    todo: Circle,
    in_progress: Clock,
    completed: CheckCircle,
  };

  const StatusIcon = statusIcons[task.status];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <div className={`bg-white rounded-lg border border-l-4 ${priorityColors[task.priority]} p-6 shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => {
              const nextStatus = task.status === 'todo' ? 'in_progress' 
                : task.status === 'in_progress' ? 'completed' 
                : 'todo';
              handleStatusChange(nextStatus);
            }}
            disabled={loading}
            className="mt-1 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
          >
            <StatusIcon 
              className={`w-5 h-5 ${
                task.status === 'completed' 
                  ? 'text-green-500' 
                  : task.status === 'in_progress' 
                  ? 'text-blue-500' 
                  : 'text-gray-400'
              }`}
            />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Flag className="w-4 h-4" />
            <span className="capitalize">{task.priority}</span>
          </div>
          
          {task.project && (
            <div className="flex items-center space-x-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: task.project.color }}
              />
              <span>{task.project.name}</span>
            </div>
          )}
        </div>

        {task.due_date && (
          <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.due_date)}</span>
            {isOverdue && <span className="text-xs">(Overdue)</span>}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
          ${task.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : task.status === 'in_progress' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
          }`}>
          {task.status.replace('_', ' ')}
        </span>
        
        <span className="text-xs text-gray-400">
          Updated {new Date(task.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};