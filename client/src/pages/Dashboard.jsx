import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Droplet, Thermometer, Sun, Calendar, AlertCircle, RefreshCw, Leaf, BarChart3, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PlantCard = ({ plant, onRefresh }) => {
  const isOverdue = new Date(plant.nextWateringDate) < new Date();
  
  const updateWatering = async () => {
    try {
      await axios.put(`/api/plants/${plant._id}`, { lastWateredDate: new Date() });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card group"
    >
      <div className="relative h-48 sm:h-56">
        <img 
          src={plant.image.startsWith('http') ? plant.image : plant.image.startsWith('/') ? plant.image : `/uploads/${plant.image}`} 
          alt={plant.plantName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={clsx(
            "px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm",
            plant.healthStatus === 'Healthy' ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
          )}>
            {plant.healthStatus}
          </span>
        </div>
        {isOverdue && (
          <div className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full animate-bounce shadow-lg">
            <Droplet size={16} fill="white" />
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors uppercase">{plant.plantName}</h3>
            <p className="text-sm text-gray-500 italic">{plant.species}</p>
          </div>
          <Link 
            to={`/update-plant/${plant._id}`}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Edit Plant"
          >
            <Edit2 size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sun size={14} className="text-orange-400" />
            <span>{plant.sunlightRequirement} Sun</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={14} className="text-blue-400" />
            <span>Every {plant.wateringFrequency}d</span>
          </div>
        </div>

        <div className={clsx(
          "p-3 rounded-xl mb-4 flex items-center justify-between",
          isOverdue ? "bg-red-50" : "bg-primary-50"
        )}>
          <div className="flex items-center gap-2">
            <Droplet size={18} className={isOverdue ? "text-red-500" : "text-primary-600"} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500">Next Water</span>
              <span className={clsx("text-sm font-bold", isOverdue ? "text-red-600" : "text-primary-800")}>
                {new Date(plant.nextWateringDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button 
            onClick={updateWatering}
            className={clsx(
              "p-2 rounded-lg transition-all active:scale-90",
              isOverdue ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary-600 text-white hover:bg-primary-700"
            )}
            title="Watered Today"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [stats, setStats] = useState({ total: 0, healthy: 0, sick: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const fetchDashboardData = async () => {
    try {
      const [plantsRes, statsRes] = await Promise.all([
        axios.get('/api/plants'),
        axios.get('/api/plants/stats')
      ]);
      setPlants(plantsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredPlants = plants.filter(p => 
    (p.plantName.toLowerCase().includes(search.toLowerCase()) || p.species.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'All' || p.healthStatus === filter)
  );

  if (loading) return <div className="animate-pulse flex space-x-4">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Your <span className="text-primary-600 underline underline-offset-4 decoration-primary-200">Green Space</span></h1>
          <p className="text-gray-500">Managing {stats.total} botanical companions with love.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search plants..." 
              className="pl-10 pr-4 py-3 bg-white border-0 shadow-sm rounded-2xl w-full sm:w-64 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="appearance-none bg-white border-0 shadow-sm rounded-2xl px-5 py-3 pr-10 focus:ring-2 focus:ring-primary-500 outline-none font-medium text-gray-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Healthy</option>
              <option>Sick</option>
              <option>Struggling</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Plants', value: stats.total, color: 'bg-blue-500', icon: Leaf },
          { label: 'Healthy', value: stats.healthy, color: 'bg-green-500', icon: Sun },
          { label: 'Needs Care', value: stats.sick, color: 'bg-orange-500', icon: Droplet },
          { label: 'Completion', value: '92%', color: 'bg-purple-500', icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-5 border-0 shadow-sm hover:shadow-lg">
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-${stat.color.split('-')[1]}-100`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredPlants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 italic text-gray-400">
          No plants found matching your search. Time to add some?
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPlants.map(plant => (
            <PlantCard key={plant._id} plant={plant} onRefresh={fetchDashboardData} />
          ))}
        </div>
      )}
    </div>
  );
};

// Simple utility for Tailwind classes
function clsx(...args) {
  return args.filter(Boolean).join(' ');
}

export default Dashboard;
