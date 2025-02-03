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
}

const Index = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  function createAnimatedBackground() {
    const container = document.getElementById('animated-background');
    if (!container) return;
    
    function createCircle() {
      const circle = document.createElement('div');
      circle.classList.add('circle');
      
      const size = Math.random() * 150 + 50;
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
      
      circle.style.left = `${Math.random() * 100}%`;
      circle.style.top = `${Math.random() * 100}%`;
      
      circle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(circle);
      
      setTimeout(() => {
        circle.remove();
      }, 10000);
    }

    for (let i = 0; i < 10; i++) {
      createCircle();
    }

    setInterval(createCircle, 2000);
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold">Nerd Forums</a>
            <div className="relative hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="search" placeholder="Search forums..." className="pl-10 w-[300px] h-10 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button onClick={() => navigate("/create-forum")}>New Forum</Button>
                <Button onClick={handleLogout} variant="outline">Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} variant="outline">Login</Button>
                <Button onClick={() => navigate("/signup")}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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