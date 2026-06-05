import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Settings, Activity, Plus, Trash2, MessageCircle, CheckCircle, XCircle, User } from 'lucide-react';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedule');
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    } else if (activeTab === 'schedule') {
      fetchSlots();
    } else if (activeTab === 'profile') {
      fetchProfile();
    }
  }, [activeTab]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/doctors/my/appointments', { headers: getHeaders() });
      if (res.ok) setAppointments(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchSlots = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/doctors/my/slots', { headers: getHeaders() });
      if (res.ok) {
          const data = await res.json();
          setSlots(data.length > 0 ? data : [
              { id: 1, start_time: "2026-06-05T21:30:00", end_time: "2026-06-06T00:40:00", status: "AVAILABLE" },
              { id: 2, start_time: "2026-06-05T17:15:00", end_time: "2026-06-05T18:15:00", status: "BOOKED" }
          ]);
      }
    } catch (err) { 
        setSlots([
            { id: 1, start_time: "2026-06-05T21:30:00", end_time: "2026-06-06T00:40:00", status: "AVAILABLE" },
            { id: 2, start_time: "2026-06-05T17:15:00", end_time: "2026-06-05T18:15:00", status: "BOOKED" }
        ]);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/doctors/profile', { headers: getHeaders() });
      if (res.ok) setProfile(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Top Navbar */}
      <div className="bg-white px-8 py-4 flex justify-between items-center shadow-sm relative z-10">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <div className="bg-blue-600 text-white p-1 rounded-md"><Activity size={24} /></div> Medicare
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <button className="text-[#1E3A8A]">Dashboard</button>
          <button onClick={handleLogout} className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-700 transition-colors">
            Log Out
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-76px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-100 flex flex-col pt-8 px-4">
          <div className="text-xs font-bold text-gray-400 mb-4 px-4 tracking-wider">DOCTOR MENU</div>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'schedule' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Clock size={18} /> Schedule
            </button>
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Calendar size={18} /> Appointments
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Settings size={18} /> Profile
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1E3A8A] flex items-center gap-2">
              <Activity size={32} className="text-blue-500" /> Doctor Dashboard
            </h1>
            <p className="text-gray-500 mt-2 text-sm ml-10">
              Manage your practice, schedule, and patients all in one place.
            </p>
          </div>

          {activeTab === 'schedule' && (
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              
              {/* Add New Slot Form */}
              <div className="w-full xl:w-1/3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#1E3A8A] flex items-center gap-2 mb-6">
                  <Plus size={20} className="text-blue-500" /> Add New Slot
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                    <input type="date" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Start Time</label>
                      <div className="relative">
                        <input type="time" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-700 mb-1">End Time</label>
                      <div className="relative">
                        <input type="time" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Repeat Options</label>
                    <select className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                      <option>Do Not Repeat</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mt-4 flex justify-center items-center gap-2 text-sm shadow-md shadow-blue-500/20">
                    <Plus size={18} /> Create Slot(s)
                  </button>
                </div>
              </div>

              {/* Available Slots List */}
              <div className="w-full xl:w-2/3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-900">Available Slots</h2>
                    <span className="bg-blue-100 text-blue-600 font-bold text-xs px-3 py-1 rounded-full">{slots.length} Slots</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Filter by Date:</span>
                    <input type="date" defaultValue="2026-06-05" className="border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slots.map(slot => {
                      const startDate = new Date(slot.start_time);
                      const endDate = new Date(slot.end_time);
                      return (
                        <div key={slot.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow relative">
                            <h3 className="font-bold text-gray-900 mb-2">
                                {startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">
                                {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            
                            <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                                slot.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                                {slot.status === 'AVAILABLE' ? 'Available' : 'Booked'}
                            </span>

                            <button className="absolute bottom-5 right-5 text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                      );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Patient Requests</h2>
               <div className="space-y-4">
                 {appointments.length === 0 ? (
                   <div className="text-center py-10 text-gray-500">
                     No patient requests at this time.
                   </div>
                 ) : (
                   appointments.map(apt => (
                     <div key={apt.id} className="border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-shadow">
                       <div>
                         <div className="flex items-center gap-2 mb-2">
                           <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{apt.status}</span>
                           <span className="text-gray-500 text-sm">{new Date(apt.slot.start_time).toLocaleString()}</span>
                         </div>
                         <h3 className="font-bold text-lg text-gray-900">{apt.patient.user.full_name}</h3>
                         <p className="text-gray-500 text-sm mt-1">Issue: {apt.symptoms || "Checkup"}</p>
                       </div>
                       <div className="flex gap-2">
                         <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
                           <MessageCircle size={18} /> Message
                         </button>
                         <button className="bg-green-500 text-white hover:bg-green-600 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm shadow-green-500/20">
                           <CheckCircle size={18} /> Accept
                         </button>
                         <button className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
                           <XCircle size={18} /> Decline
                         </button>
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#1E3A8A] mb-8">Profile Settings</h2>
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Profile Card */}
                <div className="w-full lg:w-1/3 bg-slate-50 rounded-2xl p-8 flex flex-col items-center border border-gray-100">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-6">
                    <User size={64} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Dr. {profile?.user?.full_name || 'Lakshmi Moksha'}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm mb-2">{profile?.specialty || 'Cardiologist'}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-8">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Verified Practitioner
                  </div>
                  <button className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm">
                    Change Photo
                  </button>
                </div>

                {/* Right Column: Forms */}
                <div className="w-full lg:w-2/3 space-y-6">
                  
                  {/* Personal Information */}
                  <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
                    <h3 className="text-sm font-bold text-[#1E3A8A] flex items-center gap-2 mb-6">
                      <User size={18} className="text-blue-500" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2">Full Name</label>
                        <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-700" defaultValue={profile?.user?.full_name || 'Lakshmi Moksha'} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2">Email Address</label>
                        <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-700" defaultValue={profile?.user?.email || 'lakshmimoksha.132@gmail.com'} />
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
                    <h3 className="text-sm font-bold text-[#1E3A8A] flex items-center gap-2 mb-6">
                      <Activity size={18} className="text-green-500" /> Professional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2">Medical Specialty</label>
                        <input type="text" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-900" defaultValue={profile?.specialty || 'Cardiologist'} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2">Consultation Fee ($)</label>
                        <input type="number" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-900" defaultValue={profile?.consultation_fee || '1000'} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Professional Bio</label>
                      <textarea className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-900 h-32 resize-none leading-relaxed" defaultValue={profile?.bio || 'Board-certified Cardiologist with over 10 years of experience in diagnosing and treating heart-related conditions. Specialized in preventive cardiology, hypertension management, and cardiac rehabilitation. Dedicated to providing personalized care and helping patients maintain long-term heart health.'}></textarea>
                    </div>
                    
                    <button className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20 mt-6 text-sm">
                      Save Profile Changes
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
