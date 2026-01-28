import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://script.google.com/macros/s/AKfycbx6zmlH3KJ8KGR-_YnMoHk7fOZ-o_DSuI9wNm4WSPBaI65MQ5qjJSEKuSQ5tfww2k1q/exec";

export default function Login() {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAccess = async (e) => {
    e.preventDefault();
    if (dni.length !== 8) return setError("El DNI debe tener 8 dígitos.");
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}?dni=${dni}`);
      if (!response.data.error) {
        // Navegamos al portal pasando el objeto JSON completo
        navigate('/portal', { state: { studentData: response.data } });
      } else {
        setError(response.data.mensaje || "DNI no encontrado.");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-12 text-center animate-stamp">
        <div className="flex justify-center mb-8">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCtppI9KmgCyQh7nes0N5OE2t68oTTR3t8Og&s" alt="Barnard Logo" className="h-12" />
        </div>
        <h2 className="text-3xl font-serif text-slate-900 mb-2">Bienvenido</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-12 italic">Portal Académico</p>

        <form onSubmit={handleAccess} className="space-y-10 text-left">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 ml-1">DNI del Alumno</label>
            <input 
              type="text" 
              maxLength="8"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
              placeholder="•••• ••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-4 text-2xl font-medium text-center tracking-[0.4em] outline-none focus:border-brand-amber transition-all"
            />
          </div>
          {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}
          <button className="w-full py-5 bg-brand-blue text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
        <p className="text-[9px] text-slate-300 mt-12 font-medium">© 2026 SISTEMA INTEGRAL</p>
      </div>
    </div>
  );
}