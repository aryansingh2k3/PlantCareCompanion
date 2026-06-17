import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { Calendar, Activity, TrendingUp, Info } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Analytics = () => {
  const [stats, setStats] = useState({ total: 0, healthy: 0, sick: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/plants/stats');
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const healthData = {
    labels: ['Healthy', 'Needs Attention'],
    datasets: [
      {
        data: [stats.healthy, stats.sick],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 4,
      },
    ],
  };

  const activityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Watering Completion %',
        data: [65, 78, 90, 85, 95, 92],
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">Garden <span className="text-primary-600">Analytics</span></h1>
        <p className="text-gray-500">Deeper insights into your plant care patterns and success rates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1 card p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-8 border-b w-full pb-4">Health Distribution</h3>
          <div className="w-full aspect-square relative">
            <Pie 
              data={healthData} 
              options={{ 
                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { weight: 'bold' } } } },
                cutout: '70%'
              }} 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
              <span className="text-4xl font-black text-gray-900">{stats.total}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plants</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card p-8">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h3 className="text-xl font-bold text-gray-900">Care Consistency</h3>
            <div className="flex gap-2 text-xs font-bold bg-gray-50 p-1.5 rounded-lg text-gray-400 uppercase">
              <span className="bg-white px-2 py-1 rounded shadow-sm text-primary-600">By Month</span>
              <span className="px-2 py-1">By Week</span>
            </div>
          </div>
          <div className="h-[300px]">
             <Line 
               data={activityData} 
               options={{
                 responsive: true,
                 maintainAspectRatio: false,
                 scales: {
                   y: { beginAtZero: true, max: 100, grid: { display: false } },
                   x: { grid: { display: false } }
                 },
                 plugins: { legend: { display: false } }
               }} 
             />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: TrendingUp, title: 'Growth Rate', value: '+12%', desc: 'Versus last month', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Activity, title: 'Avg Vitality', value: '88/100', desc: 'Overall garden health', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Calendar, title: 'Next Milestone', value: '4 Plants', desc: 'Watering due tomorrow', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((item, i) => (
          <div key={i} className="card p-6 border-0 shadow-sm">
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
              <item.icon size={24} />
            </div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{item.title}</h4>
            <p className="text-3xl font-black text-gray-900 mb-2">{item.value}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 italic"><Info size={12} /> {item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
