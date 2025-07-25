import { DashboardNavbar } from "@/components/DashboardNavbar";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const Users = () => {
  const { currentUser, resolvedCount, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-20 bg-card border-b border-border p-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar 
        currentUser={currentUser} 
        resolvedCount={resolvedCount}
      />
      
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">User Management</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">User management features coming soon...</p>
        </Card>
      </div>
    </div>
  );
};

export default Users;