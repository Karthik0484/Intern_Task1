import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/DashboardNavbar";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Cameras = () => {
  const [cameras, setCameras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<any | null>(null);

  useEffect(() => {
    async function fetchCameras() {
      setLoading(true);
      const { data } = await supabase.from("cameras").select("*");
      setCameras(data || []);
      setLoading(false);
    }
    fetchCameras();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar currentUser={null} resolvedCount={0} />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Camera Management</h1>
        <div className="bg-card rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : cameras.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No cameras found.</td></tr>
              ) : (
                cameras.map(camera => (
                  <tr
                    key={camera.id}
                    className={`transition cursor-pointer ${selectedCamera && selectedCamera.id === camera.id ? "bg-blue-100 dark:bg-blue-900" : "hover:bg-muted/50"}`}
                    onClick={() => setSelectedCamera(camera)}
                  >
                    <td className="px-4 py-2 text-xs text-foreground font-mono">{camera.id.slice(0, 8)}</td>
                    <td className="px-4 py-2 text-sm text-foreground">{camera.name}</td>
                    <td className="px-4 py-2 text-sm text-foreground">{camera.location}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{camera.created_at ? new Date(camera.created_at).toLocaleString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Camera Details Section */}
        <div className="mt-8">
          {selectedCamera ? (
            <div className="bg-card rounded-lg shadow p-6 max-w-md mx-auto border border-border">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Camera Details</h2>
              <div className="mb-2"><span className="font-semibold text-muted-foreground">ID:</span> <span className="font-mono text-xs">{selectedCamera.id}</span></div>
              <div className="mb-2"><span className="font-semibold text-muted-foreground">Name:</span> {selectedCamera.name}</div>
              <div className="mb-2"><span className="font-semibold text-muted-foreground">Location:</span> {selectedCamera.location}</div>
              <div className="mb-2"><span className="font-semibold text-muted-foreground">Created At:</span> {selectedCamera.created_at ? new Date(selectedCamera.created_at).toLocaleString() : "-"}</div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">Select a camera to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cameras;