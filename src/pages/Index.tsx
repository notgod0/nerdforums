import { useIsMobile } from "@/hooks/use-mobile";
import { MainLayout } from "@/components/forums/MainLayout";
import { useAuthState } from "@/hooks/use-auth-state";
import { useForumData } from "@/hooks/use-forum-data";

const Index = () => {
  const { user, isAdmin, loading: authLoading, handleLogout } = useAuthState();
  const { 
    forums,
    loading: forumsLoading,
    error,
    searchTerm,
    setSearchTerm,
    userLikes,
    handleLike
  } = useForumData(user?.id);
  const isMobile = useIsMobile();

  if (forumsLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <MainLayout
      user={user}
      isAdmin={isAdmin}
      loading={authLoading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onLogout={handleLogout}
      isMobile={isMobile}
      forums={forums}
      userLikes={userLikes}
      onLike={handleLike}
    />
  );
};

export default Index;