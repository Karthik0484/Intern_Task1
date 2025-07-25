import { Shield, Users, Camera, AlertTriangle, LayoutDashboard, Video } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";

import type { ExtendedUser } from '@/types/database';

type User = ExtendedUser;

interface DashboardNavbarProps {
  currentUser?: User;
  resolvedCount: number;
}

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Cameras", icon: Camera, path: "/cameras" },
  { name: "Scenes", icon: Video, path: "/scenes" },
  { name: "Incidents", icon: AlertTriangle, path: "/incidents" },
  { name: "Users", icon: Users, path: "/users" },
];

export const DashboardNavbar = ({ currentUser, resolvedCount }: DashboardNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">SecureSight</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: User Profile and Stats */}
        <div className="flex items-center space-x-4">
          {/* Resolved Count */}
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">Resolved Today:</div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {resolvedCount}
            </Badge>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-status-active rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>

          {/* User Profile */}
          {currentUser && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground">{currentUser.email}</div>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.profile_url} alt={currentUser.name} />
                <AvatarFallback>
                  {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};