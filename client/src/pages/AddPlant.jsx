import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, ArrowLeft, Loader2, Thermometer, Sun, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

const AddPlant = () => {
  const [formData, setFormData] = useState({
    plantName: '',
    species: '',
    wateringFrequency: 7,
    sunlightRequirement: 'Medium',
    notes: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await axios.post('/api/plants', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-8 transition-colors font-medium group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Add a <span className="text-primary-600">New Friend</span></h1>
          <p className="text-gray-500 mb-10">Let's set up the care schedule for your new botanical addition.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Plant Name</label>
              <input 
                required
                className="input text-lg"
                placeholder="e.g. Bella, Monstera Deliciosa"
                value={formData.plantName}
                onChange={e => setFormData({...formData, plantName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Species</label>
              <input 
                required
                className="input"
                placeholder="e.g. Fiddle Leaf Fig"
                value={formData.species}
                onChange={e => setFormData({...formData, species: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Watering Frequency</label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500" size={18} />
                  <input 
                    type="number"
                    className="input pl-10"
                    placeholder="Days"
                    value={formData.wateringFrequency}
                    onChange={e => setFormData({...formData, wateringFrequency: e.target.value})}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Days</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Sunlight</label>
                <div className="relative">
                  <Sun className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                  <select 
                    className="input pl-10 appearance-none bg-white"
                    value={formData.sunlightRequirement}
                    onChange={e => setFormData({...formData, sunlightRequirement: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Care Notes</label>
              <textarea 
                className="input min-h-[100px] resize-none"
                placeholder="Any special instructions or character quirks?"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            {error && <p className="text-red-500 font-medium text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

            <button 
              disabled={loading}
              className="btn btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg shadow-xl shadow-primary-200"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Saving...' : 'Add Plant'}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full aspect-[4/5] max-w-sm card bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative group cursor-pointer overflow-hidden p-2">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="flex flex-col items-center text-gray-400 group-hover:text-primary-500 transition-colors">
                <Camera size={64} strokeWidth={1} />
                <p className="mt-4 font-bold text-sm uppercase tracking-widest text-center px-6">Upload a photo representing your plant</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                Change Photo
              </div>
            )}
          </div>
          
          <div className="mt-10 w-full max-w-sm space-y-4">
             <div className="card p-4 flex gap-4 items-center bg-blue-50 border-blue-100 italic text-sm text-blue-700">
                <Thermometer className="shrink-0 text-blue-500" />
                <p>Did you know? Consistent watering is key to preventing root rot in most house plants.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlant;
