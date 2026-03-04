import React from 'react';
import { Video, AlertCircle } from 'lucide-react';

export default function CameraManagement() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">监控管理</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition">
          <Video size={20} />
          添加摄像头
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <Video size={48} className="text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无监控设备</h3>
        <p className="text-gray-500 mb-6">您还没有添加任何监控摄像头。</p>
        <button className="text-emerald-600 hover:text-emerald-700 font-medium">
          配置监控系统
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for camera cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 opacity-60">
            <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
              <AlertCircle className="text-gray-600" size={32} />
              <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">离线</span>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900">摄像头 #{i}</h4>
              <p className="text-sm text-gray-500">位置: 猪舍 A-{i}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
