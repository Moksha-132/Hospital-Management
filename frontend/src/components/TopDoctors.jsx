import React, { useState, useEffect } from 'react';
import { Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/doctors`)
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error(err));
  }, []);

  const scrollLeft = () => {
    document.getElementById('doctors-scroll-container').scrollBy({ left: -324, behavior: 'smooth' });
  };

  const scrollRight = () => {
    document.getElementById('doctors-scroll-container').scrollBy({ left: 324, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-slate-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-2 block">Top Specialists</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Doctors</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={scrollLeft} className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
            <ChevronLeft size={24} />
          </button>
          <button onClick={scrollRight} className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pl-6">
        <div id="doctors-scroll-container" className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {Array.isArray(doctors) && doctors.length > 0 ? (
            doctors.map((doc) => (
              <div key={doc.id} className="min-w-[300px] max-w-[300px] bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 snap-start flex-shrink-0 group hover:-translate-y-2 transition-transform duration-300">
                <div className="relative mb-6">
                  <img src={localStorage.getItem('doctorAvatar') || `https://ui-avatars.com/api/?name=Dr+${doc.user?.full_name}&background=eff6ff&color=1d4ed8&size=150`} alt={doc.user?.full_name} className="w-24 h-24 rounded-2xl object-cover shadow-md mx-auto group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" /> 4.9
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Dr. {doc.user?.full_name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{doc.specialty}</p>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">{doc.bio || "Dedicated professional providing top quality healthcare services."}</p>
                  <button onClick={() => navigate('/login')} className="w-full bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 font-bold py-3 rounded-xl transition-colors">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-10 text-slate-500 font-medium">
              No doctors available at the moment. Please check back later.
            </div>
          )}
          {/* Empty space block for scroll padding */}
          <div className="min-w-[24px] flex-shrink-0"></div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        #doctors-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
};

export default TopDoctors;

