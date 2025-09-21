export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'completed' | 'archived';
  user_id: string;
  created_at: string;
  updated_at: string;
  task_count?: number;
  completed_tasks?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  completed_at: string | null;
  project_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  project?: Project;
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  content: string;
  task_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  user?: Profile;
}

export interface TaskFilters {
  status?: 'todo' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  project_id?: string;
  search?: string;
  due_date?: 'overdue' | 'today' | 'this_week' | 'this_month';
  sort_by?: 'created_at' | 'updated_at' | 'due_date' | 'priority' | 'title';
  sort_order?: 'asc' | 'desc';
}

export interface ProjectFilters {
  status?: 'active' | 'completed' | 'archived';
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'name';
  sort_order?: 'asc' | 'desc';
}

export interface DashboardStats {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  completion_rate: number;
  productivity_trend: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
  priority_breakdown: {
    high: number;
    medium: number;
    low: number;
  };
  project_progress: Array<{
    project: Project;
    completion_percentage: number;
    task_count: number;
    completed_tasks: number;
  }>;
}

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  due_date_reminders: boolean;
  project_updates: boolean;
  task_assignments: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  date_format: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  time_format: '12h' | '24h';
  notifications: NotificationSettings;
}