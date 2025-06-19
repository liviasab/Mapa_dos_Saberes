import React from "react";
import { LogOut, Search, Mail } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import LogoOut from "../../assets/icons/logo_out.svg?react";

interface HeaderProps {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showSearch = false,
  searchValue = "",
  onSearchChange,
}) => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <LogoOut />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Mapa dos Saberes
            </h1>
          </div>

          {showSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Procurar espaços..."
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={user.user_metadata?.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      // Fallback to UI Avatars if the image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.user_metadata?.full_name || user.email || "User"
                      )}&background=3B82F6&color=fff`;
                    }}
                  />
                </div>
                <span className="hidden sm:block text-sm text-gray-700">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
