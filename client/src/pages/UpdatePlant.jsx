import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Save, ArrowLeft, Loader2, Thermometer, Sun, Droplet, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const UpdatePlant = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    plantName: '',
    species: '',
    wateringFrequency: 7,
    sunlightRequirement: 'Medium',
    notes: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const { data } = await axios.get(`/api/plants/${id}`);
        setFormData({
          plantName: data.plantName,
          species: data.species,
          wateringFrequency: data.wateringFrequency,
          sunlightRequirement: data.sunlightRequirement,
          notes: data.notes || ''
        });
        if (data.image) {
          setPreview(data.image.startsWith('http') ? data.image : data.image.startsWith('/') ? data.image : `/uploads/${data.image}`);
        }
        setLoading(false);
      } catch (err) {
        setError('Could not fetch plant details');
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await axios.put(`/api/plants/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this plant? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/plants/${id}`);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete plant');
      }
    }
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-500" size={48} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-medium group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors font-medium text-sm"
        >
          <Trash2 size={16} />
          Delete Plant
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Update <span className="text-primary-600 font-black">{formData.plantName}</span></h1>
          <p className="text-gray-500 mb-10">Keep your botanical companion's information up to date.</p>

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
                    className="input pl-10 appearance-none bg-white font-medium"
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
              type="submit"
              disabled={saving}
              className="btn btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg shadow-xl shadow-primary-200"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {saving ? 'Saving Changes...' : 'Save Updates'}
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
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
              {preview ? 'Change Photo' : 'Upload Photo'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePlant;
