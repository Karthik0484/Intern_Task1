import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/DashboardNavbar";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function StatusBadge({ resolved }: { resolved: boolean }) {
  return resolved ? (
    <span className="px-2 py-1 rounded text-xs font-semibold bg-[#3e3e4b] text-white border border-[#3e3e4b]">RESOLVED</span>
  ) : (
    <span className="px-2 py-1 rounded text-xs font-semibold bg-[#1ecb4f] text-white">ACTIVE</span>
  );
}

const Incidents = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIncidents() {
      setLoading(true);
      const { data } = await supabase.from("incidents").select("*");
      setIncidents(data || []);
      setLoading(false);
    }
    fetchIncidents();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar currentUser={null} resolvedCount={incidents.filter(i => i.resolved).length} />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">All Incidents</h1>
        <div className="bg-card rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Camera</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Start Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">End Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Thumbnail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : incidents.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No incidents found.</td></tr>
              ) : (
                incidents.map(incident => (
                  <tr key={incident.id} className="hover:bg-muted/50 transition">
                    <td className="px-4 py-2 text-xs text-foreground font-mono">{incident.id.slice(0, 8)}</td>
                    <td className="px-4 py-2 text-sm text-foreground">{incident.type}</td>
                    <td className="px-4 py-2 text-sm text-foreground">{incident.camera_id || "-"}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{incident.ts_start ? new Date(incident.ts_start).toLocaleString() : "-"}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{incident.ts_end ? new Date(incident.ts_end).toLocaleString() : "-"}</td>
                    <td className="px-4 py-2"><StatusBadge resolved={incident.resolved} /></td>
                    <td className="px-4 py-2">
                      {incident.thumbnail_url ? (
                        <img src={incident.thumbnail_url} alt="thumb" className="w-14 h-14 object-cover rounded border border-border" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No image</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Incidents;