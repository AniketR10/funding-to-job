'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, User } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.refresh();
  };

  const isActive = (path: string) =>
    pathname === path
      ? "text-[#FF5A5F] underline decoration-2 underline-offset-4"
      : "hover:underline decoration-2 underline-offset-4";

  const avatarUrl = user?.user_metadata?.avatar_url || 
                    user?.user_metadata?.picture || 
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b-2 border-gray-900 bg-[#F8F3E7] sticky top-0 z-50">
      <Link href="/" className="flex items-center space-x-1 text-xl font-black text-blue-600 tracking-tighter">
        <span className='text-gray-900'>IAM<span className='text-[#FF5A5F]'>UNEMPLOYED</span></span>
      </Link>
      
      <div className="hidden md:flex space-x-6 font-bold text-gray-800 text-sm">
        <Link href="/" className={isActive('/')}>Home</Link>
        <Link href="/startups" className={isActive('/startups')}>Startups DB</Link>
        <Link href="/yc" className={isActive('/yc')}>YC Directory</Link>
        <Link href="/reddit" className={isActive('/reddit')}>
           <span className="flex items-center gap-2">
             Reddit Live
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
             </span>
           </span>
        </Link>
        <Link href="/contact" className={isActive('/contact')}>Contact Us</Link>
      </div>

     <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link href="https://github.com/AniketR10/funding-to-job">
            <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded font-bold text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Star Project
            </button>
          </Link>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 rounded-full border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-gray-200 overflow-hidden focus:outline-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                 <img 
                   src={avatarUrl} 
                   alt="Profile" 
                   className="w-full h-full object-cover"
                   referrerPolicy="no-referrer"
                 />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg py-1 z-50">
                  <div className="px-4 py-2 border-b-2 border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase">Signed in as</p>
                    <p className="text-sm font-black truncate text-gray-900">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </p>
                  </div>
                  
                  {/* <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link> */}
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link href="https://github.com/AniketR10/funding-to-job">
            <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded font-bold text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Star Project
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}