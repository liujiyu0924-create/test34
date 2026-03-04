import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PiggyBank, ShoppingCart, Video, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-emerald-700">智慧养猪后台</h1>
          <p className="text-xs text-gray-500">管理控制台</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin') && location.pathname === '/admin' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} />
            <span>数据看板</span>
          </Link>
          <Link to="/admin/pigs" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/pigs') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <PiggyBank size={20} />
            <span>猪只管理</span>
          </Link>
          <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/orders') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <ShoppingCart size={20} />
            <span>订单管理</span>
          </Link>
          <Link to="/admin/cameras" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/cameras') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Video size={20} />
            <span>监控管理</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut size={20} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
