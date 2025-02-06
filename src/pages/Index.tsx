import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavBar } from "@/components/forums/NavBar";
import { ForumCard } from "@/components/forums/ForumCard";
import { AnimatedBackground } from "@/components/forums/AnimatedBackground";
import { AppSidebar } from "@/components/forums/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface Forum {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  likes: number;
  status: string;
}

const LOADING_TIMEOUT = 10000; // 10 seconds timeout

const Index = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [filteredForums, setFilteredForums] = useState<Forum[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Checking user session...");
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        if (session?.user) {
          console.log("User found, checking admin status...");
          const { data: adminData } = await supabase
            .from("admin_users")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
          setIsAdmin(!!adminData);

          const { data: likesData } = await supabase
            .from("forum_likes")
            .select("forum_id")
            .eq("user_id", session.user.id);
          
          if (likesData) {
            setUserLikes(new Set(likesData.map(like => like.forum_id)));
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setError("Failed to check authentication status");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        setIsAdmin(!!adminData);

        const { data: likesData } = await supabase
          .from("forum_likes")
          .select("forum_id")
          .eq("user_id", session.user.id);
        
        if (likesData) {
          setUserLikes(new Set(likesData.map(like => like.forum_id)));
        }
      } else {
        setIsAdmin(false);
        setUserLikes(new Set());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const fetchForums = async () => {
      try {
        console.log("Fetching forums...");
        setLoading(true);
        setError(null);

        timeoutId = setTimeout(() => {
          setLoading(false);
          setError("Loading timeout - Please try again later");
          toast.error("Loading timeout - Please try again later");
        }, LOADING_TIMEOUT);

        const { data, error: supabaseError } = await supabase
          .from("forums")
          .select("*")
          .order("created_at", { ascending: false });

        clearTimeout(timeoutId);

        if (supabaseError) throw supabaseError;
        
        console.log("Forums fetched:", data);
        setForums(data || []);
        setFilteredForums(data || []);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching forums:", error);
        setError(error.message);
        toast.error("Failed to load forums");
        setLoading(false);
      }
    };

    fetchForums();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const filtered = forums.filter(forum => {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = forum.title.toLowerCase().includes(searchLower);
      const descriptionMatch = forum.description.toLowerCase().includes(searchLower);
      const tagMatch = forum.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      return titleMatch || descriptionMatch || tagMatch;
    });
    setFilteredForums(filtered);
  }, [searchTerm, forums]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAdmin(false);
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (forumId: string, currentLikes: number) => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const isLiked = userLikes.has(forumId);
      
      if (isLiked) {
        const { error: deleteLikeError } = await supabase
          .from("forum_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("forum_id", forumId);

        if (deleteLikeError) throw deleteLikeError;

        const { error: updateForumError } = await supabase
          .from("forums")
          .update({ likes: currentLikes - 1 })
          .eq("id", forumId);

        if (updateForumError) throw updateForumError;

        setUserLikes(prev => {
          const newLikes = new Set(prev);
          newLikes.delete(forumId);
          return newLikes;
        });

        setForums(prevForums =>
          prevForums.map(forum =>
            forum.id === forumId
              ? { ...forum, likes: (forum.likes || 0) - 1 }
              : forum
          )
        );
        
        toast.success("Forum unliked!");
      } else {
        const { error: insertLikeError } = await supabase
          .from("forum_likes")
          .insert([{ user_id: user.id, forum_id: forumId }]);

        if (insertLikeError) throw insertLikeError;

        const { error: updateForumError } = await supabase
          .from("forums")
          .update({ likes: currentLikes + 1 })
          .eq("id", forumId);

        if (updateForumError) throw updateForumError;

        setUserLikes(prev => new Set([...prev, forumId]));

        setForums(prevForums =>
          prevForums.map(forum =>
            forum.id === forumId
              ? { ...forum, likes: (forum.likes || 0) + 1 }
              : forum
          )
        );
        
        toast.success("Forum liked!");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading && !error) {
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
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen relative w-full">
        <AnimatedBackground />
        <NavBar 
          user={user}
          isAdmin={isAdmin}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onLogout={handleLogout}
          isMobile={isMobile}
        />
        <AppSidebar 
          user={user}
          isAdmin={isAdmin}
          loading={loading}
          onLogout={handleLogout}
          isMobile={isMobile}
        />

        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="space-y-4">
            {filteredForums.map((forum) => (
              <ForumCard
                key={forum.id}
                forum={forum}
                userLikes={userLikes}
                onLike={handleLike}
                onSearch={setSearchTerm}
              />
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;