import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Wifi, WifiOff } from "lucide-react";

import type { ExtendedCamera } from '@/types/database';

type Camera = ExtendedCamera;

interface CameraGridProps {
  cameras: Camera[];
}

export const CameraGrid = ({ cameras }: CameraGridProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Live Camera Feed</h2>
        <Badge variant="outline" className="text-xs">
          {cameras.filter(c => c.is_active).length} / {cameras.length} Online
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map((camera) => (
          <Card key={camera.id} className="overflow-hidden">
            <div className="relative">
              {/* Camera Stream */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                {camera.stream_url ? (
                  <img
                    src={camera.stream_url}
                    alt={`${camera.name} stream`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-muted">
                          <div class="text-center">
                            <svg class="w-8 h-8 text-muted-foreground mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                            <p class="text-xs text-muted-foreground">No Preview</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No Stream</p>
                    </div>
                  </div>
                )}

                {/* Status Overlay */}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={camera.is_active ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {camera.is_active ? (
                      <>
                        <Wifi className="w-3 h-3 mr-1" />
                        Online
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 mr-1" />
                        Offline
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Camera Info */}
              <div className="p-3">
                <h3 className="font-medium text-foreground text-sm">{camera.name}</h3>
                <p className="text-xs text-muted-foreground">{camera.location}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};