import { SidebarProvider } from "@/components/ui/sidebar";
import { NavBar } from "./NavBar";
import { AppSidebar } from "./AppSidebar";
import { AnimatedBackground } from "./AnimatedBackground";
import { ForumList } from "./ForumList";

interface MainLayoutProps {
  user: any;
  isAdmin: boolean;
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLogout: () => void;
  isMobile: boolean;
  forums: any[];
  userLikes: Set<string>;
  onLike: (forumId: string, currentLikes: number) => Promise<void>;
}

export const MainLayout = ({
  user,
  isAdmin,
  loading,
  searchTerm,
  onSearchChange,
  onLogout,
  isMobile,
  forums,
  userLikes,
  onLike
}: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen relative w-full">
        <AnimatedBackground />
        <NavBar 
          user={user}
          isAdmin={isAdmin}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onLogout={onLogout}
          isMobile={isMobile}
        />
        <AppSidebar 
          user={user}
          isAdmin={isAdmin}
          loading={loading}
          onLogout={onLogout}
          isMobile={isMobile}
        />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <ForumList 
            forums={forums}
            userLikes={userLikes}
            onLike={onLike}
            onSearch={onSearchChange}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};