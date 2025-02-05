import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, UserPlus, Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  user: any;
  isAdmin: boolean;
  loading: boolean;
  onLogout: () => void;
}

export function AppSidebar({ user, isAdmin, loading, onLogout }: AppSidebarProps) {
  const navigate = useNavigate();

  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {user ? (
                <>
                  {isAdmin && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => navigate("/admin")}
                        disabled={loading}
                        tooltip="Admin Dashboard"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={onLogout}
                      disabled={loading}
                      tooltip="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate("/login")}
                      disabled={loading}
                      tooltip="Login"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate("/signup")}
                      disabled={loading}
                      tooltip="Sign Up"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}