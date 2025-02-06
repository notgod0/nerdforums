import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, LogIn, LogOut, UserPlus, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { WelcomeMessage } from "./WelcomeMessage";

interface NavBarProps {
  user: any;
  isAdmin: boolean;
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLogout: () => void;
  isMobile: boolean;
}

export const NavBar = ({ 
  user,
  isAdmin,
  loading,
  searchTerm, 
  onSearchChange,
  onLogout,
  isMobile 
}: NavBarProps) => {
  const navigate = useNavigate();

  return (
    <nav className="relative border-b border-purple-500/20 backdrop-blur-sm bg-black/30 z-20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Logo />
          <div className={isMobile ? 'hidden' : ''}>
            <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <WelcomeMessage user={user} />
          {!isMobile && (
            <div className="flex items-center space-x-2">
              {user ? (
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
              ) : (
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
              )}
            </div>
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              asChild
            >
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
            </Button>
          )}
        </div>
      </div>
      {isMobile && (
        <div className="px-4 py-2 border-t border-purple-500/20">
          <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>
      )}
    </nav>
  );
};