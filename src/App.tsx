import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProjects } from './hooks/useProjects';
import { AuthForm } from './components/Auth/AuthForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TasksView } from './components/Tasks/TasksView';
import { ProjectsView } from './components/Projects/ProjectsView';
import { ProjectForm } from './components/Projects/ProjectForm';
import { authHelpers } from './lib/supabase';
import { Project } from './types';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { projects, createProject } = useProjects();
  const [activeView, setActiveView] = useState('dashboard');
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Auto-redirect to dashboard after successful auth
  const handleAuthSuccess = () => {
    setActiveView('dashboard');
  };

  const handleSignOut = async () => {
    await authHelpers.signOut();
    setActiveView('dashboard');
  };

  const handleCreateProject = () => {
    setShowProjectForm(true);
  };

  const handleProjectFormSubmit = async (projectData: Partial<Project>) => {
    const result = await createProject(projectData as Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>);
    if (!result.error) {
      setShowProjectForm(false);
      setActiveView('projects');
    }
    return result;
  };

  const handleProjectSelect = (project: Project) => {
    setActiveView(`project-${project.id}`);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'tasks':
        return <TasksView projects={projects} />;
      
      case 'projects':
        return <ProjectsView onProjectSelect={handleProjectSelect} />;
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 mt-1">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User ID</label>
                  <p className="text-gray-500 text-sm mt-1 font-mono">{user?.id}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        // Handle project-specific views
        if (activeView.startsWith('project-')) {
          const projectId = activeView.replace('project-', '');
          const project = projects.find(p => p.id === projectId);
          
          if (project) {
            return <TasksView projects={projects} projectId={projectId} />;
          } else {
            // Project not found, redirect to projects view
            setActiveView('projects');
            return <ProjectsView onProjectSelect={handleProjectSelect} />;
          }
        }
        
        return <Dashboard />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        projects={projects}
        onCreateProject={handleCreateProject}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="p-8 max-w-7xl mx-auto">
          {renderMainContent()}
        </div>
      </main>

      <ProjectForm
        isOpen={showProjectForm}
        onClose={() => setShowProjectForm(false)}
        onSubmit={handleProjectFormSubmit}
      />
    </div>
  );
}