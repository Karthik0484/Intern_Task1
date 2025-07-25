import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Camera, Clock, MapPin } from "lucide-react";
import { Incident, getIncidentTypeVariant } from "@/data/mockData";
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

interface IncidentPlayerProps {
  selectedIncident: Incident | null;
}

export const IncidentPlayer = ({ selectedIncident }: IncidentPlayerProps) => {
  const [imageError, setImageError] = useState(false);

  if (!selectedIncident) {
    return (
      <Card className="h-full bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium text-foreground">No Incident Selected</h3>
            <p className="text-muted-foreground">Select an incident from the list to view details</p>
          </div>
        </div>
      </Card>
    );
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const imageSrc = imageMap[selectedIncident.thumbnail_url] || selectedIncident.thumbnail_url;

  return (
    <Card className="h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant={getIncidentTypeVariant(selectedIncident.type)}>
              {selectedIncident.type}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Incident #{selectedIncident.id.slice(0, 8)}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(selectedIncident.ts_start)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main video/image area */}
      <div className="aspect-video bg-black relative overflow-hidden">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={`Incident ${selectedIncident.id}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/10">
            <div className="text-center space-y-2">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground text-sm">Video unavailable</p>
            </div>
          </div>
        )}
        
        {/* Timestamp overlay */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
          {formatTime(selectedIncident.ts_start)} - {formatTime(selectedIncident.ts_end)}
        </div>

        {/* Status overlay */}
        <div className="absolute top-4 right-4">
          <Badge variant={selectedIncident.resolved ? "resolved" : "active"}>
            {selectedIncident.resolved ? "RESOLVED" : "ACTIVE"}
          </Badge>
        </div>
      </div>

      {/* Camera info */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">{selectedIncident.camera?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{selectedIncident.camera?.location}</span>
          </div>
        </div>

        {/* Duration */}
        <div className="text-xs text-muted-foreground">
          Duration: {Math.round((new Date(selectedIncident.ts_end).getTime() - new Date(selectedIncident.ts_start).getTime()) / 60000)} minutes
        </div>
      </div>
    </Card>
  );
};