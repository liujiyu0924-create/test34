import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../../lib/utils';
import { Plus, Edit, Trash } from 'lucide-react';

interface Pig {
  id: number;
  code: string;
  breed: string;
  price: number;
  status: string;
  current_weight: number;
}

export default function PigManagement() {
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pigs')
      .then(res => res.json())
      .then(data => {
        setPigs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">猪只管理</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition">
          <Plus size={20} />
          添加猪只
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-500">ID</th>
              <th className="p-4 font-medium text-gray-500">编号</th>
              <th className="p-4 font-medium text-gray-500">品种</th>
              <th className="p-4 font-medium text-gray-500">体重</th>
              <th className="p-4 font-medium text-gray-500">价格</th>
              <th className="p-4 font-medium text-gray-500">状态</th>
              <th className="p-4 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">加载中...</td></tr>
            ) : pigs.map(pig => (
              <tr key={pig.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 text-gray-900">#{pig.id}</td>
                <td className="p-4 font-medium text-gray-900">{pig.code}</td>
                <td className="p-4 text-gray-600">{pig.breed}</td>
                <td className="p-4 text-gray-600">{pig.current_weight}公斤</td>
                <td className="p-4 text-gray-600">{formatCurrency(pig.price)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pig.status === 'available' ? 'bg-green-100 text-green-800' :
                    pig.status === 'adopted' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pig.status === 'available' ? '可认养' : pig.status === 'adopted' ? '已认养' : pig.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
