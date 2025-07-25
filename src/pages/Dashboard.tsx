import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { DashboardNavbar } from "@/components/DashboardNavbar";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Remove getSupabaseImageUrl and all supabase.storage usage for images

const INCIDENT_TYPE_COLORS = {
  "Suspicious Activity": "bg-[#ffb200] text-black",
  "Unauthorized Access": "bg-[#2d7fff] text-white",
  "Gun Threat": "bg-[#3e3e4b] text-white border border-[#3e3e4b]",
  "Theft": "bg-[#ff6f00] text-white",
  "Active": "bg-[#1ecb4f] text-white",
  "Resolved": "bg-[#3e3e4b] text-white border border-[#3e3e4b]",
};

function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return then.toLocaleDateString();
}

// Helper to always use local public/images folder
function getImagePath(thumbnail_url) {
  if (!thumbnail_url) return "/images/incident1.jpg";
  // Remove any folder or leading slash
  const filename = thumbnail_url.split('/').pop();
  return `/images/${filename}`;
}

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [incidentsRes, userRes] = await Promise.all([
      supabase.from("incidents").select("*"),
      supabase.auth.getUser(),
    ]);
    // Map incidents to include the correct public URL for the thumbnail
    const incidentsWithUrls = (incidentsRes.data || []).map(incident => ({
      ...incident,
      // thumbnail_url: getSupabaseImageUrl(incident.thumbnail_url) // Removed Supabase Storage logic
    }));
    setIncidents(incidentsWithUrls);
    if (userRes.data.user) {
      setUser({
        ...userRes.data.user,
        created_at: userRes.data.user.created_at || "",
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  // Real-time subscription
  useEffect(() => {
    fetchData();
    const sub = supabase
      .channel("incidents-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incidents" },
        () => fetchData()
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, [fetchData]);

  // Auto-select first active incident
  useEffect(() => {
    if (!selectedIncident && incidents.length > 0) {
      setSelectedIncident(incidents.find(i => !i.resolved) || incidents[0]);
    }
  }, [incidents, selectedIncident]);

  // --- Incident Resolution ---
  async function resolveIncident(id) {
    setResolving(id);
    const { error } = await supabase.from("incidents").update({ resolved: true }).eq("id", id);
    setResolving(null);
    if (error) {
      alert("Failed to resolve incident: " + error.message);
    } else {
      fetchData();
    }
  }

  // --- UI Components ---
  function IncidentBadge({ type }) {
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${INCIDENT_TYPE_COLORS[type] || "bg-[#3e3e4b] text-white"}`}>{type}</span>
    );
  }

  function StatusBadge({ resolved }) {
    return resolved
      ? <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-[#3e3e4b] text-white border border-[#3e3e4b]">RESOLVED</span>
      : <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-[#1ecb4f] text-white">ACTIVE</span>;
  }

  function IncidentCard({ incident, selected, onClick }) {
    return (
      <div
        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition border border-transparent ${selected ? "bg-[#232c3b] border-[#2d7fff]" : "bg-[#181c23] hover:border-[#2d7fff]"} ${incident.resolved ? "opacity-60" : ""}`}
        onClick={onClick}
      >
        <div className="w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-900 flex items-center justify-center">
          <img src={getImagePath(incident.thumbnail_url)} alt="Incident" width={56} height={56} className="object-cover w-full h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <IncidentBadge type={incident.type} />
            <span className="text-xs text-gray-400">#{incident.id.slice(0, 8)}</span>
          </div>
          <div className="text-sm font-medium text-white leading-tight">{incident.location}</div>
          <div className="text-xs text-gray-400">{incident.sub_location || ""}</div>
          <div className="text-xs text-gray-500 mt-1">{incident.ts_start ? timeAgo(incident.ts_start) : ""}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {!incident.resolved ? (
            <button
              className="px-3 py-1 rounded bg-[#232c3b] border border-[#2d7fff] text-[#2d7fff] text-xs font-semibold hover:bg-[#2d7fff] hover:text-white transition disabled:opacity-50"
              onClick={e => { e.stopPropagation(); resolveIncident(incident.id); }}
              disabled={resolving === incident.id}
            >
              {resolving === incident.id ? "Resolving..." : "Resolve"}
            </button>
          ) : (
            <span className="px-2 py-1 rounded text-xs font-semibold bg-[#3e3e4b] text-white border border-[#3e3e4b]">RESOLVED</span>
          )}
            </div>
          </div>
    );
  }

  function MainIncidentSection({ incident }) {
    if (!incident) return (
      <div className="flex items-center justify-center h-full text-gray-400">No incident selected</div>
    );
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <IncidentBadge type={incident.type} />
          <span className="text-xs text-gray-400">Incident #{incident.id.slice(0, 8)}</span>
          <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            {incident.ts_start ? new Date(incident.ts_start).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ""}
          </span>
          <StatusBadge resolved={incident.resolved} />
        </div>
        <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {/* No video in schema, so just show image */}
          <img src={getImagePath(incident.thumbnail_url)} alt="Snapshot" className="w-full h-full object-contain" />
        </div>
        {/* Timeline (static for now, can be improved) */}
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-[#232c3b] text-xs text-white px-2 py-1 rounded">{incident.ts_start ? new Date(incident.ts_start).toLocaleTimeString() : "--:--"}</span>
          <span className="bg-[#232c3b] text-xs text-white px-2 py-1 rounded">{incident.ts_end ? new Date(incident.ts_end).toLocaleTimeString() : "--:--"}</span>
        </div>
      </div>
    );
  }

  // --- Layout ---
  const activeIncidents = incidents.filter(i => !i.resolved);

  return (
    <div className="min-h-screen bg-[#15181c] text-white">
      <DashboardNavbar currentUser={user} resolvedCount={incidents.filter(i => i.resolved).length} />
      <div className="flex flex-row gap-0 w-full max-w-full mx-auto" style={{height: 'calc(100vh - 72px)'}}>
        {/* Left Section: Main Incident */}
        <section className="flex-1 flex flex-col p-6 pr-2 min-w-0">
          <MainIncidentSection incident={selectedIncident} />
        </section>
        {/* Right Section: Security Incidents */}
        <aside className="w-[370px] max-w-full bg-[#181c23] border-l border-[#232c3b] p-4 flex flex-col h-full overflow-y-auto">
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-white">Security Incidents</h2>
            <div className="text-xs text-gray-400">{activeIncidents.length} active incidents</div>
          </div>
          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="text-gray-400">Loading incidents...</div>
            ) : incidents.length === 0 ? (
              <div className="text-gray-400">No incidents found.</div>
            ) : (
              incidents.map(incident => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  selected={selectedIncident && selectedIncident.id === incident.id}
                  onClick={() => setSelectedIncident(incident)}
                />
              ))
            )}
        </div>
        </aside>
      </div>
    </div>
  );
}
