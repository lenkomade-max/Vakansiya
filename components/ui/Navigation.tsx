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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-main py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg md:text-xl">V</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
              <span className="text-sm md:text-2xl font-bold text-black leading-tight">
                VAKANSIYA.AZ
              </span>
              <span className="text-[10px] md:text-base font-medium text-gray-600 leading-tight">
                Azərbaycanda iş tap
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="nav-link-active">
              Vakansiyalar
            </a>
            <a href="/companies" className="nav-link">
              Şirkətlər
            </a>
            <a href="/gundelik-isler" className="nav-link">
              Gündəlik işlər
            </a>
          </div>

          {/* Actions - показываем на всех устройствах */}
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <>
                {/* User Menu - только на десктопе */}
                <div className="hidden md:flex items-center gap-3">
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
                  <span className="hidden md:inline">Vakansiya yerləşdir</span>
                  <span className="md:hidden">Elan</span>
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="px-3 md:px-4 py-2 text-black text-sm md:text-base font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Daxil ol
                </button>
                <button
                  onClick={() => {
                    // Если не авторизован - сначала логин, потом post-job
                    onLogin && onLogin()
                  }}
                  className="px-3 md:px-6 py-2 bg-black text-white text-sm md:text-base font-semibold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  <span className="hidden md:inline">Elan yerləşdir</span>
                  <span className="md:hidden">Elan</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
