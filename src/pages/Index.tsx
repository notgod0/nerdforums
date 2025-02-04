import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Forum {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  likes: number;
  status: string;
}

const Index = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial auth check
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        if (session?.user) {
          const { data: adminData } = await supabase
            .from("admin_users")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
          setIsAdmin(!!adminData);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
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
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const { data, error } = await supabase
          .from("forums")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setForums(data || []);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchForums();
    createAnimatedBackground();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state immediately
      setUser(null);
      setIsAdmin(false);
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  function createAnimatedBackground() {
    const container = document.body;
    if (!container) return;
    
    // Remove existing circles
    const existingCircles = document.querySelectorAll('.circle');
    existingCircles.forEach(circle => circle.remove());
    
    function createCircle() {
      const circle = document.createElement('div');
      circle.classList.add('circle');
      
      // Random size between 100px and 300px
      const size = Math.random() * 200 + 100;
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
      
      // Random position
      circle.style.left = `${Math.random() * 100}%`;
      circle.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      circle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(circle);
      
      // Remove circle after animation
      setTimeout(() => {
        circle.remove();
      }, 20000);
    }

    // Create initial circles
    for (let i = 0; i < 15; i++) {
      createCircle();
    }

    // Create new circles periodically
    setInterval(createCircle, 3000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Navbar */}
      <nav className="relative border-b border-purple-500/20 backdrop-blur-sm bg-black/30 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold">Nerd Forums</a>
            <div className="relative hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="search" 
                placeholder="Search forums..." 
                className="pl-10 w-[300px] h-10 rounded-md bg-purple-950/20 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate("/create-forum")} 
                  disabled={loading}
                >
                  New Forum
                </Button>
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/admin")}
                    disabled={loading}
                  >
                    Admin
                  </Button>
                )}
                <Button 
                  onClick={handleLogout} 
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate("/login")} 
                  variant="outline"
                  disabled={loading}
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate("/signup")}
                  disabled={loading}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="space-y-4">
          {forums.map((forum) => (
            <div
              key={forum.id}
              onClick={() => navigate(`/forum/${forum.id}`)}
              className="forum-card"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{forum.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">❤️ {forum.likes || 0}</span>
                  <span className={`forum-status ${
                    forum.status === 'solved' ? 'status-solved' : 'status-open'
                  }`}>
                    {forum.status}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 mb-4 line-clamp-2">{forum.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {forum.tags?.map((tag) => (
                    <span key={tag} className="forum-tag">{tag}</span>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(forum.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;