import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IncidentSidebarProps {
  incidents: any[];
  selectedIncident: any | null;
  onSelectIncident: (incident: any) => void;
  onRefetch: () => void;
}

export const IncidentSidebar = ({ 
  incidents, 
  selectedIncident, 
  onSelectIncident, 
  onRefetch 
}: IncidentSidebarProps) => {
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    if (diffInMinutes > 0) return `${diffInMinutes}m ago`;
    return 'Just now';
  };

  const getStatusColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'suspicious activity':
        return 'bg-orange-500';
      case 'unauthorised access':
        return 'bg-blue-500';
      case 'gun threat':
        return 'bg-red-500';
      default:
        return 'bg-orange-500';
    }
  };

  const handleResolve = async (incident: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setResolvingIds(prev => new Set([...prev, incident.id]));
    
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ resolved: true })
        .eq('id', incident.id);

      if (error) throw error;

      toast({
        title: "Incident Resolved",
        description: `Incident ${incident.id.slice(0, 8)} has been marked as resolved.`,
      });

      onRefetch();
    } catch (error) {
      console.error('Error resolving incident:', error);
      toast({
        title: "Error",
        description: "Failed to resolve incident. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResolvingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(incident.id);
        return newSet;
      });
    }
  };

  const unresolvedIncidents = incidents.filter(incident => !incident.resolved);

  return (
    <div className="w-80 h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Security Incidents</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefetch}
            className="p-1 h-auto"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {unresolvedIncidents.length} active incident{unresolvedIncidents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-y-auto">
        {unresolvedIncidents.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">No active incidents</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {unresolvedIncidents.map((incident) => {
              const isSelected = selectedIncident?.id === incident.id;
              const isResolving = resolvingIds.has(incident.id);
              
              return (
                <Card
                  key={incident.id}
                  className={`p-3 cursor-pointer transition-all hover:bg-muted/50 ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                  } ${isResolving ? 'opacity-50' : ''}`}
                  onClick={() => onSelectIncident(incident)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                      {incident.thumbnail_url ? (
                        <img
                          src={incident.thumbnail_url}
                          alt="Incident thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <svg class="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Badge 
                          className={`${getStatusColor(incident.type)} text-white text-xs`}
                        >
                          {incident.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          #{incident.id.slice(-6)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 mb-1">
                        <Camera className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">
                          {incident.camera?.name || 'Unknown Camera'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 mb-2">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">
                          {incident.camera?.location || incident.location || 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(incident.ts_start)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={(e) => handleResolve(incident, e)}
                          disabled={isResolving}
                        >
                          {isResolving ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            'Resolve'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};