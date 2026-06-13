import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Stethoscope, CalendarCheck, ShieldCheck, HeartPulse, Hospital, Pill } from 'lucide-react';

const featureList = [
  {
    icon: <CalendarCheck className="w-8 h-8 text-[#CC5200]" />,
    title: "Smart Scheduling",
    description: "Book, approve, or reject slots easily. Automated rollback for rejected appointments.",
  },
  {
    icon: <HeartPulse className="w-8 h-8 text-blue-600" />,
    title: "Telemedicine Built-in",
    description: "Secure video and audio calls integrated directly within the platform for remote care.",
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-emerald-500" />,
    title: "Digital Prescriptions",
    description: "Doctors can upload prescriptions seamlessly with instant email notifications.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
    title: "Secure Data Management",
    description: "Patient records, uploaded files, and profiles managed with top-tier security.",
  },
  {
    icon: <Hospital className="w-8 h-8 text-[#CC5200]" />,
    title: "Hospital Admin Panel",
    description: "Comprehensive admin dashboard to manage total patients and facility workflow.",
  },
  {
    icon: <Pill className="w-8 h-8 text-blue-600" />,
    title: "Inventory & Pharmacy",
    description: "Manage medical inventory, process patient medicine orders, and integrate payments.",
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-16 mb-20 items-center">
          {/* About Text */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] mb-6">
              About Our <span className="text-blue-500">Services</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The art of medicine is founded upon the hospital ecosystem. We are obsessed with 
              helping patients navigate complex procedures so they never have to worry about scheduling, 
              offering an automated digital specialty experience. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Improve medication adherence and simplify prescribing workflows. Our unified hospital management 
              system ensures that your medical inventory, patient appointments, and financial transactions 
              are handled within a single, secure environment.
            </p>
            <Link to="/contact">
              <button className="bg-[#CC5200] hover:bg-[#A34200] text-white font-bold px-8 py-3.5 rounded-lg shadow-md transition-colors">
                Contact With Us
              </button>
            </Link>
          </div>
          
          {/* Image Grid */}
          <div className="w-full lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1514416432279-50fac261c7dd?q=80&w=1000&auto=format&fit=crop" alt="Doctor team" className="rounded-2xl w-full h-64 object-cover shadow-lg" />
              <div className="flex flex-col gap-4">
                <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop" alt="Medical facility" className="rounded-2xl w-full h-32 object-cover shadow-lg" />
                <div className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-100 flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-full text-white">
                    <HeartPulse size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3A8A] text-sm">24/7 Emergency</h3>
                    <p className="text-[10px] text-slate-600">Emergency protocols always ready.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] mb-4">
            Specialist Doctor <span className="text-blue-500">Advanced Services</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to seamlessly manage your medical institution, from telemedicine to inventory tracking.
          </p>
        </div>

        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 md:pb-0 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {featureList.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-auto snap-center p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
              <Link to="/register" className="mt-6 inline-flex items-center gap-2 text-blue-600 font-bold text-sm cursor-pointer hover:text-[#CC5200] transition-colors">
                Get Started <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
