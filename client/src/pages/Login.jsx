import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Visual */}
      <div className="hidden lg:flex relative bg-primary-900 overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1466781783364-391e6e6dc207?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="background" />
        </div>
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/50">
                <Leaf size={40} fill="currentColor" />
             </div>
             <h1 className="text-5xl font-black tracking-tighter">PlantCare <span className="text-primary-400">AI</span></h1>
          </div>
          <h2 className="text-3xl font-bold mb-6 leading-tight">Elevate your plant parenting with <span className="text-primary-300 italic">artificial intelligence.</span></h2>
          <div className="space-y-6">
             <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                   <ArrowRight size={20} className="text-primary-400" />
                </div>
                <p className="text-lg text-white/80">Smart watering schedules based on species needs.</p>
             </div>
             <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                   <ArrowRight size={20} className="text-primary-400" />
                </div>
                <p className="text-lg text-white/80">AI-powered disease detection via leaf scanning.</p>
             </div>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
      </div>

      {/* Right side - Form */}
      <div className="bg-gray-50 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
             <Leaf className="text-primary-600" size={32} fill="currentColor" />
             <span className="text-2xl font-black text-gray-900">PlantCare AI</span>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-10">Sign in to check on your botanical family.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                    type="email" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-300 font-medium"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                    type="password" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-300 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 rounded-2xl shadow-xl shadow-primary-200 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-500">Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Register Now</Link></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
