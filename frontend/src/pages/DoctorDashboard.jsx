import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, Activity, Settings, Plus, Trash2, CheckCircle, XCircle, FileText, ChevronRight, Video, Send, MessageCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('slots'); // slots, appointments, profile
  const [profile, setProfile] = useState({ specialty: '', consultation_fee: 0, bio: '' });
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '', repeat: 'none', repeatUntil: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({ medicines: '', instructions: '', file_url: '' });
  
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const filterDate = new Date().toISOString().split('T')[0];

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    fetchProfile();
    fetchSlots();
    fetchAppointments();
    
    if ("Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/profile`, { headers });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if(data.avatar_url) setAvatarPreview(data.avatar_url);
      }
    } catch (err) { console.error(err); }
  };

  const fetchSlots = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/my/slots`, { headers });
      if (res.ok) setSlots(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/my/appointments`, { headers });
      if (res.ok) setAppointments(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(profile)
      });
      if (res.ok) setMessage('Profile updated successfully!');
    } catch (err) { setMessage('Failed to update profile.'); }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/profile/avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setAvatarPreview(data.avatar_url);
        setMessage('Profile picture updated successfully!');
      }
    } catch (err) { console.error(err); }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) return;
    setLoading(true);
    
    let datesToCreate = [];
    const startDate = new Date(`${newSlot.date}T${newSlot.startTime}:00`);
    
    if (newSlot.repeat === 'none') {
      datesToCreate.push(startDate);
    } else {
      if (!newSlot.repeatUntil) {
        setMessage("Please select an end date for recurring slots.");
        setLoading(false);
        return;
      }
      const endDate = new Date(`${newSlot.repeatUntil}T23:59:59`);
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const day = currentDate.getDay(); // 0 is Sun, 6 is Sat
        if (newSlot.repeat === 'everyday' || (newSlot.repeat === 'weekdays' && day !== 0 && day !== 6)) {
           datesToCreate.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    try {
      let createdCount = 0;
      for (const d of datesToCreate) {
        const eTime = new Date(d);
        const [hours, minutes] = newSlot.endTime.split(':');
        eTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/slots`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            start_time: d.toISOString(), 
            end_time: eTime.toISOString() 
          })
        });
        if (res.ok) createdCount++;
      }
      
      fetchSlots();
      setNewSlot({ date: '', startTime: '', endTime: '', repeat: 'none', repeatUntil: '' });
      setMessage(`Successfully created ${createdCount} slot(s)!`);
    } catch (err) { 
      console.error(err); 
      setMessage(`Network error: ${err.message}`);
    }
    setLoading(false);
  };

  const handleDeleteSlot = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/slots/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) fetchSlots();
    } catch (err) { console.error(err); }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    const getOrdinalNum = (n) => {
      return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    };

    return `${getOrdinalNum(day)} ${month} ${year}`;
  };

  const handleApproveReject = async (id, action) => {
    let urlSuffix = '';

    if (action === 'approve') {
      const meetLink = window.prompt("Enter a Google Meet link for this appointment (or leave blank to auto-generate a seamless Jitsi room):");
      if (meetLink === null) return; // User cancelled
      if (meetLink.trim() !== '') {
        urlSuffix = `?meet_link=${encodeURIComponent(meetLink.trim())}`;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/appointments/${id}/${action}${urlSuffix}`, {
        method: 'PUT',
        headers
      });
      if (res.ok) fetchAppointments();
    } catch (err) { console.error(err); }
  };

  const handleStartCall = async (apt) => {
    window.open(apt.meeting_link, "_blank");
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/appointments/${apt.id}/notify-call`, {
        method: 'POST',
        headers
      });
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Patient Notified", {
          body: "The patient has been emailed to join your consultation room.",
          icon: "/vite.svg"
        });
      }
    } catch (err) { console.error(err); }
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...prescriptionData,
        appointment_id: selectedAptId
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/appointments/${selectedAptId}/prescription`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowPrescribeModal(false);
        setSelectedAptId(null);
        setPrescriptionData({ medicines: '', instructions: '', file_url: '' });
        fetchAppointments();
        setMessage('Prescription sent to patient successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) { console.error(err); }
  };

  const renderChat = (notes) => {
    if (!notes) return null;
    const lines = notes.split('\n').filter(line => line.trim() !== '');
    return (
      <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-4 max-h-48 overflow-y-auto flex flex-col gap-3">
        {lines.map((line, idx) => {
          const isDoctor = line.startsWith('Doctor');
          const isPatient = line.startsWith('Patient');
          if (!isDoctor && !isPatient) {
             return <div key={idx} className="text-xs text-slate-400 text-center my-1 font-medium">{line}</div>;
          }

          const colonIdx = line.indexOf(':');
          const sender = line.substring(0, colonIdx);
          const msg = line.substring(colonIdx + 1).trim();

          return (
            <div key={idx} className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${isDoctor ? 'bg-blue-600 text-white self-end rounded-tr-sm shadow-md shadow-blue-500/20' : 'bg-white border border-slate-200 text-slate-700 self-start rounded-tl-sm shadow-sm'}`}>
              <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDoctor ? 'text-blue-200' : 'text-slate-400'}`}>{sender}</span>
              <p className="text-sm leading-relaxed">{msg}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/appointments/${selectedAptId}/message`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: messageContent })
      });
      if (res.ok) {
        setMessage('Message sent securely to the patient!');
        
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Medicare Alert", {
            body: "Your message was sent! The patient has been notified via Email and Desktop, and an email reminder has been scheduled.",
            icon: "/vite.svg"
          });
        }
        
        fetchAppointments();
        setShowMessageModal(false);
        setMessageContent('');
      }
    } catch(err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-20 relative overflow-hidden">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-2/3 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-tr-full pointer-events-none z-0"></div>
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 h-auto md:min-h-[calc(100vh-5rem)] flex-shrink-0 p-4 space-y-2 relative z-10">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-3 mt-4">Doctor Menu</h2>
        
        <button onClick={() => setActiveTab('slots')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'slots' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Clock size={20} /> Schedule
        </button>
        
        <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'appointments' ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Calendar size={20} /> Appointments
        </button>

        <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
          <MessageCircle size={20} /> Patient Chat
        </button>
        
        <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Settings size={20} /> Profile
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 lg:p-10 max-w-6xl w-full relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#1E3A8A] flex items-center gap-3">
            <Activity className="text-blue-500" size={32} />
            Doctor Dashboard
          </h1>
          <p className="text-slate-500 mt-2">Manage your practice, schedule, and patients all in one place.</p>
        </div>

        {message && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-6 font-medium border border-emerald-100 flex items-center gap-2 animate-fade-in-down">
            <CheckCircle size={20} /> {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[500px]">
        
        {/* --- SLOTS TAB --- */}
        {activeTab === 'slots' && (
          <div className="flex flex-col md:flex-row h-full">
            {/* Add Slot Form */}
            <div className="w-full md:w-1/3 border-r border-slate-100 bg-slate-50/50 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Plus size={20} className="text-blue-600" /> Add New Slot
              </h3>
              <form onSubmit={handleAddSlot} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
                  <input type="date" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Time</label>
                    <input type="time" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={newSlot.startTime} onChange={e => setNewSlot({...newSlot, startTime: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Time</label>
                    <input type="time" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={newSlot.endTime} onChange={e => setNewSlot({...newSlot, endTime: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Repeat Options</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={newSlot.repeat} onChange={e => setNewSlot({...newSlot, repeat: e.target.value})}
                  >
                    <option value="none">Do Not Repeat</option>
                    <option value="everyday">Every Day</option>
                    <option value="weekdays">Every Weekday (Mon-Fri)</option>
                  </select>
                </div>

                {newSlot.repeat !== 'none' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Repeat Until Date</label>
                    <input type="date" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      value={newSlot.repeatUntil} onChange={e => setNewSlot({...newSlot, repeatUntil: e.target.value})} />
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-4 shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2">
                  <Plus size={18} /> {loading ? 'Creating...' : 'Create Slot(s)'}
                </button>
              </form>
            </div>
            
            {/* List Slots */}
            <div className="w-full md:w-2/3 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                  <span>Available Slots</span>
                  <span className="bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full">
                    {slots.filter(s => new Date(s.start_time).toISOString().split('T')[0] === filterDate).length} Slots
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-500">Filter by Date:</span>
                  <input type="date" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
                    value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                </div>
              </div>
              
              {slots.filter(s => new Date(s.start_time).toISOString().split('T')[0] === filterDate).length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Clock size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No availability slots found for this date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {slots
                    .filter(s => new Date(s.start_time).toISOString().split('T')[0] === filterDate)
                    .map(slot => {
                    const start = new Date(slot.start_time);
                    const end = new Date(slot.end_time);
                    return (
                      <div key={slot.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:border-blue-300 hover:shadow-md transition-all group">
                        <div>
                          <p className="font-bold text-slate-800">{formatDate(start)}</p>
                          <p className="text-sm text-slate-500 font-medium mt-1">
                            {start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md inline-block mt-2 ${slot.is_booked ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {slot.is_booked ? 'Booked' : 'Available'}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleDeleteSlot(slot.id)}
                          className={`p-2 rounded-lg transition-colors ${slot.is_booked ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:bg-red-50 hover:text-red-500'}`}
                          disabled={slot.is_booked}
                          title={slot.is_booked ? "Cannot delete booked slot" : "Delete slot"}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- APPOINTMENTS TAB --- */}
        {activeTab === 'appointments' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Patient Appointments</h3>
            
            {appointments.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                <p>No appointments found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(apt => (
                  <div key={apt.id} className="border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg text-[#1E3A8A]">{apt.patient?.full_name || `Patient #${apt.patient_id}`}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 flex items-center gap-2 mt-2">
                        <Clock size={16} className="text-slate-400"/>
                        Slot #{apt.slot_id} • Payment: <span className="capitalize">{apt.payment_status}</span>
                      </p>
                      {apt.rating && (
                        <div className="mt-3 bg-orange-50 border border-orange-100 p-3 rounded-lg inline-block">
                          <p className="text-sm font-bold text-orange-700 flex items-center gap-1">⭐ {apt.rating}/5 Rating Received</p>
                          {apt.review && <p className="text-xs text-orange-600 mt-1 italic">"{apt.review}"</p>}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {apt.status === 'pending' && (
                        <>
                          <button onClick={() => handleApproveReject(apt.id, 'approve')} className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                            <CheckCircle size={16} /> Approve
                          </button>
                          <button onClick={() => handleApproveReject(apt.id, 'reject')} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                            <XCircle size={16} /> Reject
                          </button>
                        </>
                      )}
                      
                      {apt.status === 'confirmed' && (
                        <div className="flex gap-2">
                          {apt.meeting_link && (
                            <button onClick={() => handleStartCall(apt)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors shadow-md">
                              <Video size={16} /> Video Call
                            </button>
                          )}
                          <button onClick={() => {
                            setSelectedAptId(apt.id);
                            setMessageContent('');
                            setShowMessageModal(true);
                          }} className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                            <MessageCircle size={16} /> Message
                          </button>
                          {apt.patient_report_url && (
                            <a href={apt.patient_report_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
                              <FileText size={16} /> View Report
                            </a>
                          )}
                          <button onClick={() => { setSelectedAptId(apt.id); setShowPrescribeModal(true); }} className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#E56000] text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors shadow-md shadow-orange-500/20">
                            <FileText size={16} /> Consult & Prescribe
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- CHAT TAB --- */}
        {activeTab === 'chat' && (
          <div className="p-6 h-full min-h-[500px]">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Patient Communications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-400">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No active patient chats found.</p>
                </div>
              ) : (
                appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').map(apt => (
                  <div key={apt.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all bg-white flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {apt.patient?.full_name ? apt.patient.full_name[0].toUpperCase() : 'P'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">{apt.patient?.full_name || `Patient #${apt.patient_id}`}</span>
                        <span className="text-xs text-slate-500">Appointment #{apt.id}</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      {apt.notes ? renderChat(apt.notes) : <p className="text-sm text-slate-400 italic text-center py-4">No messages yet.</p>}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <button onClick={() => {
                        setSelectedAptId(apt.id);
                        setMessageContent('');
                        setShowMessageModal(true);
                      }} className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-lg font-bold transition-colors">
                        <MessageCircle size={18} /> Reply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- PROFILE TAB --- */}
        {activeTab === 'profile' && (
          <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Profile Settings</h3>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar/Avatar Section */}
              <div className="w-full md:w-1/3 flex flex-col items-center p-8 bg-slate-50 border border-slate-100 rounded-3xl h-fit">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-inner overflow-hidden border-4 border-white relative group">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} className="text-blue-400" />
                  )}
                </div>
                <h4 className="text-xl font-bold text-slate-800 text-center">Dr. {profile.user?.full_name || 'Name'}</h4>
                <p className="text-blue-600 font-semibold mb-1 text-center">{profile.specialty || 'Specialty'}</p>
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-6">
                  <span className={`w-2 h-2 rounded-full ${profile.is_verified ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                  {profile.is_verified ? 'Verified Practitioner' : 'Verification Pending'}
                </div>
                <label className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors w-full shadow-sm text-center cursor-pointer">
                  Change Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>

              {/* Form Section */}
              <div className="w-full md:w-2/3">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  
                  {/* Account Information */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><User size={18} className="text-blue-500"/> Personal Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <input type="text" disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed font-medium" value={profile.user?.full_name || ''} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input type="email" disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed font-medium" value={profile.user?.email || ''} />
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity size={18} className="text-emerald-500"/> Professional Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Medical Specialty</label>
                        <input type="text" required placeholder="e.g. Cardiologist, Dermatologist"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                          value={profile.specialty || ''} onChange={e => setProfile({...profile, specialty: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Consultation Fee ($)</label>
                        <input type="number" required min="0" step="0.01"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                          value={profile.consultation_fee || ''} onChange={e => setProfile({...profile, consultation_fee: parseFloat(e.target.value)})} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Professional Bio</label>
                      <textarea rows="5" placeholder="Tell patients about your experience, education, and qualifications..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium"
                        value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                      {loading ? 'Saving Changes...' : 'Save Profile Changes'} <CheckCircle size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
      </div>
      
      {/* Prescribe Modal */}
      {showPrescribeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="text-blue-500" /> Write Prescription
            </h3>
            <form onSubmit={submitPrescription} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Medicines</label>
                <textarea rows="3" placeholder="e.g. Paracetamol 500mg - 1x2 after meals (Optional if uploading photo)" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={prescriptionData.medicines} onChange={e => setPrescriptionData({...prescriptionData, medicines: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Upload Prescription Photo (Optional)</label>
                <input type="file" accept="image/*" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if(file) {
                      const mockUrl = `https://mockstorage.com/prescription_${Date.now()}_${file.name}`;
                      setPrescriptionData({...prescriptionData, file_url: mockUrl});
                      setMessage(`Simulated upload for ${file.name}`);
                    }
                  }}
                />
                {prescriptionData.file_url && <p className="text-xs text-emerald-600 mt-1">Photo attached securely.</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Instructions / Notes</label>
                <textarea rows="2" placeholder="Rest for 3 days..." className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={prescriptionData.instructions} onChange={e => setPrescriptionData({...prescriptionData, instructions: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPrescribeModal(false)} className="w-1/2 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                  <Send size={18} /> Send to Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MessageCircle className="text-blue-500" /> Send Message to Patient
            </h3>
            <form onSubmit={submitMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Message Content</label>
                <textarea required rows="4" placeholder="Hello, please remember to bring your previous medical records..." className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={messageContent} onChange={e => setMessageContent(e.target.value)} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowMessageModal(false)} className="w-1/2 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                  <Send size={18} /> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DoctorDashboard;

