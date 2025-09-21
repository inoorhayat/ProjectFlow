import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Dashboard } from './Dashboard';
import * as useDashboardModule from '../../hooks/useDashboard';

vi.mock('../../hooks/useDashboard');

describe('Dashboard', () => {
  const mockStats = {
    total_tasks: 15,
    completed_tasks: 8,
    in_progress_tasks: 4,
    pending_tasks: 3,
    overdue_tasks: 2,
    total_projects: 3,
    active_projects: 2,
    completed_projects: 1,
    completion_rate: 53,
    productivity_trend: [
      { date: '2024-01-01', completed: 2, created: 3 },
      { date: '2024-01-02', completed: 1, created: 2 },
    ],
    priority_breakdown: {
      high: 3,
      medium: 5,
      low: 7,
    },
    project_progress: [
      {
        project: {
          id: '1',
          name: 'Test Project',
          color: '#3B82F6',
          status: 'active' as const,
          description: 'Test description',
          user_id: '1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        completion_percentage: 75,
        task_count: 8,
        completed_tasks: 6,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    (useDashboardModule.useDashboard as any) = vi.fn(() => ({
      stats: null,
      loading: true,
      error: null,
    }));

    render(<Dashboard />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useDashboardModule.useDashboard as any) = vi.fn(() => ({
      stats: null,
      loading: false,
      error: 'Failed to load dashboard',
    }));

    render(<Dashboard />);
    
    expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
  });

  it('renders dashboard with stats', () => {
    (useDashboardModule.useDashboard as any) = vi.fn(() => ({
      stats: mockStats,
      loading: false,
      error: null,
    }));

    render(<Dashboard />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument(); // Total tasks
    expect(screen.getByText('8')).toBeInTheDocument(); // Completed tasks
    expect(screen.getByText('53%')).toBeInTheDocument(); // Completion rate
  });

  it('renders welcome message for new users', () => {
    const emptyStats = { ...mockStats, total_tasks: 0 };
    
    (useDashboardModule.useDashboard as any) = vi.fn(() => ({
      stats: emptyStats,
      loading: false,
      error: null,
    }));

    render(<Dashboard />);
    
    expect(screen.getByText(/welcome to projectflow!/i)).toBeInTheDocument();
  });
});