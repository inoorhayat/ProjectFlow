import { useState, useEffect } from 'react';
import { Project } from '../types';
import { supabase } from '../lib/supabase';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (createError) throw createError;
      await fetchProjects();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create project' };
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchProjects();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to update project' };
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchProjects();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete project' };
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};