import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Incident } from '@/data/mockData';

export const useIncidents = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: incidents = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['incidents'],
    queryFn: async (): Promise<Incident[]> => {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          camera:cameras(*)
        `)
        .order('ts_start', { ascending: false });

      if (error) {
        console.error('Error fetching incidents:', error);
        throw error;
      }

      return data.map(incident => ({
        ...incident,
        camera: incident.camera as any
      }));
    },
  });

  const resolveIncidentMutation = useMutation({
    mutationFn: async (incidentId: string) => {
      const { error } = await supabase
        .from('incidents')
        .update({ resolved: true })
        .eq('id', incidentId);

      if (error) {
        throw error;
      }
    },
    onMutate: async (incidentId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['incidents'] });

      // Snapshot the previous value
      const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);

      // Optimistically update the cache
      queryClient.setQueryData<Incident[]>(['incidents'], (old = []) =>
        old.map(incident =>
          incident.id === incidentId
            ? { ...incident, resolved: true }
            : incident
        )
      );

      return { previousIncidents };
    },
    onError: (error, incidentId, context) => {
      // Rollback on error
      if (context?.previousIncidents) {
        queryClient.setQueryData(['incidents'], context.previousIncidents);
      }
      
      toast({
        title: "Error",
        description: "Failed to resolve incident. Please try again.",
        variant: "destructive"
      });
      
      console.error('Error resolving incident:', error);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Incident resolved successfully.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  return {
    incidents,
    isLoading,
    error,
    resolveIncident: resolveIncidentMutation.mutate,
    isResolving: resolveIncidentMutation.isPending,
  };
};