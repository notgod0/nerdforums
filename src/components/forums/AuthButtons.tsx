import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, UserPlus, Shield } from "lucide-react";

interface AuthButtonsProps {
  user: any;
  isAdmin: boolean;
  loading: boolean;
  onLogout: () => void;
}

export const AuthButtons = ({ user, isAdmin, loading, onLogout }: AuthButtonsProps) => {
  const navigate = useNavigate();

  if (user) {
    return (
      <>
        {isAdmin && (
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            disabled={loading}
            className="bg-purple-950/20 border-purple-500/20 hover:bg-purple-900/30 hover:border-purple-500/30"
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onLogout}
          disabled={loading}
          className="bg-purple-950/20 border-purple-500/20 hover:bg-purple-900/30 hover:border-purple-500/30"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => navigate("/login")}
        disabled={loading}
        className="bg-purple-950/20 border-purple-500/20 hover:bg-purple-900/30 hover:border-purple-500/30"
      >
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
      <Button
        variant="outline"
        onClick={() => navigate("/signup")}
        disabled={loading}
        className="bg-purple-950/20 border-purple-500/20 hover:bg-purple-900/30 hover:border-purple-500/30"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Sign Up
      </Button>
    </>
  );
};