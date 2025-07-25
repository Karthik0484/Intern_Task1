import { DashboardNavbar } from "@/components/DashboardNavbar";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const Scenes = () => {
  const { currentUser, resolvedCount, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-20 bg-card border-b border-border p-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
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
        <h1 className="text-2xl font-bold text-foreground mb-6">Scene Management</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Scene management features coming soon...</p>
        </Card>
      </div>
    </div>
  );
};

export default Scenes;