import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Camera, MapPin } from "lucide-react";

interface MainVideoPlayerProps {
  selectedIncident?: any;
}

export const MainVideoPlayer = ({ selectedIncident }: MainVideoPlayerProps) => {
  const [imageError, setImageError] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  if (!selectedIncident) {
    return (
      <Card className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-center">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Select an incident to view details</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full overflow-hidden bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge 
              className={`${getStatusColor(selectedIncident.type)} text-white px-3 py-1`}
            >
              {selectedIncident.type}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Incident #{selectedIncident.id.slice(0, 8)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              ACTIVE
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(selectedIncident.ts_start)}
            </span>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        {selectedIncident.thumbnail_url && !imageError ? (
          <img
            src={selectedIncident.thumbnail_url}
            alt="Incident footage"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Video footage unavailable</p>
            </div>
          </div>
        )}
        
        {/* Time overlay */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-mono">
          {formatTime(selectedIncident.ts_start)} - {formatTime(selectedIncident.ts_end)}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {selectedIncident.camera?.name || 'Unknown Camera'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {selectedIncident.camera?.location || selectedIncident.location || 'Unknown Location'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};