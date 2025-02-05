import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

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
  searchTerm, 
  onSearchChange,
  isMobile 
}: NavBarProps) => {
  const navigate = useNavigate();

  return (
    <nav className="relative border-b border-purple-500/20 backdrop-blur-sm bg-black/30 z-20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
              Nerd
            </span>
            <span className="text-2xl font-black text-white">Forums</span>
          </a>
          <div className={`relative ${isMobile ? 'hidden' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="search" 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search forums or tags..." 
              className="pl-10 w-[300px] h-10 rounded-md bg-purple-950/20 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            />
          </div>
        </div>
        <div className="flex items-center">
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
        </div>
      </div>
      {isMobile && (
        <div className="px-4 py-2 border-t border-purple-500/20">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="search" 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search forums or tags..." 
              className="pl-10 w-full h-10 rounded-md bg-purple-950/20 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            />
          </div>
        </div>
      )}
    </nav>
  );
};