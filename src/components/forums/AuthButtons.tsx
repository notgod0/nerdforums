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
            variant="ghost"
            onClick={() => navigate("/admin")}
            disabled={loading}
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={onLogout}
          disabled={loading}
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
        variant="ghost"
        onClick={() => navigate("/login")}
        disabled={loading}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/signup")}
        disabled={loading}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Sign Up
      </Button>
    </>
  );
};