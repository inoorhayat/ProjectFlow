import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Task, TaskFilters, Project } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskFiltersComponent } from './TaskFilters';
import { useTasks } from '../../hooks/useTasks';

interface TasksViewProps {
  projects: Project[];
  projectId?: string;
}

export const TasksView: React.FC<TasksViewProps> = ({ projects, projectId }) => {
  const [filters, setFilters] = useState<TaskFilters>(
    projectId ? { project_id: projectId } : {}
  );
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(filters);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    const result = await createTask(taskData as Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>);
    if (!result.error) {
      setShowForm(false);
    }
    return result;
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    if (editingTask && editingTask.id === id) {
      const result = await updateTask(id, updates);
      if (!result.error) {
        setEditingTask(null);
        setShowForm(false);
      }
      return result;
    }
    return await updateTask(id, updates);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const currentProject = projectId ? projects.find(p => p.id === projectId) : null;
  const pageTitle = currentProject ? `${currentProject.name} Tasks` : 'All Tasks';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-gray-600 mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? 'border-blue-300 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <TaskFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          projects={projects}
        />
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-6">
            {Object.keys(filters).length > 0
              ? 'Try adjusting your filters or create a new task'
              : 'Get started by creating your first task'}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Task</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={deleteTask}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}

      <TaskForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={editingTask ? 
          (updates) => handleUpdateTask(editingTask.id, updates) :
          handleCreateTask
        }
        projects={projects}
        initialTask={editingTask}
      />
    </div>
  );
};