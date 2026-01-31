import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    HiMenu,
    HiX,
    HiOutlineClock,
    HiOutlineIdentification,
    HiOutlineAcademicCap,
    HiOutlineOfficeBuilding,
    HiLogout,
    HiChevronDown,
    HiExclamation
} from "react-icons/hi";

export default function Portal() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const data = state?.studentData;

    // --- ESTADOS DE UI ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all'); // Cambiado a 'all' para ver la paginación completa
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    // --- LÓGICA DE FILTRADO LOCAL ---
    const filteredAsistencias = useMemo(() => {
        if (!data?.asistencias) return [];
        return data.asistencias.filter(item => {
            const [day, month, year] = item.fecha.split('-').map(Number);
            const recordDate = new Date(year, month - 1, day);
            const now = new Date();
            if (activeFilter === 'all') return true;
            if (activeFilter === 'week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                return recordDate >= startOfWeek;
            }
            if (activeFilter === 'month') return recordDate.getMonth() === parseInt(selectedMonth);
            return true;
        });
    }, [data, activeFilter, selectedMonth]);

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-serif italic text-slate-400">Verificando credenciales...</p>
        </div>
    );

    const lastRecord = data.asistencias[0] || null;

    // Función auxiliar para colores de estado
    const getStatusStyles = (estado) => {
        if (estado === 'PUNTUAL') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (estado === 'TARDANZA') return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-slate-50 text-slate-500 border-slate-100';
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] pb-20 animate-stamp relative overflow-x-hidden">

            {/* --- MENÚ LATERAL COMPACTO --- */}
            <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" onClick={() => setIsMenuOpen(false)}></div>
                <div className={`absolute left-0 top-0 h-screen w-72 bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-5 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Menú Principal</span>
                        <button onClick={() => setIsMenuOpen(false)} className="p-1.5 hover:bg-white rounded-lg text-slate-400 shadow-sm transition-all">
                            <HiX size={18} />
                        </button>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-brand-amber/20 text-slate-700 font-semibold text-xs transition-all">
                            <div className="w-8 h-8 rounded-lg bg-brand-amber text-white flex items-center justify-center">
                                <HiOutlineClock size={18} />
                            </div>
                            <span>Reporte de Asistencia</span>
                        </button>
                    </nav>
                    <div className="p-5 border-t border-slate-50">
                        <div className="bg-slate-50 rounded-2xl p-4 text-center">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3">Sesión de {data.nombre.split(' ')[0]}</p>
                            <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-red-500 hover:bg-red-50 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all">
                                <HiLogout size={16} /> Salir del Portal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- HEADER --- */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-200 hover:shadow-md transition-all group">
                        <HiMenu className="text-slate-600" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Menú</span>
                    </button>
                    <div className="flex items-center gap-4 text-right">
                        <div className="hidden sm:block">
                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight leading-none mb-1">{data.nombre}</p>
                            <p className="text-[8px] font-bold text-brand-amber uppercase tracking-widest italic">Sello Académico</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-serif font-bold text-lg shadow-md border-2 border-white">
                            {data.nombre.charAt(0)}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 md:p-12">
                
                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    
                    {/* Tarjeta del Estudiante */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50 relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Información del Alumno</p>
                            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-10 italic uppercase tracking-tighter">{data.nombre}</h1>
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5"><HiOutlineIdentification size={14} /> DNI</p>
                                    <p className="text-sm font-bold text-slate-700 font-mono tracking-widest">{data.dni}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5"><HiOutlineAcademicCap size={14} /> Ciclo</p>
                                    <p className="text-sm font-bold text-slate-700 uppercase">{data.ciclo}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5"><HiOutlineOfficeBuilding size={14} /> Sede</p>
                                    <p className="text-sm font-bold text-slate-700 uppercase">{data.sede}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Último Registro Dinámico (AHORA CON ESTADO) */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-10 italic">Último Ingreso</p>
                        {lastRecord ? (
                            <>
                                <div className="mb-8">
                                    <div className="flex items-baseline justify-center">
                                        <span className={`text-7xl font-serif tracking-tighter transition-colors ${lastRecord.estado === 'TARDANZA' ? 'text-amber-500' : 'text-brand-blue'}`}>
                                            {lastRecord.hora.split(' ')[0]}
                                        </span>
                                        <span className="text-sm font-bold text-slate-400 ml-2 uppercase tracking-widest">
                                            {lastRecord.hora.split(' ')[1]}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-3 font-semibold tracking-widest bg-slate-50 py-1 px-4 rounded-full uppercase inline-block">
                                        {lastRecord.fecha}
                                    </p>
                                </div>
                                
                                {/* Etiqueta Dinámica según API V6.0 */}
                                <div className={`px-8 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm ${getStatusStyles(lastRecord.estado)}`}>
                                    {lastRecord.estado === 'TARDANZA' ? <HiExclamation size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
                                    {lastRecord.estado}
                                </div>
                            </>
                        ) : <p className="text-slate-300 text-xs italic">Sin registros en el ciclo</p>}
                    </div>
                </div>

                {/* Filtros e Historial */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <div className="text-left">
                        <h3 className="text-2xl font-serif italic text-slate-800">Historial Reciente</h3>
                        {/* MOSTRANDO PAGINACIÓN: */}
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Mostrando {data.asistencias.length} registros de un total de {data.totalRegistros}
                        </p>
                    </div>

                    <div className="bg-white p-1.5 rounded-full shadow-md border border-slate-100 flex items-center gap-1">
                        <button onClick={() => setActiveFilter('week')} className={`px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${activeFilter === 'week' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-400'}`}>Semana</button>
                        <button onClick={() => setActiveFilter('all')} className={`px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${activeFilter === 'all' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-400'}`}>Todo</button>
                        <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
                        <div className="relative flex items-center pr-4">
                            <select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setActiveFilter('month'); }} className={`bg-transparent text-[9px] font-bold uppercase tracking-widest outline-none pr-4 cursor-pointer ${activeFilter === 'month' ? 'text-brand-blue' : 'text-slate-400'}`}>
                                {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((m, i) => (
                                    <option key={i} value={i} className="text-slate-800 font-sans">{m}</option>
                                ))}
                            </select>
                            <HiChevronDown className="absolute right-0 text-slate-400 pointer-events-none" size={12} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 max-w-5xl mx-auto">
                    {filteredAsistencias.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 md:p-8 rounded-[1.8rem] border border-slate-50 flex items-center justify-between hover:shadow-xl transition-all border-l-4 border-l-transparent hover:border-l-brand-amber group">
                            <div className="flex items-center gap-8 text-left">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${item.estado === 'TARDANZA' ? 'bg-amber-50 text-amber-400 group-hover:bg-amber-100' : 'bg-slate-50 text-slate-300 group-hover:text-emerald-500 group-hover:bg-emerald-50'}`}>
                                    <HiOutlineClock size={28} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">{item.fecha}</p>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase mt-1.5 tracking-widest flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.estado === 'TARDANZA' ? 'bg-amber-300' : 'bg-emerald-300'}`}></span>
                                        Ingreso Sede {data.sede}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-3xl font-serif tracking-tight ${item.estado === 'TARDANZA' ? 'text-amber-600' : 'text-slate-700'}`}>{item.hora}</p>
                                <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase mt-2 inline-block tracking-tighter border ${getStatusStyles(item.estado)}`}>
                                    {item.estado}
                                </span>
                            </div>
                        </div>
                    ))}
                    
                    {/* AVISO DE PAGINACIÓN */}
                    {data.totalRegistros > 30 && (
                        <div className="pt-10 text-center">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] italic mb-4">
                                Mostrando el historial reciente (30 registros)
                            </p>
                            <div className="w-16 h-1 bg-slate-100 mx-auto rounded-full"></div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}