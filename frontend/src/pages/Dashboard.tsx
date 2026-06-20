import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-gray-400">Loading dashboard...</div>;

  const kpis = [
    { title: 'Total Revenue', value: `$${data?.total_revenue?.toLocaleString()}`, icon: DollarSign, color: 'text-white' },
    { title: 'Total Orders', value: data?.total_orders, icon: ShoppingCart, color: 'text-gray-300' },
    { title: 'Total Products', value: data?.total_products, icon: Package, color: 'text-gray-400' },
    { title: 'Total Customers', value: data?.total_customers, icon: Users, color: 'text-gray-500' },
  ];

  // Dummy chart data for UI purposes
  const chartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 8000 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-gray-400 mt-1">Your business metrics at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="card flex items-center p-6">
              <div className={`p-4 rounded-xl bg-white/5 mr-4 ${kpi.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">{kpi.title}</p>
                <p className="text-2xl font-bold mt-1">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">Revenue Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ffffff" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-panel rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Low Stock Alerts</h3>
            <div className="p-2 bg-white/5 rounded-lg text-white">
              <AlertTriangle size={20} />
            </div>
          </div>
          
          <div className="space-y-4">
            {data?.low_stock_products?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Inventory levels are healthy.</p>
            ) : (
              data?.low_stock_products?.map((product: any) => (
                <div key={product.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-400">{product.quantity}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">in stock</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
