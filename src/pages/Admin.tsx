import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Forum } from "@/types/forum";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [forums, setForums] = useState<Forum[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    fetchForums();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: adminData } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setIsAdmin(!!adminData);
      if (!adminData) {
        toast.error("Unauthorized access");
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/");
    }
  };

  const fetchForums = async () => {
    try {
      const { data, error } = await supabase
        .from("forums")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setForums(data || []);
    } catch (error) {
      console.error("Error fetching forums:", error);
    }
  };

  const handleDeleteForum = async (id: string) => {
    try {
      const { error } = await supabase
        .from("forums")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Forum deleted successfully");
      fetchForums();
    } catch (error) {
      console.error("Error deleting forum:", error);
      toast.error("Failed to delete forum");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("forums")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Forum status updated");
      fetchForums();
    } catch (error) {
      console.error("Error updating forum status:", error);
      toast.error("Failed to update forum status");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Forums
          </Button>
        </div>

        <div className="space-y-4">
          {forums.map((forum) => (
            <div
              key={forum.id}
              className="bg-white/5 p-6 rounded-lg border border-white/10"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{forum.title}</h3>
                  <p className="text-gray-400 mb-2">{forum.description}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(forum.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={forum.status}
                    onChange={(e) => handleUpdateStatus(forum.id, e.target.value)}
                    className="bg-black/5 border border-white/10 rounded px-2 py-1"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="solved">Solved</option>
                  </select>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteForum(forum.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
