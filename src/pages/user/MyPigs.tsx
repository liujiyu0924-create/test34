import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { Calendar, Scale } from 'lucide-react';

interface MyPig {
  id: number;
  code: string;
  breed: string;
  image_url: string;
  current_weight: number;
  adoption_date: string;
  status: string;
}

export default function MyPigs() {
  const { user } = useAuth();
  const [pigs, setPigs] = useState<MyPig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/my-pigs?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setPigs(data);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center">加载中...</div>;

  return (
    <div className="p-4 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的农场</h1>
        <p className="text-gray-500 text-sm">管理您认养的小猪。</p>
      </header>

      {pigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 mb-4">您还没有认养任何小猪。</p>
          <Link to="/app" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">
            去认养一只
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pigs.map(pig => (
            <Link key={pig.id} to={`/app/my-pigs/${pig.id}`} className="flex bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <img src={pig.image_url} alt={pig.code} className="w-24 h-24 object-cover rounded-lg mr-4" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">{pig.code}</h3>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full capitalize">{pig.status === 'adopted' ? '已认养' : pig.status}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{pig.breed}</p>
                
                <div className="flex gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Scale size={14} />
                    <span>{pig.current_weight}公斤</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(pig.adoption_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
