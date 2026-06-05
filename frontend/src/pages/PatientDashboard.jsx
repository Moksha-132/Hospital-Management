import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, MessageCircle, ShoppingCart, Activity, Clock } from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy data for chat matching screenshot
  const chatMessages = [
    { sender: 'doctor', name: 'LAKSHMI MOKSHA', text: 'please upload your reports before appointemnt time' },
    { sender: 'patient', name: 'JIMIN', text: 'ok doctor' }
  ];

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/patients/doctors${searchTerm ? `?specialty=${searchTerm}` : ''}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.length > 0 ? data : [
          {
            id: 1,
            user: { full_name: "Lakshmi Moksha" },
            specialty: "Cardiologist",
            consultation_fee: 1000,
            bio: "Board-certified Cardiologist with over 10 years of experience in diagnosing and treating heart-related conditions. Specialized in..."
          }
        ]);
      }
    } catch (err) {
      // Fallback for UI demonstration
      setDoctors([
        {
          id: 1,
          user: { full_name: "Lakshmi Moksha" },
          specialty: "Cardiologist",
          consultation_fee: 1000,
          bio: "Board-certified Cardiologist with over 10 years of experience in diagnosing and treating heart-related conditions. Specialized in..."
        }
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navbar */}
      <div className="bg-white px-8 py-4 flex justify-between items-center shadow-sm relative z-10">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <div className="bg-blue-600 text-white p-1 rounded-md"><Activity size={24} /></div> Medicare
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <span className="text-[#1E3A8A]">Hello, Jimin</span>
          <button onClick={handleLogout} className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-700 transition-colors">
            Log Out
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-76px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-100 flex flex-col pt-8 px-4">
          <div className="text-xs font-bold text-gray-400 mb-4 px-4 tracking-wider">PATIENT MENU</div>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'doctors' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Search size={18} /> Find Doctors
            </button>
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Calendar size={18} /> Appointments
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'chat' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <MessageCircle size={18} /> Doctor Chat
            </button>
            <button 
              onClick={() => setActiveTab('pharmacy')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'pharmacy' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <ShoppingCart size={18} /> Pharmacy
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1E3A8A] flex items-center gap-2">
              <Activity size={32} className="text-blue-500" /> Patient Dashboard
            </h1>
            <p className="text-gray-500 mt-2 text-sm ml-10">
              Book appointments, order medicines, and view prescriptions.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-4xl">
            {activeTab === 'doctors' && (
              <div>
                <div className="flex gap-4 mb-8">
                  <input 
                    type="text" 
                    placeholder="Search specialty (e.g. Cardiologist)" 
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button onClick={fetchDoctors} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-colors">
                    Search
                  </button>
                </div>

                <div className="space-y-4">
                  {doctors.map((doc, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                            {doc.user.full_name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">Dr. {doc.user.full_name}</h3>
                            <p className="text-blue-600 font-medium text-sm">{doc.specialty}</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-bold text-sm">
                          ${doc.consultation_fee}
                        </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {doc.bio || "Board-certified Cardiologist with over 10 years of experience in diagnosing and treating heart-related conditions. Specialized in..."}
                      </p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                          <Clock size={16} /> Available Slots
                        </div>
                        <button className="text-blue-600 font-bold text-sm hover:underline">
                          Load Slots
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div>
                <h2 className="text-xl font-bold text-[#1E3A8A] mb-6">Doctor Communications</h2>
                
                <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm max-w-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                      Dr
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Dr. Lakshmi Moksha</h3>
                      <p className="text-gray-400 text-xs">Appointment #1</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-gray-100 rounded-xl p-4 h-64 overflow-y-auto mb-4 flex flex-col space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-gray-400 font-bold mb-1 tracking-wider uppercase">
                          {msg.sender} [{msg.name}]
                        </span>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[80%] ${
                          msg.sender === 'patient' 
                            ? 'bg-blue-600 text-white rounded-br-sm' 
                            : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="text-center py-10 text-gray-500">
                Appointments view not populated yet.
              </div>
            )}
            
            {activeTab === 'pharmacy' && (
              <div className="text-center py-10 text-gray-500">
                Pharmacy view not populated yet.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
