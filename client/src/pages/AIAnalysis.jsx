import { useState } from 'react';
import axios from 'axios';
import { Camera, Search, Loader2, CheckCircle2, AlertCircle, Info, Stethoscope, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAnalysis = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const analyzeLeaf = async () => {
    if (!image) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const { data } = await axios.post('/api/ai/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with AI Doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-primary-600 animate-pulse" size={32} />
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">AI Plant <span className="text-primary-600">Doctor</span></h1>
          </div>
          <p className="text-gray-500 text-lg leading-relaxed">
            Upload a clear photo of a leaf to identify diseases and receive professional care recommendations powered by Google Gemini.
          </p>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-xl shadow-primary-100 max-w-sm">
          <div className="flex gap-4 items-center">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
              <Info size={24} />
            </div>
            <div>
              <p className="font-bold text-lg">Pro Tip</p>
              <p className="text-white/80 text-sm italic">Ensure good lighting and avoid blurry shots for 99% accuracy.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="relative group">
            <div className={clsx(
              "card aspect-square flex flex-col items-center justify-center p-4 border-2 border-dashed transition-all relative overflow-hidden",
              preview ? "border-primary-200" : "border-gray-200 hover:border-primary-400"
            )}>
              {preview ? (
                <img src={preview} alt="Leaf preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera size={40} />
                  </div>
                  <p className="font-bold text-gray-900 mb-1 uppercase tracking-tight">Click to Upload</p>
                  <p className="text-xs text-gray-400">supports JPG, PNG up to 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleImageChange}
              />
            </div>
          </div>

          <button 
            onClick={analyzeLeaf}
            disabled={!image || loading}
            className="btn btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg shadow-xl shadow-primary-100 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Stethoscope size={24} />}
            <span>{loading ? 'Analyzing with Gemini...' : 'Start Diagnosis'}</span>
          </button>

          {error && <div className="card p-4 bg-red-50 border-red-100 text-red-600 flex gap-3 text-sm font-medium"><AlertCircle size={20} className="shrink-0" /> {error}</div>}
        </div>

        {/* Results Section */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-10 bg-white rounded-3xl border-2 border-dashed border-gray-100"
              >
                <div className="p-6 bg-gray-50 rounded-full mb-6">
                  <Search size={48} className="text-gray-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-400">Upload an image to see details</h3>
                <p className="text-sm text-gray-400 max-w-xs mt-2">The diagnosis report including disease info and remedies will appear here.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-10"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-primary-600 animate-pulse" />
                  </div>
                </div>
                <h3 className="mt-8 text-xl font-bold text-gray-900 tracking-tight">Consulting AI Specialized Database</h3>
                <p className="text-primary-600 font-medium animate-pulse mt-1 italic font-serif">Scanning cellular patterns...</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="card p-8 border-l-8 border-l-primary-600 bg-white">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-2 block w-fit">Diagnosis Report</span>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">{result.plantName}</h2>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-400 mb-1">CONFIDENCE</div>
                      <div className="text-2xl font-black text-primary-600">
                        {result.confidenceScore < 1 ? (result.confidenceScore * 100).toFixed(0) : result.confidenceScore}%
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-red-500 mb-2">
                      {result.disease === 'Healthy' ? <CheckCircle2 className="text-green-500" /> : <AlertCircle />}
                      <span className={clsx("text-xl font-bold", result.disease === 'Healthy' ? "text-green-600" : "text-red-600")}>
                        {result.disease}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                       <CheckCircle2 size={18} className="text-primary-500" />
                       Treatment Suggestions
                    </h4>
                    <ul className="space-y-3">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-3 text-gray-600 text-sm leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => {setResult(null); setPreview(null); setImage(null)}} className="btn btn-outline flex-1 py-4">New Scan</button>
                  <button className="btn btn-primary flex-1 py-4">Add to Logs</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

function clsx(...args) {
  return args.filter(Boolean).join(' ');
}

export default AIAnalysis;
