import { useState, useEffect } from 'react';
import { DashboardStats } from '../types';
import { supabase } from '../lib/supabase';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks with project information
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*)
        `);

      if (tasksError) throw tasksError;

      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      if (projectsError) throw projectsError;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate basic stats
      const totalTasks = tasks?.length || 0;
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
      const inProgressTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;
      const pendingTasks = tasks?.filter(t => t.status === 'todo').length || 0;
      const overdueTasks = tasks?.filter(t => 
        t.due_date && 
        new Date(t.due_date) < now && 
        t.status !== 'completed'
      ).length || 0;

      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;

      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Calculate productivity trend (last 30 days)
      const productivityTrend = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        const createdCount = tasks?.filter(t => 
          t.created_at.split('T')[0] === dateStr
        ).length || 0;
        
        const completedCount = tasks?.filter(t => 
          t.completed_at && t.completed_at.split('T')[0] === dateStr
        ).length || 0;

        productivityTrend.push({
          date: dateStr,
          created: createdCount,
          completed: completedCount,
        });
      }

      // Calculate priority breakdown
      const priorityBreakdown = {
        high: tasks?.filter(t => t.priority === 'high' && t.status !== 'completed').length || 0,
        medium: tasks?.filter(t => t.priority === 'medium' && t.status !== 'completed').length || 0,
        low: tasks?.filter(t => t.priority === 'low' && t.status !== 'completed').length || 0,
      };

      // Calculate project progress
      const projectProgress = projects?.map(project => {
        const projectTasks = tasks?.filter(t => t.project_id === project.id) || [];
        const projectCompletedTasks = projectTasks.filter(t => t.status === 'completed');
        const taskCount = projectTasks.length;
        const completedTasksCount = projectCompletedTasks.length;
        const completionPercentage = taskCount > 0 ? Math.round((completedTasksCount / taskCount) * 100) : 0;

        return {
          project: { ...project, task_count: taskCount, completed_tasks: completedTasksCount },
          completion_percentage: completionPercentage,
          task_count: taskCount,
          completed_tasks: completedTasksCount,
        };
      }) || [];

      const dashboardStats: DashboardStats = {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        in_progress_tasks: inProgressTasks,
        pending_tasks: pendingTasks,
        overdue_tasks: overdueTasks,
        total_projects: totalProjects,
        active_projects: activeProjects,
        completed_projects: completedProjects,
        completion_rate: completionRate,
        productivity_trend: productivityTrend,
        priority_breakdown: priorityBreakdown,
        project_progress: projectProgress,
      };

      setStats(dashboardStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardStats,
  };
};