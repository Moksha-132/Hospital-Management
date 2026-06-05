import React, { useState, useEffect } from 'react';
import { Search, Calendar, Video, FileText, ShoppingCart, UploadCloud, ChevronRight, Activity, Clock, CheckCircle, MessageCircle, Star } from 'lucide-react';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('doctors'); // doctors, appointments, pharmacy
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [prescriptionContent, setPrescriptionContent] = useState(null);
  const [doctorSlots, setDoctorSlots] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState(null);
  const [ratingData, setRatingData] = useState({ rating: 5, review: '' });

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
          if (!isDoctor && !isPatient) {
             return <div key={idx} className="text-xs text-slate-400 text-center my-1 font-medium">{line}</div>;
          }

          const colonIdx = line.indexOf(':');
          const sender = line.substring(0, colonIdx);
          const msg = line.substring(colonIdx + 1).trim();

          return (
            <div key={idx} className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${isPatient ? 'bg-blue-600 text-white self-end rounded-tr-sm shadow-md shadow-blue-500/20' : 'bg-white border border-slate-200 text-slate-700 self-start rounded-tl-sm shadow-sm'}`}>
              <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isPatient ? 'text-blue-200' : 'text-slate-400'}`}>{sender}</span>
              <p className="text-sm leading-relaxed">{msg}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchInventory();

    if ("Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`http://localhost:8000/patients/doctors${searchTerm ? `?specialty=${searchTerm}` : ''}`, { headers });
      if (res.ok) setDoctors(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:8000/patients/appointments', { headers });
      if (res.ok) setAppointments(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/inventory', { headers });
      if (res.ok) setInventory(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleBookSlot = async (slotId) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/patients/appointments', {
        method: 'POST',
        headers,
        body: JSON.stringify({ slot_id: slotId })
      });
      if (res.ok) {
        setMessage('Slot booked! Payment simulated successfully.');
        
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Medicare Appointment Confirmed", {
            body: "Your appointment is booked! You and the doctor will receive an email confirmation and reminders.",
            icon: "/vite.svg"
          });
        }

        fetchAppointments();
        setDoctorSlots({});
      } else {
        setMessage('Failed to book slot.');
      }
    } catch (err) { console.error(err); }
    setLoading(false);
    setTimeout(() => setMessage(''), 4000);
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

  const handleViewSlots = async (docId) => {
    try {
      const res = await fetch(`http://localhost:8000/doctors/${docId}/slots`, { headers });
      if (res.ok) {
        const data = await res.json();
        setDoctorSlots(prev => ({...prev, [docId]: data}));
      }
    } catch (err) { console.error(err); }
  };

  const handleOrderMedicine = async (itemId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/patients/order-medicine/${itemId}?quantity=1`, {
        method: 'POST',
        headers
      });
      if (res.ok) {
        setMessage('Medicine ordered successfully!');
        fetchInventory();
      } else {
        setMessage('Failed to order medicine.');
      }
    } catch (err) { console.error(err); }
    setLoading(false);
    setTimeout(() => setMessage(''), 4000);
  };

  const viewPrescription = async (aptId) => {
    try {
      const res = await fetch(`http://localhost:8000/patients/appointments/${aptId}/prescription`, { headers });
      if (res.ok) {
        setPrescriptionContent(await res.json());
      } else {
        setMessage('Prescription not found.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-20">
      <div className="w-full md:w-64 bg-white border-r border-slate-200 h-auto md:min-h-[calc(100vh-5rem)] flex-shrink-0 p-4 space-y-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-3 mt-4">Patient Menu</h2>
        
        <button onClick={() => setActiveTab('doctors')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'doctors' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Search size={20} /> Find Doctors
        </button>
        
        <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'appointments' ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Calendar size={20} /> Appointments
        </button>

        <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
          <MessageCircle size={20} /> Doctor Chat
        </button>
        
        <button onClick={() => setActiveTab('pharmacy')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'pharmacy' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <ShoppingCart size={20} /> Pharmacy
        </button>
      </div>

      <div className="flex-grow p-6 lg:p-10 max-w-6xl w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#1E3A8A] flex items-center gap-3">
            <Activity className="text-blue-500" size={32} />
            Patient Dashboard
          </h1>
          <p className="text-slate-500 mt-2">Book appointments, order medicines, and view prescriptions.</p>
        </div>

        {message && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-6 font-medium border border-emerald-100 flex items-center gap-2">
            <CheckCircle size={20} /> {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[500px]">
        
        {activeTab === 'doctors' && (
          <div className="p-6">
            <div className="flex gap-2 mb-6 max-w-md">
              <input type="text" placeholder="Search specialty (e.g. Cardiologist)" className="flex-1 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <button onClick={fetchDoctors} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">Search</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.length === 0 ? <p className="text-slate-500 col-span-2">No doctors found.</p> : doctors.map(doc => (
                <div key={doc.id} className="border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-4 items-start mb-4">
                    <img src={doc.avatar_url || `https://ui-avatars.com/api/?name=Dr+${doc.user?.full_name}&background=eff6ff&color=1d4ed8`} alt="Doctor" className="w-16 h-16 rounded-full object-cover shadow-sm border border-slate-200" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">Dr. {doc.user?.full_name}</h3>
                          <p className="text-blue-600 font-semibold">{doc.specialty}</p>
                        </div>
                        <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">${doc.consultation_fee}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{doc.bio || "No bio available."}</p>
                  
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2"><Clock size={16}/> Available Slots</span>
                      {doctorSlots[doc.id] === undefined && (
                        <button onClick={() => handleViewSlots(doc.id)} className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold transition-colors">
                          Load Slots
                        </button>
                      )}
                    </h4>
                    
                    {doctorSlots[doc.id] && doctorSlots[doc.id].length === 0 && (
                      <p className="text-sm text-slate-500 italic">No available slots at the moment.</p>
                    )}
                    
                    {doctorSlots[doc.id] && doctorSlots[doc.id].length > 0 && (
                      (() => {
                        const todayStr = new Date().toISOString().split('T')[0];
                        const todaysSlots = doctorSlots[doc.id].filter(slot => new Date(slot.start_time).toISOString().split('T')[0] === todayStr);
                        
                        if (todaysSlots.length === 0) {
                           return <p className="text-sm text-slate-500 italic">No available slots for today.</p>;
                        }
                        
                        return (
                          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
                            {todaysSlots.map(slot => (
                              <div key={slot.id} className="flex justify-between items-center bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 p-4 rounded-xl transition-colors">
                                <div>
                                  <p className="text-sm font-bold text-slate-800 mb-0.5">{formatDate(slot.start_time)}</p>
                                  <p className="text-sm text-slate-600 font-medium">{new Date(slot.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(slot.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <button onClick={() => handleBookSlot(slot.id)} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm">
                                  Book Slot
                                </button>
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">My Appointments</h2>
            <div className="space-y-4">
              {appointments.length === 0 ? <p className="text-slate-500">No appointments yet.</p> : appointments.map(apt => (
                <div key={apt.id} className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="flex-1 w-full md:w-auto">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">Appointment #{apt.id}</h3>
                    <p className="text-sm text-slate-500 mb-2">Doctor: <span className="font-bold text-slate-700">Dr. {apt.doctor?.user?.full_name || apt.doctor_id}</span> • Status: <span className="uppercase font-bold text-blue-600">{apt.status}</span></p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {apt.status === 'confirmed' && apt.payment_status === 'pending' && (
                      <button onClick={async () => {
                        try {
                          const res = await fetch(`http://localhost:8000/patients/appointments/${apt.id}/pay`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                          });
                          if(res.ok) {
                            setMessage('Payment Successful! Slot Confirmed.');
                            fetchAppointments();
                          } else {
                            setMessage('Payment Failed.');
                          }
                        } catch(err) { console.error(err); }
                      }} className="bg-[#FF6B00] hover:bg-[#E56000] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-colors">
                        Pay Fee (${apt.doctor?.consultation_fee || 0})
                      </button>
                    )}
                    {apt.status !== 'completed' && apt.status !== 'rejected' && (
                      <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer">
                        <UploadCloud size={16} /> Upload Report
                        <input type="file" className="hidden" onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch(`http://localhost:8000/patients/appointments/${apt.id}/upload`, {
                              method: 'POST',
                              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                              body: formData
                            });
                            if (res.ok) {
                              setMessage('File uploaded successfully!');
                              fetchAppointments();
                              if ("Notification" in window && Notification.permission === "granted") {
                                new Notification("Report Sent", {
                                  body: "Your report has been securely uploaded. The doctor has been notified via email.",
                                  icon: "/vite.svg"
                                });
                              }
                            }
                          } catch (err) { console.error(err); }
                        }} />
                      </label>
                    )}
                    {apt.patient_report_url && (
                      <a href={apt.patient_report_url} target="_blank" rel="noopener noreferrer" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors border border-indigo-200 shadow-sm">
                        <FileText size={16} /> View Report
                      </a>
                    )}
                    {apt.status === 'confirmed' && apt.meeting_link && (
                      <a href={apt.meeting_link} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                        <Video size={16} /> Join Call
                      </a>
                    )}
                    {apt.status === 'completed' && (
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setSelectedAptId(apt.id);
                          setShowRatingModal(true);
                        }} className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
                          <Star size={16} /> Rate Doctor
                        </button>
                        <button onClick={() => viewPrescription(apt.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                          <FileText size={16} /> View Prescription
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {prescriptionContent && (
              <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl relative">
                <button onClick={() => setPrescriptionContent(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">Close</button>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="text-blue-500"/> Prescription Details</h3>
                <div className="space-y-4">
                  {prescriptionContent.medicines && (
                    <div>
                      <span className="font-semibold text-slate-700 block text-sm mb-1">Medicines:</span>
                      <p className="text-slate-800 whitespace-pre-wrap bg-white p-3 rounded-lg border border-slate-200">{prescriptionContent.medicines}</p>
                    </div>
                  )}
                  {prescriptionContent.instructions && (
                    <div>
                      <span className="font-semibold text-slate-700 block text-sm mb-1">Instructions:</span>
                      <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200">{prescriptionContent.instructions}</p>
                    </div>
                  )}
                  {prescriptionContent.file_url && (
                    <div>
                      <span className="font-semibold text-slate-700 block text-sm mb-1">Attached Photo:</span>
                      <a href={prescriptionContent.file_url} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-indigo-100">
                        View Prescription Photo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="p-6 h-full min-h-[500px]">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Doctor Communications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-400">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No active doctor chats found.</p>
                </div>
              ) : (
                appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').map(apt => (
                  <div key={apt.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all bg-white flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">Dr</div>
                      <div>
                        <span className="font-bold text-slate-800 block">Dr. {apt.doctor?.user?.full_name || apt.doctor_id}</span>
                        <span className="text-xs text-slate-500">Appointment #{apt.id}</span>
                      </div>
                    </div>
                    <div className="flex-grow">{apt.notes ? renderChat(apt.notes) : <p className="text-sm text-slate-400 italic text-center py-4">No messages yet.</p>}</div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex gap-2">
                        <input type="text" placeholder="Type a message..." id={`msg-${apt.id}`} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        <button onClick={async () => {
                          const input = document.getElementById(`msg-${apt.id}`);
                          const msg = input.value;
                          if(!msg.trim()) return;
                          try {
                            const res = await fetch(`http://localhost:8000/patients/appointments/${apt.id}/message`, {
                              method: 'POST',
                              headers: { 
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ message: msg })
                            });
                            if(res.ok) { 
                              fetchAppointments(); 
                              input.value = ''; 
                              if ("Notification" in window && Notification.permission === "granted") {
                                new Notification("Message Sent", { body: "Your doctor has been notified." });
                              }
                            }
                          } catch(err) { console.error(err); }
                        }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Send</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'pharmacy' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><ShoppingCart className="text-emerald-500"/> Pharmacy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {inventory.length === 0 ? <p className="text-slate-500">No medicines available.</p> : inventory.map(item => (
                <div key={item.id} className="border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800">{item.name}</h3>
                      <span className="font-bold text-emerald-600">${item.price}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{item.description}</p>
                  </div>
                  <button 
                    onClick={() => handleOrderMedicine(item.id)}
                    disabled={loading || item.stock_quantity === 0}
                    className={`w-full py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${item.stock_quantity === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
                  >
                    <ShoppingCart size={16} /> {item.stock_quantity === 0 ? 'Out of Stock' : 'Order Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>

        {showRatingModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Rate Your Doctor</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch(`http://localhost:8000/patients/appointments/${selectedAptId}/rate?rating=${ratingData.rating}&review=${encodeURIComponent(ratingData.review)}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                  });
                  if (res.ok) {
                    setMessage('Thank you for your feedback!');
                    fetchAppointments();
                    setShowRatingModal(false);
                  }
                } catch(err) { console.error(err); }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rating (1-5 Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button type="button" key={num} onClick={() => setRatingData({...ratingData, rating: num})} className={`p-2 rounded-full ${ratingData.rating >= num ? 'text-orange-500' : 'text-slate-300'}`}>
                        <Star size={32} fill={ratingData.rating >= num ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Review (Optional)</label>
                  <textarea rows="3" className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" value={ratingData.review} onChange={e => setRatingData({...ratingData, review: e.target.value})} placeholder="How was your experience?"></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowRatingModal(false)} className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-[#FF6B00] hover:bg-[#E56000] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
