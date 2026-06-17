import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, User, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Visual (Same as Login or slightly different) */}
      <div className="hidden lg:flex relative bg-primary-800 overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=1905&auto=format&fit=crop" className="w-full h-full object-cover" alt="background" />
        </div>
        <div className="relative z-10 text-white text-center max-w-lg">
          <div className="w-24 h-24 bg-white/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 backdrop-blur-xl border border-white/20">
             <Sparkles size={48} className="text-primary-300" />
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tighter">Join the Green Revolution</h1>
          <p className="text-xl text-white/70 leading-relaxed">Create an account and start monitoring your plant's health with professional-grade tools.</p>
        </div>
        <div className="absolute -top-40 -right-20 w-96 h-96 bg-primary-400/20 rounded-full blur-[100px]" />
      </div>

      {/* Right side - Form */}
      <div className="bg-gray-50 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50">
            <div className="flex items-center gap-2 mb-8">
               <Leaf className="text-primary-600" size={24} fill="currentColor" />
               <span className="font-black text-gray-900 uppercase tracking-widest text-sm">PlantCare AI</span>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-2">Get Started</h2>
            <p className="text-gray-500 mb-10">Care for your plants like a pro.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                    type="text" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-300 font-medium"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                    type="email" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-300 font-medium"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="password" 
                      required
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-300 text-sm font-medium"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="password" 
                      required
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-300 text-sm font-medium"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 rounded-2xl shadow-xl shadow-primary-200 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-500">Already a member? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
