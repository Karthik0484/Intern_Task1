import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getIncidentTypeVariant } from "@/data/mockData";

import type { IncidentWithCamera } from '@/types/database';

type Incident = IncidentWithCamera;

interface UnresolvedIncidentsListProps {
  incidents: Incident[];
  onRefetch: () => void;
}

export const UnresolvedIncidentsList = ({ incidents, onRefetch }: UnresolvedIncidentsListProps) => {
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleResolve = async (incidentId: string) => {
    setResolvingIds(prev => new Set([...prev, incidentId]));

    try {
      // Use raw API call since types might not be updated yet
      const response = await fetch(`https://qzviudmiwhwbiezpcwkj.supabase.co/rest/v1/incidents?id=eq.${incidentId}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dml1ZG1pd2h3YmllenBjd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjQxNTcsImV4cCI6MjA2ODc0MDE1N30.Rz3l4a1QuxGUnLpvDuNeuoWYzGUOhheEv7PF_N8UH0U`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ status: 'resolved' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update incident');
      }

      

      toast({
        title: "Incident Resolved",
        description: "The incident has been marked as resolved.",
      });

      onRefetch();
    } catch (error) {
      console.error('Error resolving incident:', error);
      toast({
        title: "Error",
        description: "Failed to resolve incident. Please try again.",
        variant: "destructive"
      });
    } finally {
      setResolvingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(incidentId);
        return newSet;
      });
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  if (incidents.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">All Clear!</h3>
        <p className="text-muted-foreground">No unresolved incidents at the moment.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Unresolved Incidents</h2>
        <Badge variant="destructive" className="text-xs">
          {incidents.length} Active
        </Badge>
      </div>

      <div className="grid gap-4">
        {incidents.map((incident) => {
          const isResolving = resolvingIds.has(incident.id);
          
          return (
            <Card key={incident.id} className={`p-4 ${isResolving ? 'opacity-50' : ''}`}>
              <div className="flex space-x-4">
                {/* Thumbnail */}
                <div className="w-20 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                  <img
                    src={incident.thumbnail_url}
                    alt={`Incident ${incident.id}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-muted">
                          <svg class="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      `;
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={getIncidentTypeVariant(incident.type)} className="text-xs">
                      {incident.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      #{incident.id.slice(0, 8)}
                    </span>
                  </div>

                  <div className="space-y-1">
                     <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                       <MapPin className="w-3 h-3" />
                       <span>{incident.location || incident.camera?.location || 'Unknown'}</span>
                     </div>
                    
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeRange(incident.ts_start, incident.ts_end)}</span>
                    </div>

                    {incident.camera && (
                      <div className="text-xs text-muted-foreground">
                        Camera: {incident.camera.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleResolve(incident.id)}
                    disabled={isResolving}
                    className="h-8"
                  >
                    {isResolving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin mr-1" />
                        Resolving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};