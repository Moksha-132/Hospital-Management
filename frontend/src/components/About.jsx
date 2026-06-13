import React from 'react';
import { Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">About Us</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#1E3A8A] mb-6">Our Vision & Mission</h3>
          <p className="text-lg text-slate-600">
            We started Medicare to fix the broken administrative processes in modern hospitals. Our goal is to make receiving care seamless for patients and providing care effortless for doctors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border-t-4 border-[#CC5200] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-orange-50 rounded-full transition-transform group-hover:scale-150 duration-500 ease-in-out"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 text-[#CC5200]">
                <Target size={32} />
              </div>
              <h4 className="text-2xl font-bold text-[#1E3A8A] mb-4">Our Mission</h4>
              <p className="text-slate-600 leading-relaxed mb-6">
                To build a hospital management ecosystem that gets rid of administrative friction. We want to empower doctors to focus on what matters most—patient care—by automating everything else.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="text-[#CC5200]" size={18} /> Better patient experience
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="text-[#CC5200]" size={18} /> Smart hospital inventory
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="text-[#CC5200]" size={18} /> Rock-solid data security
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1E3A8A] p-10 rounded-3xl shadow-xl shadow-blue-900/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-800 rounded-full transition-transform group-hover:scale-150 duration-500 ease-in-out"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-800 rounded-2xl flex items-center justify-center mb-8 text-white">
                <Lightbulb size={32} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Our Vision</h4>
              <p className="text-blue-100 leading-relaxed mb-6">
                To become the standard for digital healthcare infrastructure. We envision a future where location doesn't block quality care thanks to robust telemedicine, and hospital administration just works.
              </p>
              <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700/50 mt-8">
                <p className="text-white font-medium italic">
                  "Building the digital backbone for modern hospitals."
                </p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default About;
