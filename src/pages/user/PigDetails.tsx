import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { ArrowLeft, Scale, Clock, ShieldCheck, Video } from 'lucide-react';

interface Pig {
  id: number;
  code: string;
  breed: string;
  price: number;
  image_url: string;
  current_weight: number;
  birth_date: string;
  status: string;
  description: string;
  coop_number: string;
}

export default function PigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pig, setPig] = useState<Pig | null>(null);
  const [loading, setLoading] = useState(true);
  const [adopting, setAdopting] = useState(false);

  useEffect(() => {
    fetch(`/api/pigs/${id}`)
      .then(res => res.json())
      .then(data => {
        setPig(data);
        setLoading(false);
      });
  }, [id]);

  const handleAdopt = async () => {
    if (!user) return;
    if (!confirm(`确认支付 ${formatCurrency(pig!.price)} 认养?`)) return;

    setAdopting(true);
    try {
      const res = await fetch('/api/adopt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, pigId: pig!.id }),
      });
      const data = await res.json();
      if (data.success) {
        alert('认养成功!');
        navigate('/app/my-pigs');
      } else {
        alert(data.message || '认养失败');
      }
    } catch (e) {
      alert('网络错误');
    } finally {
      setAdopting(false);
    }
  };

  if (loading || !pig) return <div className="p-8 text-center">加载中...</div>;

  const ageInDays = Math.floor((new Date().getTime() - new Date(pig.birth_date).getTime()) / (1000 * 3600 * 24));

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="relative h-72">
        <img src={pig.image_url} alt={pig.code} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/80 p-2 rounded-full backdrop-blur-sm">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="p-6 -mt-6 bg-white rounded-t-3xl relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pig.code}</h1>
            <p className="text-gray-500">{pig.breed} • {pig.coop_number}</p>
          </div>
          <div className="text-xl font-bold text-emerald-600">
            {formatCurrency(pig.price)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 p-3 rounded-xl text-center">
            <Scale className="mx-auto text-emerald-600 mb-1" size={20} />
            <div className="text-xs text-gray-500">体重</div>
            <div className="font-bold text-gray-900">{pig.current_weight}公斤</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-center">
            <Clock className="mx-auto text-blue-600 mb-1" size={20} />
            <div className="text-xs text-gray-500">日龄</div>
            <div className="font-bold text-gray-900">{ageInDays}天</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl text-center">
            <ShieldCheck className="mx-auto text-purple-600 mb-1" size={20} />
            <div className="text-xs text-gray-500">健康状况</div>
            <div className="font-bold text-gray-900">良好</div>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="font-bold text-gray-900 mb-2">关于小猪</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {pig.description} 本猪只在我们的智慧农场精心饲养，享受24小时监控与有机饲料。
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-2">实时监控</h3>
            <div className="bg-black rounded-xl aspect-video flex items-center justify-center text-white/50">
              <div className="text-center">
                <Video className="mx-auto mb-2" size={32} />
                <p className="text-sm">认养后可查看实时监控</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 pb-safe">
        <button 
          onClick={handleAdopt}
          disabled={adopting || pig.status !== 'available'}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adopting ? '处理中...' : '立即认养'}
        </button>
      </div>
    </div>
  );
}
