import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { ShoppingBag, Check } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight_kg: number;
  image_url: string;
}

interface MyPig {
  id: number;
  code: string;
}

export default function FeedStore() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [myPigs, setMyPigs] = useState<MyPig[]>([]);
  const [selectedPigId, setSelectedPigId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/feed-products').then(res => res.json()),
      user ? fetch(`/api/my-pigs?userId=${user.id}`).then(res => res.json()) : Promise.resolve([])
    ]).then(([productsData, pigsData]) => {
      setProducts(productsData);
      setMyPigs(pigsData);
      if (pigsData.length > 0) setSelectedPigId(pigsData[0].id);
      setLoading(false);
    });
  }, [user]);

  const handleBuy = async (product: Product) => {
    if (!selectedPigId) return alert('请选择要投喂的小猪。');
    if (!confirm(`确认支付 ${formatCurrency(product.price)} 购买 ${product.name}?`)) return;

    setBuying(true);
    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, pigId: selectedPigId, productId: product.id }),
      });
      const data = await res.json();
      if (data.success) {
        alert('订单已提交！工作人员将尽快为您投喂。');
      } else {
        alert(data.message || '购买失败');
      }
    } catch (e) {
      alert('网络错误');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="p-8 text-center">加载中...</div>;

  return (
    <div className="p-4 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">饲料商店</h1>
        <p className="text-gray-500 text-sm">为您的爱猪提供营养套餐。</p>
      </header>

      {myPigs.length > 0 ? (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">投喂对象:</label>
          <select 
            value={selectedPigId} 
            onChange={(e) => setSelectedPigId(Number(e.target.value))}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {myPigs.map(pig => (
              <option key={pig.id} value={pig.id}>{pig.code}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-6 bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm">
          您需要先认养一只小猪才能购买饲料。
        </div>
      )}

      <div className="grid gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
            <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{product.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-emerald-600">{formatCurrency(product.price)}</span>
                <button 
                  onClick={() => handleBuy(product)}
                  disabled={buying || myPigs.length === 0}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  购买
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
