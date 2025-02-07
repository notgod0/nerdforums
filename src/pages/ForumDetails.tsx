
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Forum, Reply } from "@/types/forum";

const ForumDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState<Forum | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchForumAndLikes = async () => {
      try {
        const { data: forumData, error: forumError } = await supabase
          .from("forums")
          .select(`
            *,
            profiles!forums_user_id_fkey_profiles (
              email
            )
          `)
          .eq("id", id)
          .single();

        if (forumError) throw forumError;
        setForum(forumData as Forum);

        const { data: repliesData, error: repliesError } = await supabase
          .from("replies")
          .select(`
            *,
            profiles!replies_user_id_fkey (
              email
            )
          `)
          .eq("forum_id", id)
          .order("created_at", { ascending: true });

        if (repliesError) throw repliesError;
        setReplies(repliesData as Reply[]);

        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        if (session?.user) {
          const { data: likesData } = await supabase
            .from("forum_likes")
            .select("forum_id")
            .eq("user_id", session.user.id);

          if (likesData) {
            setUserLikes(new Set(likesData.map(like => like.forum_id)));
          }
        }
      } catch (error: any) {
        toast.error(error.message);
        navigate("/");
      }
    };

    fetchForumAndLikes();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    if (!forum) return;

    try {
      const isLiked = userLikes.has(forum.id);

      if (isLiked) {
        const { error: deleteLikeError } = await supabase
          .from("forum_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("forum_id", forum.id);

        if (deleteLikeError) throw deleteLikeError;

        const { error: updateForumError } = await supabase
          .from("forums")
          .update({ likes: (forum.likes || 0) - 1 })
          .eq("id", forum.id);

        if (updateForumError) throw updateForumError;

        setUserLikes(prev => {
          const newLikes = new Set(prev);
          newLikes.delete(forum.id);
          return newLikes;
        });

        setForum(prev => prev ? { ...prev, likes: (prev.likes || 0) - 1 } : null);
        toast.success("Forum unliked!");
      } else {
        const { error: insertLikeError } = await supabase
          .from("forum_likes")
          .insert([{ user_id: user.id, forum_id: forum.id }]);

        if (insertLikeError) throw insertLikeError;

        const { error: updateForumError } = await supabase
          .from("forums")
          .update({ likes: (forum.likes || 0) + 1 })
          .eq("id", forum.id);

        if (updateForumError) throw updateForumError;

        setUserLikes(prev => new Set([...prev, forum.id]));
        setForum(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
        toast.success("Forum liked!");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to reply");
      return;
    }

    if (forum?.status === 'closed' || forum?.status === 'solved') {
      toast.error("This forum is closed for new replies");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("replies").insert({
        content: newReply,
        forum_id: id,
        user_id: user.id,
      });

      if (error) throw error;

      setNewReply("");
      toast.success("Reply posted successfully!");

      const { data, error: fetchError } = await supabase
        .from("replies")
        .select(`
          *,
          profiles!replies_user_id_fkey (
            email
          )
        `)
        .eq("forum_id", id)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;
      setReplies(data as Reply[]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!forum) return null;

  const isForumClosed = forum.status === 'closed' || forum.status === 'solved';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          ← Back to Forums
        </Button>

        <div className="bg-white/5 p-8 rounded-lg border border-white/10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{forum.title}</h1>
              <p className="text-sm text-gray-400 mb-1">Posted by {forum.profiles?.email}</p>
              <p className="text-xs text-gray-500">
                {new Date(forum.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleLike}
                className={`${userLikes.has(forum.id) ? 'bg-purple-500/20' : ''}`}
              >
                ❤️ {forum.likes || 0}
              </Button>
              <span className={`forum-status ${
                forum.status === 'closed' ? 'status-closed' :
                forum.status === 'solved' ? 'status-solved' :
                'status-open'
              }`}>
                {forum.status}
              </span>
            </div>
          </div>
          <p className="text-gray-300 mb-6">{forum.description}</p>
          <div className="flex gap-2 mb-4">
            {forum.tags?.map((tag) => (
              <span key={tag} className="forum-tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Replies</h2>
          
          {!isForumClosed && (
            <form onSubmit={handleReply} className="space-y-4">
              <Textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder={
                  user 
                    ? "Write your reply..." 
                    : "Please login to reply"
                }
                disabled={!user || loading}
                className="bg-white/5 border-white/10 min-h-[100px]"
              />
              <Button
                type="submit"
                disabled={!user || loading || !newReply.trim()}
              >
                {loading ? "Posting..." : "Post Reply"}
              </Button>
            </form>
          )}

          {isForumClosed && (
            <div className="bg-red-500/20 text-red-200 p-4 rounded-lg">
              This forum is {forum.status}. No new replies can be added.
            </div>
          )}

          <div className="space-y-4">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="bg-white/5 p-6 rounded-lg border border-white/10"
              >
                <p className="text-sm text-gray-400 mb-1">
                  Posted by {reply.profiles?.email}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {new Date(reply.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-300">{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetails;
