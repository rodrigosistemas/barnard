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
    HiArrowRight
} from "react-icons/hi";

export default function Portal() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const data = state?.studentData;

    // --- ESTADOS ---
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Control del Menú Lateral
    const [activeFilter, setActiveFilter] = useState('week');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    // --- LÓGICA DE FILTRADO ---
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

    if (!data) return <div className="min-h-screen flex items-center justify-center font-serif italic text-slate-400">Cargando...</div>;

    const lastRecord = data.asistencias[0] || null;

    return (
        <div className="min-h-screen bg-[#F8F9FB] pb-20 animate-stamp relative overflow-x-hidden">

            {/* --- MENÚ LATERAL COMPACTO --- */}
            <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop con desenfoque suave */}
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" onClick={() => setIsMenuOpen(false)}></div>

                {/* Cuerpo del Sidebar: Ajustado a h-screen y w-72 (más delgado) */}
                <div className={`absolute left-0 top-0 h-screen w-72 bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                    {/* 1. Header: Padding reducido de 8 a 5 */}
                    <div className="p-5 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Menú Principal</span>
                        <button onClick={() => setIsMenuOpen(false)} className="p-1.5 hover:bg-white rounded-lg text-slate-400 shadow-sm transition-all">
                            <HiX size={18} />
                        </button>
                    </div>

                    {/* 2. Navegación: Spacing comprimido */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 text-slate-700 font-semibold text-xs transition-all hover:bg-slate-50 hover:border-brand-amber group">
                            <div className="w-8 h-8 rounded-lg bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                                <HiOutlineClock size={18} />
                            </div>
                            <span>Asistencia y Puntualidad</span>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-amber"></div>
                            </div>
                        </button>
                    </nav>

                    {/* 3. Footer: Ajustado al borde inferior con padding mínimo */}
                    <div className="p-5 border-t border-slate-50">
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Sesión Académica</p>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    navigate('/');
                                }}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
                            >
                                <HiLogout size={16} /> Salir del Portal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- HEADER --- */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-200 hover:shadow-md transition-all group"
                    >
                        <HiMenu className="text-slate-600" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Menú</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block italic">Academia Barnard</span>
                        <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-serif font-bold text-lg shadow-md border-2 border-white">
                            {data.nombre.charAt(0)}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 md:p-12">
                {/* ... Resto de las tarjetas (Estudiante, Último Registro, Filtros) ... */}
                {/* (Mantener el código anterior de la tarjeta de identidad y el historial de asistencia) */}

                {/* Card del Estudiante */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50 relative overflow-hidden text-left">
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Estudiante</p>
                            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-8 italic uppercase tracking-tight">{data.nombre}</h1>
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
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

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-8 italic">Último Registro</p>
                        {lastRecord ? (
                            <>
                                <div className="mb-8">
                                    <span className="text-7xl font-serif text-brand-blue tracking-tighter">{lastRecord.hora.split(' ')[0]}</span>
                                    <span className="text-sm font-bold text-slate-400 ml-2 uppercase tracking-widest">{lastRecord.hora.split(' ')[1]}</span>
                                    <p className="text-[10px] text-slate-400 mt-3 font-semibold tracking-widest bg-slate-50 py-1 rounded-full uppercase">{lastRecord.fecha}</p>
                                </div>
                                <div className="px-8 py-2.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <HiOutlineClock /> REGISTRADO
                                </div>
                            </>
                        ) : <p className="text-slate-300 text-xs italic">Sin actividad</p>}
                    </div>
                </div>

                {/* Filtros e Historial */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <h3 className="text-2xl font-serif italic text-slate-800">Historial de Asistencia</h3>
                    <div className="bg-white p-1.5 rounded-full shadow-md border border-slate-100 flex items-center gap-1">
                        <button onClick={() => setActiveFilter('week')} className={`px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${activeFilter === 'week' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-400'}`}>Semana</button>
                        <button onClick={() => setActiveFilter('all')} className={`px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${activeFilter === 'all' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-400'}`}>Todo</button>
                        <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
                        <div className="relative flex items-center pr-4">
                            <select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setActiveFilter('month'); }} className={`bg-transparent text-[9px] font-bold uppercase tracking-widest outline-none pr-4 ${activeFilter === 'month' ? 'text-brand-blue' : 'text-slate-400'}`}>
                                {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((m, i) => (
                                    <option key={i} value={i}>{m}</option>
                                ))}
                            </select>
                            <HiChevronDown className="absolute right-0 text-slate-400 pointer-events-none" size={12} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 max-w-5xl mx-auto">
                    {filteredAsistencias.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 md:p-8 rounded-[1.8rem] border border-slate-50 flex items-center justify-between hover:shadow-xl transition-all border-l-4 border-l-transparent hover:border-l-brand-amber group">
                            <div className="flex items-center gap-8">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-brand-amber transition-all">
                                    <HiOutlineClock size={28} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">{item.fecha}</p>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase mt-1.5 tracking-widest">Ingreso Campus</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-serif text-slate-700 tracking-tight">{item.hora}</p>
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase mt-2 inline-block">Asistido</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}