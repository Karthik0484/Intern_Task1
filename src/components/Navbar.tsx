import { Shield } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">SecureSight Dashboard</h1>
        <div className="flex items-center space-x-2 ml-auto">
          <div className="w-2 h-2 bg-status-active rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live Monitoring</span>
        </div>
      </div>
    </nav>
  );
};