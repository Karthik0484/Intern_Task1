import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, Clock, MapPin, CheckCircle } from "lucide-react";
import { Incident, getIncidentTypeVariant } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import incident1 from "@/assets/incident1.jpg";
import incident2 from "@/assets/incident2.jpg";
import incident3 from "@/assets/incident3.jpg";
import incident4 from "@/assets/incident4.jpg";

const imageMap: Record<string, string> = {
  "/src/assets/incident1.jpg": incident1,
  "/src/assets/incident2.jpg": incident2,
  "/src/assets/incident3.jpg": incident3,
  "/src/assets/incident4.jpg": incident4,
};

interface IncidentListProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
  onResolveIncident: (incidentId: string) => void;
}

export const IncidentList = ({ 
  incidents, 
  selectedIncident, 
  onSelectIncident, 
  onResolveIncident 
}: IncidentListProps) => {
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleResolve = async (incident: Incident, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    
    setResolvingIds(prev => new Set([...prev, incident.id]));
    
    // Optimistic UI update
    setTimeout(() => {
      onResolveIncident(incident.id);
      setResolvingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(incident.id);
        return newSet;
      });
      
      toast({
        title: "Incident Resolved",
        description: `Incident #${incident.id} has been marked as resolved.`,
      });
    }, 1000); // Simulate API delay
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  // Sort incidents: unresolved first, then by time (newest first)
  const sortedIncidents = [...incidents].sort((a, b) => {
    if (a.resolved !== b.resolved) {
      return a.resolved ? 1 : -1;
    }
    return new Date(b.ts_start).getTime() - new Date(a.ts_start).getTime();
  });

  return (
    <Card className="h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Security Incidents</h2>
        <p className="text-sm text-muted-foreground">
          {incidents.filter(i => !i.resolved).length} active incidents
        </p>
      </div>
      
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="p-2 space-y-2">
          {sortedIncidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            const isResolving = resolvingIds.has(incident.id);
            const imageSrc = imageMap[incident.thumbnail_url] || incident.thumbnail_url;
            
            return (
              <Card
                key={incident.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                } ${
                  incident.resolved ? "opacity-60" : ""
                } ${
                  isResolving ? "animate-pulse" : ""
                }`}
                onClick={() => onSelectIncident(incident)}
              >
                <div className="p-3">
                  <div className="flex space-x-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={imageSrc}
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
                      <div className="flex items-start justify-between space-x-2 mb-2">
                        <Badge variant={getIncidentTypeVariant(incident.type)} className="text-xs">
                          {incident.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          #{incident.id.slice(0, 8)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Camera className="w-3 h-3" />
                          <span className="truncate">{incident.camera?.name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{incident.camera?.location}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(incident.ts_start)}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(incident.ts_start)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex justify-end">
                    {!incident.resolved ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleResolve(incident, e)}
                        disabled={isResolving}
                        className="text-xs h-7"
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
                    ) : (
                      <Badge variant="resolved" className="text-xs">
                        RESOLVED
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};