import React, { useState } from 'react';
import Button from './Button';

export interface NavigationProps {
  onLogin?: () => void;
  onPostJob?: () => void;
  isAuthenticated?: boolean;
  userAvatar?: string;
  userName?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  onLogin,
  onPostJob,
  isAuthenticated = false,
  userAvatar,
  userName,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-main py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold text-black hidden sm:block">
              VAKANSIYA.AZ
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="nav-link-active">
              Vakansiyalar
            </a>
            <a href="/companies" className="nav-link">
              Şirkətlər
            </a>
            <a href="/short-jobs" className="nav-link">
              Gündəlik işlər
            </a>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="flex items-center gap-3">
                  {/* Notifications */}
                  <button className="relative w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
                    <span className="text-xl">🔔</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Avatar */}
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">
                          {userName?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-black">{userName}</span>
                  </button>
                </div>

                {/* Post Job Button */}
                <Button variant="primary" size="sm" onClick={onPostJob}>
                  Vakansiya yerləşdir
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="px-4 py-2 text-black font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Daxil ol
                </button>
                <Button variant="primary" size="sm" onClick={onPostJob}>
                  Vakansiya yerləşdir
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="/" className="nav-link-active py-2">
                Vakansiyalar
              </a>
              <a href="/companies" className="nav-link py-2">
                Şirkətlər
              </a>
              <a href="/short-jobs" className="nav-link py-2">
                Gündəlik işlər
              </a>

              <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="font-bold text-gray-700">
                            {userName?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-black">{userName}</span>
                    </div>
                    <Button variant="primary" size="md" onClick={onPostJob} className="w-full">
                      Vakansiya yerləşdir
                    </Button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onLogin}
                      className="w-full py-3 text-black font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Daxil ol
                    </button>
                    <Button variant="primary" size="md" onClick={onPostJob} className="w-full">
                      Vakansiya yerləşdir
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
