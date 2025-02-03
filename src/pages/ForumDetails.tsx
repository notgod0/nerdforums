import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Forum {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  user_id: string;
  likes: number;
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

const ForumDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState<Forum | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const { data: forumData, error: forumError } = await supabase
          .from("forums")
          .select("*")
          .eq("id", id)
          .single();

        if (forumError) throw forumError;
        setForum(forumData);

        const { data: repliesData, error: repliesError } = await supabase
          .from("replies")
          .select("*")
          .eq("forum_id", id)
          .order("created_at", { ascending: true });

        if (repliesError) throw repliesError;
        setReplies(repliesData);

        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error: any) {
        toast.error(error.message);
        navigate("/");
      }
    };

    fetchForum();
  }, [id, navigate]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to reply");
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

      const { data: newReplies, error: repliesError } = await supabase
        .from("replies")
        .select("*")
        .eq("forum_id", id)
        .order("created_at", { ascending: true });

      if (repliesError) throw repliesError;
      
      setReplies(newReplies);
      setNewReply("");
      toast.success("Reply added successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }

    try {
      const { error } = await supabase
        .from("forums")
        .update({ likes: (forum?.likes || 0) + 1 })
        .eq("id", id);

      if (error) throw error;

      setForum(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
      toast.success("Forum liked!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!forum) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white/5 p-8 rounded-lg border border-white/10">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">{forum.title}</h1>
            <Button onClick={handleLike} variant="outline">
              ❤️ {forum.likes || 0}
            </Button>
          </div>
          <p className="text-gray-300 mb-4 whitespace-pre-wrap">{forum.description}</p>
          <div className="flex gap-2 flex-wrap">
            {forum.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Replies</h2>
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-white/5 p-6 rounded-lg border border-white/10"
            >
              <p className="text-gray-300 whitespace-pre-wrap">{reply.content}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(reply.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}

          <form onSubmit={handleReply} className="space-y-4">
            <Textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write your reply..."
              required
              className="bg-white/5 border-white/10"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reply"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForumDetails;