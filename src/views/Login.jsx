import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// SUSTITUIR POR TU URL REAL
const API_URL = "https://script.google.com/macros/s/AKfycbyT9lQsUA7EWgS3hNXXTooLnbGgJJ1YJ6Z0OIDTeDFEfSoCTCEdAYJYwH2va5k3y0ir/exec";

export default function Login() {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadStep, setLoadStep] = useState(0); // Para los mensajes dinámicos
  const navigate = useNavigate();

  // Mensajes para dar contexto al padre de familia
  const loadingMessages = [
    "Conectando con Sede Tacna",
    "Consultando Sede Calle Lima",
    "Sincronizando historial",
    "Generando reporte seguro"
  ];

  // Efecto para rotar mensajes mientras carga
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1200); // Cambia cada 1.2 segundos
    } else {
      setLoadStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAccess = async (e) => {
    e.preventDefault();
    if (dni.length !== 8) return setError("El DNI debe tener 8 dígitos.");
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}?dni=${dni}`);
      if (!response.data.error) {
        navigate('/portal', { state: { studentData: response.data } });
      } else {
        setError(response.data.mensaje || "DNI no encontrado en nuestra base de datos.");
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
        
        {/* LOGO CON EFECTO SUTIL */}
        <div className="flex justify-center mb-8">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCtppI9KmgCyQh7nes0N5OE2t68oTTR3t8Og&s" 
            alt="Barnard Logo" 
            className={`h-20 transition-all duration-700 ${loading ? 'grayscale blur-[1px] opacity-50 scale-95' : ''}`} 
          />
        </div>

        <h2 className="text-3xl font-serif text-slate-900 mb-2 italic font-bold">Bienvenido</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-12 italic">Portal Académico</p>

        <form onSubmit={handleAccess} className="space-y-10 text-left">
          <div className="relative group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 ml-1">
              DNI del Alumno
            </label>
            <input 
              type="text" 
              maxLength="8"
              disabled={loading}
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
              placeholder="•••• ••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-4 text-2xl font-medium text-center tracking-[0.4em] outline-none focus:border-brand-amber transition-all disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
              <p className="text-red-500 text-[9px] font-bold uppercase text-center tracking-tight">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-500 flex items-center justify-center gap-2
              ${loading 
                ? 'bg-slate-800 text-slate-300 cursor-wait pulse-subtle' 
                : 'bg-brand-blue text-white hover:bg-slate-800 active:scale-95'
              }`}
          >
            {loading ? (
              <>
                <span>{loadingMessages[loadStep]}</span>
                <span className="loading-dots w-4 text-left"></span>
              </>
            ) : (
              "Ingresar al Sistema"
            )}
          </button>
        </form>

        <div className="mt-12 space-y-2">
          <p className="text-[9px] text-slate-300 font-medium uppercase tracking-widest italic">Seguridad de Datos Encriptada</p>
          <div className="w-12 h-1 bg-slate-50 mx-auto rounded-full"></div>
        </div>
      </div>
    </div>
  );
}