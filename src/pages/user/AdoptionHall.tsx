import React, { useEffect, useState } from 'react';
import PigCard from '../../components/PigCard';
import { Search } from 'lucide-react';
import { Pig } from '../../types';

export default function AdoptionHall() {
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pigs?status=available')
      .then(res => res.json())
      .then(data => {
        setPigs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">认养大厅</h1>
        <p className="text-gray-500 text-sm">寻找您心仪的小猪，开启云养殖之旅。</p>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="搜索编号或品种..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">加载中...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {pigs.map(pig => (
            <PigCard key={pig.id} pig={pig} />
          ))}
        </div>
      )}
    </div>
  );
}
