import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserCheck, Stethoscope, Video, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-20 lg:pt-32 lg:pb-28 relative overflow-hidden bg-[#F4F9FF]">
      
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mt-8">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#1E3A8A] tracking-tight leading-[1.1] mb-6">
                Transforming <br />
                Hospital Management
              </h1>
              
              <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                Our platform provides transformative services so you can focus on what matters most. 
                Elevate your clinical programs to create a sustainable impact.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/register">
                  <button className="bg-[#FF6B00] hover:bg-[#E56000] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1">
                    Book Appointment
                  </button>
                </Link>
              </div>

              {/* Floating Menu in text section */}
              <div className="bg-[#1E40AF] rounded-2xl p-6 text-white w-full max-w-sm shadow-2xl relative">
                <div className="flex gap-4 items-center mb-6 border-b border-blue-400/30 pb-4">
                  <div className="bg-blue-500/30 p-4 rounded-xl">
                    <span className="text-3xl font-black">99%</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Satisfaction Rate</h4>
                    <p className="text-blue-200 text-sm">Reliable & trusted platform</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button className="flex items-center justify-between w-full hover:bg-blue-700/50 p-2 rounded-lg transition-colors group">
                    <div className="flex items-center gap-3">
                      <Search className="text-blue-300" size={20} />
                      <span className="font-medium text-sm">Search For Doctors</span>
                    </div>
                    <ChevronRight size={16} className="text-blue-400 group-hover:text-white" />
                  </button>
                  <button className="flex items-center justify-between w-full hover:bg-blue-700/50 p-2 rounded-lg transition-colors group">
                    <div className="flex items-center gap-3">
                      <UserCheck className="text-blue-300" size={20} />
                      <span className="font-medium text-sm">Find The Best Specialist</span>
                    </div>
                    <ChevronRight size={16} className="text-blue-400 group-hover:text-white" />
                  </button>
                  <button className="flex items-center justify-between w-full hover:bg-blue-700/50 p-2 rounded-lg transition-colors group">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="text-blue-300" size={20} />
                      <span className="font-medium text-sm">Get Your Solution</span>
                    </div>
                    <ChevronRight size={16} className="text-blue-400 group-hover:text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Graphic / Card */}
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end min-h-[600px]">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md h-full flex items-end justify-center"
            >
              {/* Doctor Image Mockup */}
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop" 
                alt="Doctor" 
                className="relative z-10 w-full object-cover object-top rounded-b-none rounded-t-[100px] border-b-8 border-[#FF6B00] shadow-2xl h-[500px]"
              />

              {/* Floating Cards next to Doctor */}
              <div className="absolute top-20 -right-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl z-20 flex flex-col items-center">
                <div className="bg-blue-100 p-2 rounded-lg mb-2">
                  <img src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=100&auto=format&fit=crop" alt="Stethoscope" className="w-10 h-10 rounded-full object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-800">Contact</span>
                <span className="text-[10px] text-slate-500">Get an appointment</span>
              </div>

              <div className="absolute bottom-32 -left-12 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-xl z-20 w-48">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Video size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-[#FF6B00] bg-orange-100 px-2 py-1 rounded-full border border-orange-200">LIVE</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Virtual Consultation</h4>
                <p className="text-[10px] text-slate-500 mb-3">Timely reach secure consultations with top-tier specialists.</p>
                <Link to="/register">
                  <button className="w-full bg-[#1E40AF] text-white text-[10px] font-bold py-2 rounded-lg hover:bg-blue-800 transition-colors">
                    Book Now
                  </button>
                </Link>
              </div>
              
            </motion.div>
            
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
