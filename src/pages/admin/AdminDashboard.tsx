import React, { useEffect, useState } from 'react';
import { Users, PiggyBank, ShoppingCart, Activity } from 'lucide-react';

interface Stats {
  totalPigs: number;
  adoptedPigs: number;
  totalUsers: number;
  pendingFeed: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <div className="p-8">加载中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">数据看板</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="猪只总数" 
          value={stats.totalPigs} 
          icon={<PiggyBank className="text-emerald-600" size={24} />} 
          bg="bg-emerald-50"
        />
        <StatCard 
          title="已认养" 
          value={stats.adoptedPigs} 
          icon={<Activity className="text-blue-600" size={24} />} 
          bg="bg-blue-50"
        />
        <StatCard 
          title="总用户数" 
          value={stats.totalUsers} 
          icon={<Users className="text-purple-600" size={24} />} 
          bg="bg-purple-50"
        />
        <StatCard 
          title="待处理投喂" 
          value={stats.pendingFeed} 
          icon={<ShoppingCart className="text-orange-600" size={24} />} 
          bg="bg-orange-50"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4">近期活动</h2>
        <div className="text-gray-500 text-sm">暂无近期活动日志。</div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg }: { title: string, value: number, icon: React.ReactNode, bg: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
