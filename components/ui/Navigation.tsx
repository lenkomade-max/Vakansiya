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

          {/* Actions - показываем на всех устройствах */}
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <>
                {/* Profile Button */}
                <a
                  href="/profile"
                  className="px-2.5 md:px-4 py-2 bg-white text-black text-xs md:text-base font-medium border border-black rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Profil
                </a>

                {/* Post Job Button */}
                <button
                  onClick={onPostJob}
                  className="px-2.5 md:px-6 py-2 bg-black text-white text-xs md:text-base font-semibold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Elan yerləşdir</span>
                  <span className="sm:hidden">Elan</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="px-2.5 md:px-4 py-2 bg-white text-black text-xs md:text-base font-medium border border-black rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Daxil ol
                </button>
                <button
                  onClick={onPostJob}
                  className="px-2.5 md:px-6 py-2 bg-black text-white text-xs md:text-base font-semibold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Elan yerləşdir</span>
                  <span className="sm:hidden">Elan</span>
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
