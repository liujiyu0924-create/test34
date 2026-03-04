import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { Scale, Clock } from 'lucide-react';
import { Pig } from '../types';

const PigCard: React.FC<{ pig: Pig }> = ({ pig }) => {
  const ageInDays = Math.floor((new Date().getTime() - new Date(pig.birth_date).getTime()) / (1000 * 3600 * 24));

  return (
    <Link to={`/app/pigs/${pig.id}`} className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="aspect-square relative">
        <img src={pig.image_url} alt={pig.code} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
          {pig.breed}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900">{pig.code}</h3>
          <span className="text-emerald-600 font-bold">{formatCurrency(pig.price)}</span>
        </div>
        
        <div className="flex gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Scale size={14} />
            <span>{pig.current_weight}公斤</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{ageInDays}天</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PigCard;
