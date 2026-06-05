import React from 'react';
import { User, UserCheck, Shield } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">How It Works</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#1E3A8A] mb-6">A unified ecosystem for everyone</h3>
          <p className="text-lg text-slate-600">
            Our platform simplifies the healthcare journey by providing tailored workflows for patients and doctors. Here's how each role interacts with the system.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Patients Workflow */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 relative border-t-4 border-blue-500">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 absolute -top-8 left-8 shadow-lg">
              <User size={32} className="text-blue-600" />
            </div>
            <h4 className="text-2xl font-bold text-[#1E3A8A] mb-6 mt-4">For Patients</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Search & Book</h5>
                  <p className="text-sm text-slate-500">Find specialist doctors, view available slots, and book instantly via our secure payment gateway.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Consult Remotely</h5>
                  <p className="text-sm text-slate-500">After confirmation, message your doctor directly or join a secure audio/video call.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">3</div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Prescriptions & Pharmacy</h5>
                  <p className="text-sm text-slate-500">Receive digital prescriptions, upload previous health records, and order medications seamlessly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors Workflow */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 relative border-t-4 border-[#FF6B00]">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 absolute -top-8 left-8 shadow-lg">
              <UserCheck size={32} className="text-[#FF6B00]" />
            </div>
            <h4 className="text-2xl font-bold text-[#1E3A8A] mb-6 mt-4">For Doctors</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold">1</div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Manage Profile & Slots</h5>
                  <p className="text-sm text-slate-500">Create your professional profile and update your daily availability for patient bookings.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold">2</div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Approve Appointments</h5>
                  <p className="text-sm text-slate-500">Review incoming requests. If a slot is rejected, the payment rolls back automatically to the user.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold">3</div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Diagnose & Prescribe</h5>
                  <p className="text-sm text-slate-500">Conduct video consultations, review uploaded files, and issue instant digital prescriptions.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
