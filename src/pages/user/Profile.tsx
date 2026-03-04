import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { LogOut, User, Wallet } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4">
      <header className="mb-8 text-center pt-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <User size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-gray-500">@{user.username}</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-yellow-50 p-3 rounded-full text-yellow-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">钱包余额</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.balance)}</p>
          </div>
        </div>
        <button className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700" onClick={() => alert('功能开发中...')}>
          充值
        </button>
      </div>

      <div className="space-y-2">
        <button 
          onClick={() => alert('功能开发中...')}
          className="w-full bg-white p-4 rounded-xl shadow-sm text-left flex justify-between items-center"
        >
          <span>账户设置</span>
          <span className="text-gray-400">›</span>
        </button>
        <button 
          onClick={() => alert('功能开发中...')}
          className="w-full bg-white p-4 rounded-xl shadow-sm text-left flex justify-between items-center"
        >
          <span>帮助与支持</span>
          <span className="text-gray-400">›</span>
        </button>
        <button 
          onClick={logout}
          className="w-full bg-white p-4 rounded-xl shadow-sm text-left flex justify-between items-center text-red-600"
        >
          <span className="flex items-center gap-2"><LogOut size={18} /> 退出登录</span>
        </button>
      </div>
    </div>
  );
}
