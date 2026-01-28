import { useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiOutlineClock, HiOutlineIdentification, HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiLogout } from "react-icons/hi";

export default function Portal() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state?.studentData;

  if (!data) return <div className="p-10 text-center font-serif italic">Sesión no válida...</div>;

  const lastRecord = data.asistencias[0] || null;

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20 animate-stamp">
      {/* Header Estilo Academia */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <button className="flex items-center gap-3 px-5 py-2 rounded-full border border-slate-200 hover:shadow-sm transition-all">
            <HiMenu className="text-slate-600" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Menú</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block italic">Academia</span>
            <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-serif font-bold text-lg shadow-md">
              {data.nombre.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Tarjeta del Estudiante - SEDE MOVIDA AQUÍ */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-10 shadow-xl border border-slate-50 relative overflow-hidden text-left">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Estudiante</p>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-8 italic uppercase tracking-tight">
                {data.nombre}
              </h1>
              
              {/* Cuadrícula de Información de 3 Columnas */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-50">
                <div>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <HiOutlineIdentification /> DNI
                  </p>
                  <p className="text-sm font-bold text-slate-700 font-mono tracking-widest">{data.dni}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <HiOutlineAcademicCap /> Ciclo Actual
                  </p>
                  <p className="text-sm font-bold text-slate-700 uppercase">{data.ciclo}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <HiOutlineOfficeBuilding /> Sede
                  </p>
                  <p className="text-sm font-bold text-slate-700 uppercase">{data.sede}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Último Registro Visual */}
          <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-slate-50 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-8 italic">Último Registro</p>
            {lastRecord ? (
              <>
                <div className="mb-6">
                  <span className="text-6xl font-serif text-brand-blue">{lastRecord.hora.split(' ')[0]}</span>
                  <span className="text-sm font-bold text-slate-400 ml-1 uppercase">{lastRecord.hora.split(' ')[1]}</span>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">{lastRecord.fecha}</p>
                </div>
                <div className="px-6 py-2 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  REGISTRADO
                </div>
              </>
            ) : (
              <p className="text-slate-300 text-xs italic">Sin actividad</p>
            )}
          </div>
        </div>

        {/* Historial de Asistencia Simplificado */}
        <h3 className="text-2xl font-serif italic text-slate-800 mb-10 text-left">Historial de Asistencia</h3>
        
        <div className="space-y-4 max-w-4xl">
          {data.asistencias.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-50 flex items-center justify-between hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-brand-amber group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-brand-amber transition-colors">
                  <HiOutlineClock size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">{item.fecha}</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-1">Ingreso Campus</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif text-slate-700 tracking-tight">{item.hora}</p>
                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter">Asistido</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Botón Flotante para Cerrar Sesión */}
      <button 
        onClick={() => navigate('/')} 
        className="fixed bottom-8 right-8 bg-white p-4 rounded-full shadow-2xl border border-slate-100 text-red-500 hover:scale-110 transition-transform z-50"
        title="Cerrar Sesión"
      >
        <HiLogout size={24} />
      </button>
    </div>
  );
}