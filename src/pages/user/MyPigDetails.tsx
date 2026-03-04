import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Video, Activity, ShoppingBag, Calendar } from 'lucide-react';

interface Pig {
  id: number;
  code: string;
  breed: string;
  image_url: string;
  current_weight: number;
  status: string;
  coop_number: string;
}

interface Log {
  id: number;
  date: string;
  type: string;
  value: string;
  notes: string;
}

export default function MyPigDetails() {
  const { id } = useParams();
  const [pig, setPig] = useState<Pig | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/pigs/${id}`).then(res => res.json()),
      fetch(`/api/logs/${id}`).then(res => res.json())
    ]).then(([pigData, logsData]) => {
      setPig(pigData);
      setLogs(logsData);
      setLoading(false);
    });
  }, [id]);

  if (loading || !pig) return <div className="p-8 text-center">加载中...</div>;

  // Process logs for chart
  const weightData = logs
    .filter(l => l.type === 'weight')
    .map(l => ({ date: new Date(l.date).toLocaleDateString(), weight: parseFloat(l.value) }))
    .reverse();

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <Link to="/app/my-pigs" className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-lg">{pig.code} 监控面板</h1>
      </div>

      {/* Live Video */}
      <div className="bg-black aspect-video relative">
        <div className="absolute inset-0 flex items-center justify-center text-white/50 flex-col">
          <Video size={48} className="mb-2" />
          <p>实时监控: {pig.coop_number}号舍</p>
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/80 px-2 py-1 rounded text-xs text-white">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            直播中
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/app/feed" className="bg-emerald-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-700">
            <ShoppingBag size={20} />
            <span>立即投喂</span>
          </Link>
          <button 
            onClick={() => alert('功能开发中...')}
            className="bg-white text-gray-700 p-4 rounded-xl flex items-center justify-center gap-2 shadow-sm border border-gray-200"
          >
            <Activity size={20} />
            <span>健康检查</span>
          </button>
        </div>

        {/* Growth Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">生长曲线</h3>
          <div className="h-64 w-full">
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} unit="kg" />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                暂无生长数据
              </div>
            )}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-bold text-gray-900">近期动态</div>
          <div className="divide-y divide-gray-100">
            {logs.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">暂无记录</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="p-4 flex gap-4">
                  <div className={`p-2 rounded-lg h-fit ${
                    log.type === 'weight' ? 'bg-blue-50 text-blue-600' :
                    log.type === 'health' ? 'bg-red-50 text-red-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {log.type === 'weight' ? <Activity size={16} /> : <Calendar size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {log.type === 'weight' ? '称重' : log.type === 'health' ? '健康检查' : log.type === 'feed' ? '投喂' : log.type}: {log.value}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(log.date).toLocaleString()}</p>
                    {log.notes && <p className="text-xs text-gray-400 mt-1">{log.notes}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
