import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LOADING_TIMEOUT = 10000;

export const useForumData = (userId: string | null) => {
  const [forums, setForums] = useState<any[]>([]);
  const [filteredForums, setFilteredForums] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

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

        if (userId) {
          const { data: likesData } = await supabase
            .from("forum_likes")
            .select("forum_id")
            .eq("user_id", userId);
          
          if (likesData) {
            setUserLikes(new Set(likesData.map(like => like.forum_id)));
          }
        }
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
  }, [userId]);

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

  const handleLike = async (forumId: string, currentLikes: number) => {
    if (!userId) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const isLiked = userLikes.has(forumId);
      
      if (isLiked) {
        const { error: deleteLikeError } = await supabase
          .from("forum_likes")
          .delete()
          .eq("user_id", userId)
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
          .insert([{ user_id: userId, forum_id: forumId }]);

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

  return {
    forums: filteredForums,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    userLikes,
    handleLike
  };
};