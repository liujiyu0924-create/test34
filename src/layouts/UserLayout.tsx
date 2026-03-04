import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PiggyBank, ShoppingBag, User } from 'lucide-react';

export default function UserLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe">
        <Link to="/app" className={`flex flex-col items-center ${isActive('/app') && location.pathname === '/app' ? 'text-emerald-600' : 'text-gray-500'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">认养大厅</span>
        </Link>
        <Link to="/app/my-pigs" className={`flex flex-col items-center ${isActive('/app/my-pigs') ? 'text-emerald-600' : 'text-gray-500'}`}>
          <PiggyBank size={24} />
          <span className="text-xs mt-1">我的猪</span>
        </Link>
        <Link to="/app/feed" className={`flex flex-col items-center ${isActive('/app/feed') ? 'text-emerald-600' : 'text-gray-500'}`}>
          <ShoppingBag size={24} />
          <span className="text-xs mt-1">投喂</span>
        </Link>
        <Link to="/app/profile" className={`flex flex-col items-center ${isActive('/app/profile') ? 'text-emerald-600' : 'text-gray-500'}`}>
          <User size={24} />
          <span className="text-xs mt-1">我的</span>
        </Link>
      </nav>
    </div>
  );
}
