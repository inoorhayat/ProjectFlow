import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthForm } from './AuthForm';
import * as supabaseModule from '../../lib/supabase';

// Mock the supabase module
vi.mock('../../lib/supabase');

describe('AuthForm', () => {
  const mockOnAuthSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<AuthForm onAuthSuccess={mockOnAuthSuccess} />);
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
  });

  it('switches to signup form when clicking signup link', async () => {
    render(<AuthForm onAuthSuccess={mockOnAuthSuccess} />);
    
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));
    
    await waitFor(() => {
      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<AuthForm onAuthSuccess={mockOnAuthSuccess} />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    // Form should not submit without required fields
    expect(mockOnAuthSuccess).not.toHaveBeenCalled();
  });

  it('calls signIn when login form is submitted', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ error: null });
    (supabaseModule.authHelpers.signIn as any) = mockSignIn;
    
    render(<AuthForm onAuthSuccess={mockOnAuthSuccess} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockOnAuthSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on authentication failure', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ 
      error: new Error('Invalid credentials') 
    });
    (supabaseModule.authHelpers.signIn as any) = mockSignIn;
    
    render(<AuthForm onAuthSuccess={mockOnAuthSuccess} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});