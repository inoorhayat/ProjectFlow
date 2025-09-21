import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ProjectCard } from './ProjectCard';
import { Project } from '../../types';

describe('ProjectCard', () => {
  const mockProject: Project = {
    id: '1',
    name: 'Test Project',
    description: 'Test description',
    color: '#3B82F6',
    status: 'active',
    user_id: '1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    task_count: 10,
    completed_tasks: 6,
  };

  const mockProps = {
    project: mockProject,
    onUpdate: vi.fn().mockResolvedValue({ error: null }),
    onDelete: vi.fn().mockResolvedValue({ error: null }),
    onEdit: vi.fn(),
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders project information correctly', () => {
    render(<ProjectCard {...mockProps} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument(); // Completion percentage
    expect(screen.getByText('6')).toBeInTheDocument(); // Completed tasks
    expect(screen.getByText('10 total')).toBeInTheDocument(); // Total tasks
  });

  it('calls onSelect when project title is clicked', () => {
    render(<ProjectCard {...mockProps} />);
    
    fireEvent.click(screen.getByText('Test Project'));
    
    expect(mockProps.onSelect).toHaveBeenCalledWith(mockProject);
  });

  it('shows menu when more options button is clicked', () => {
    render(<ProjectCard {...mockProps} />);
    
    // The menu should be hidden initially
    expect(screen.queryByText('Edit Project')).not.toBeInTheDocument();
    
    // Click the more options button (find by its icon or role)
    const moreButton = screen.getByRole('button');
    fireEvent.click(moreButton);
    
    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    expect(screen.getByText('Mark as Complete')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
    expect(screen.getByText('Delete Project')).toBeInTheDocument();
  });

  it('renders correct status badge', () => {
    render(<ProjectCard {...mockProps} />);
    
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('calculates completion percentage correctly', () => {
    const projectWithDifferentStats = {
      ...mockProject,
      task_count: 8,
      completed_tasks: 2,
    };
    
    render(<ProjectCard {...mockProps} project={projectWithDifferentStats} />);
    
    expect(screen.getByText('25%')).toBeInTheDocument();
  });
});