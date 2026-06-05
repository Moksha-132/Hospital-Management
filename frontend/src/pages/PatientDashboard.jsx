import React, { useState, useEffect } from 'react';
import { Search, Calendar, Video, FileText, ShoppingCart, UploadCloud, ChevronRight, Activity, Clock, CheckCircle, MessageCircle, Star, Plus, X } from 'lucide-react';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('doctors');
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);
  const [orders, setOrders] = useState([]);

  const addToCart = (item, prescriptionUrl = null) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      if (existingItem.quantity >= item.stock_quantity) return;
      setCart(cart.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
    } else {
      setCart([...cart, { ...item, quantity: 1, prescription_url: prescriptionUrl }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

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
    fetchOrders();

    if ("Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/my/orders`, { headers });
      if (res.ok) setOrders(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/doctors${searchTerm ? `?specialty=${searchTerm}` : ''}`, { headers });
      if (res.ok) setDoctors(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/appointments`, { headers });
      if (res.ok) setAppointments(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/inventory`, { headers });
      if (res.ok) setInventory(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleBookSlot = async (slotId) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/appointments`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/doctors/${docId}/slots`, { headers });
      if (res.ok) {
        const data = await res.json();
        setDoctorSlots(prev => ({...prev, [docId]: data}));
      }
    } catch (err) { console.error(err); }
  };

  const handleOrderMedicine = async (itemId) => {
   
  };

  const viewPrescription = async (aptId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/appointments/${aptId}/prescription`, { headers });
      if (res.ok) {
        setPrescriptionContent(await res.json());
      } else {
        setMessage('Prescription not found.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-20 relative overflow-hidden">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-2/3 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-tr-full pointer-events-none z-0"></div>
      
      <div className="w-full md:w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 h-auto md:min-h-[calc(100vh-5rem)] flex-shrink-0 p-4 space-y-2 relative z-10">
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
        
        <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'orders' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <FileText size={20} /> My Orders
        </button>
      </div>

      <div className="flex-grow p-6 lg:p-10 max-w-6xl w-full relative z-10">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1E3A8A] flex items-center gap-3">
              <Activity className="text-blue-500" size={32} />
              Patient Dashboard
            </h1>
            <p className="text-slate-500 mt-2">Book appointments, order medicines, and view prescriptions.</p>
          </div>
          <button onClick={() => setShowCartModal(true)} className="bg-white border border-slate-200 p-3 rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-700">
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">{cart.reduce((a,c) => a + c.quantity, 0)}</span>}
          </button>
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
                      <button onClick={() => {
                        setPaymentData({
                          type: 'appointment',
                          id: apt.id,
                          amount: apt.doctor?.consultation_fee || 0,
                          title: `Consultation Fee (Dr. ${apt.doctor?.user?.full_name || apt.doctor_id})`
                        });
                        setShowPaymentModal(true);
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
                            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/appointments/${apt.id}/upload`, {
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
                      <a href={prescriptionContent.file_url} download target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-indigo-100">
                        View/Download Prescription Photo
                      </a>
                    </div>
                  )}
                  <div className="pt-2">
                    <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/uploads/prescription_pdf_${prescriptionContent.appointment_id}.pdf`} download target="_blank" rel="noopener noreferrer" className="inline-block bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors">
                      Download Prescription Details (PDF)
                    </a>
                  </div>
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
                            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/appointments/${apt.id}/message`, {
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

        {activeTab === 'orders' && (
          <div className="p-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><FileText className="text-purple-500" /> My Orders</h3>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>You haven't placed any pharmacy orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const handleDownloadReceipt = async (group) => {
                    try {
                      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/generate-receipt`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          group_id: group.id,
                          items: group.items.map(i => ({ name: i.item.name, quantity: i.quantity, price: i.total_price })),
                          total_price: group.total_price,
                          delivery_address: group.delivery_address,
                          created_at: new Date(group.created_at).toLocaleDateString()
                        })
                      });
                      if (res.ok) {
                        const data = await res.json();
                        window.open(data.receipt_url, '_blank');
                      }
                    } catch (err) { console.error(err); }
                  };
                  
                  const groupedOrders = [];
                  orders.forEach(order => {
                    const orderTime = new Date(order.created_at).getTime();
                    const existingGroup = groupedOrders.find(group => 
                      Math.abs(new Date(group.created_at).getTime() - orderTime) < 10000
                    );
                    if (existingGroup) {
                      existingGroup.items.push(order);
                      existingGroup.total_price += order.total_price;
                    } else {
                      groupedOrders.push({
                        id: order.id,
                        created_at: order.created_at,
                        status: order.status,
                        delivery_address: order.delivery_address,
                        total_price: order.total_price,
                        items: [order]
                      });
                    }
                  });
                  return groupedOrders.map(group => (
                    <div key={group.id} className="border border-slate-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">Order #{group.id}</h4>
                          <p className="text-sm text-slate-500 mt-1">Ordered on: {new Date(group.created_at).toLocaleDateString()} at {new Date(group.created_at).toLocaleTimeString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs font-bold uppercase px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">{group.status}</span>
                          <span className="font-black text-slate-800">${group.total_price.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        {group.items.map(itemOrder => (
                          <div key={itemOrder.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div>
                              <p className="font-semibold text-slate-700">{itemOrder.item.name}</p>
                              <p className="text-sm text-slate-500">Qty: {itemOrder.quantity}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="font-semibold text-slate-700">${itemOrder.total_price.toFixed(2)}</span>
                              {itemOrder.prescription_url && (
                                <a href={itemOrder.prescription_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline uppercase bg-blue-50 px-2 py-0.5 rounded">View Prescription</a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {group.delivery_address && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                          <span className="font-semibold text-slate-700 text-sm">Delivery Address:</span>
                          <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{group.delivery_address}</p>
                        </div>
                      )}

                      <button onClick={() => handleDownloadReceipt(group)} className="w-full mt-2 border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download Receipt
                      </button>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pharmacy' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><ShoppingCart className="text-emerald-500"/> Pharmacy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.length === 0 ? <p className="text-slate-500">No medicines available.</p> : inventory.map(item => {
                const inCart = cart.find(c => c.id === item.id);
                const availableStock = item.stock_quantity - (inCart ? inCart.quantity : 0);
                return (
                <div key={item.id} className="border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full bg-white relative overflow-hidden">
                  {item.requires_prescription && (
                    <span className="absolute top-4 right-4 text-[10px] uppercase font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">Prescription Req.</span>
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-2 mt-1">
                      <h3 className="font-bold text-slate-800 pr-24">{item.name}</h3>
                    </div>
                    <span className="font-bold text-emerald-600 mb-2 block">${item.price}</span>
                    <p className="text-sm text-slate-500 mb-4">{item.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-semibold text-slate-500">{availableStock > 0 ? `${availableStock} in stock` : 'Out of Stock'}</span>
                    <button 
                      onClick={() => {
                        if (item.requires_prescription && !inCart) setPendingCartItem(item);
                        else addToCart(item);
                      }}
                      disabled={availableStock <= 0}
                      className={`px-4 py-2 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${availableStock <= 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}
        </div>

        {showRatingModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Rate Your Doctor</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/appointments/${selectedAptId}/rate?rating=${ratingData.rating}&review=${encodeURIComponent(ratingData.review)}`, {
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

        {showPaymentModal && paymentData && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => { setShowPaymentModal(false); setDeliveryAddress(''); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">Payment Details</h3>
              <p className="text-center text-slate-500 mb-6 font-medium">{paymentData.title}</p>
              
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 text-center border border-blue-100">
                <p className="text-sm font-semibold mb-1">Amount to Pay</p>
                <p className="text-4xl font-extrabold">${paymentData.amount}</p>
              </div>
              
              {(paymentData.type === 'cart' || paymentData.type === 'medicine') && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Address</label>
                  <textarea 
                    rows="3" 
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                    placeholder="Enter your full delivery address here..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                  ></textarea>
                </div>
              )}
              
              <div className="space-y-3 mb-8">
                <div>
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === 'card' ? 'border-blue-500 bg-blue-50/50 shadow-sm rounded-b-none border-b-0' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={selectedPaymentMethod === 'card'} onChange={() => setSelectedPaymentMethod('card')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-3 font-semibold text-slate-700 flex-1">Credit / Debit Card</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  </label>
                  {selectedPaymentMethod === 'card' && (
                    <div className="p-4 border border-blue-500 border-t-0 rounded-b-xl bg-blue-50/10 space-y-3">
                      <div className="relative">
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white font-medium text-slate-700 transition-shadow" maxLength="19" />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                      </div>
                      <div className="flex gap-3">
                        <input type="text" placeholder="MM/YY" className="w-1/2 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white font-medium text-slate-700 transition-shadow text-center" maxLength="5" />
                        <input type="text" placeholder="CVC" className="w-1/2 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white font-medium text-slate-700 transition-shadow text-center" maxLength="4" />
                      </div>
                      <input type="text" placeholder="Name on Card" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white font-medium text-slate-700 transition-shadow uppercase" />
                    </div>
                  )}
                </div>
                <div>
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50/50 shadow-sm rounded-b-none border-b-0' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="paymentMethod" value="paypal" checked={selectedPaymentMethod === 'paypal'} onChange={() => setSelectedPaymentMethod('paypal')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-3 font-semibold text-slate-700 flex-1">PayPal</span>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-slate-400"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                  </label>
                  {selectedPaymentMethod === 'paypal' && (
                    <div className="p-4 border border-blue-500 border-t-0 rounded-b-xl bg-blue-50/10 space-y-3">
                      <input type="email" placeholder="PayPal Email ID" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white font-medium text-slate-700 transition-shadow" />
                    </div>
                  )}
                </div>
                
                {(paymentData.type === 'medicine' || paymentData.type === 'cart') ? (
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === 'cod' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={selectedPaymentMethod === 'cod'} onChange={() => setSelectedPaymentMethod('cod')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-3 font-semibold text-slate-700 flex-1">Cash on Delivery</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </label>
                ) : (
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === 'upi' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="paymentMethod" value="upi" checked={selectedPaymentMethod === 'upi'} onChange={() => setSelectedPaymentMethod('upi')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-3 font-semibold text-slate-700 flex-1">Google Pay / UPI</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
                  </label>
                )}
              </div>
              
              <button onClick={async () => {
                if ((paymentData.type === 'cart' || paymentData.type === 'medicine') && !deliveryAddress.trim()) {
                  setMessage('Please enter a delivery address.');
                  setTimeout(() => setMessage(''), 3000);
                  return;
                }
                try {
                  setLoading(true);
                  if (paymentData.type === 'appointment') {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/appointments/${paymentData.id}/pay`, {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    if(res.ok) {
                      setMessage(`Payment of $${paymentData.amount} via ${selectedPaymentMethod.toUpperCase()} Successful! Slot Confirmed.`);
                      fetchAppointments();
                    } else {
                      setMessage('Payment Failed.');
                    }
                  } else if (paymentData.type === 'cart') {
                    let successCount = 0;
                    for (const item of cart) {
                      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/order-medicine/${item.id}?quantity=${item.quantity}`;
                      if (item.prescription_url) url += `&prescription_url=${encodeURIComponent(item.prescription_url)}`;
                      url += `&delivery_address=${encodeURIComponent(deliveryAddress)}`;
                      const res = await fetch(url, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          'Content-Type': 'application/json'
                        }
                      });
                      if (res.ok) successCount++;
                    }
                    if (successCount === cart.length) {
                      setMessage(`Successfully checked out ${cart.length} items via ${selectedPaymentMethod.toUpperCase()}!`);
                      setCart([]);
                      fetchInventory();
                      fetchOrders();
                    } else {
                      setMessage(`Failed to process some items. Checked out ${successCount} of ${cart.length} items.`);
                      fetchInventory();
                      fetchOrders();
                    }
                  } else if (paymentData.type === 'medicine') {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/order-medicine/${paymentData.id}?quantity=1&delivery_address=${encodeURIComponent(deliveryAddress)}`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    if (res.ok) {
                      setMessage(`Medicine ordered successfully via ${selectedPaymentMethod.toUpperCase()}!`);
                      fetchInventory();
                      fetchOrders();
                    } else {
                      setMessage('Failed to order medicine.');
                    }
                  }
                  setShowPaymentModal(false);
                  setDeliveryAddress('');
                } catch(err) { console.error(err); }
                setLoading(false);
                setTimeout(() => setMessage(''), 4000);
              }} disabled={loading} className="w-full bg-[#FF6B00] hover:bg-[#E56000] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1">
                {loading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        )}
      </div>
        {showCartModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-end z-[60] p-0 sm:p-4" onClick={() => setShowCartModal(false)}>
            <div className="bg-white sm:rounded-3xl p-6 w-full max-w-md h-full sm:h-[calc(100vh-2rem)] shadow-2xl flex flex-col relative overflow-hidden transition-transform transform translate-x-0" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><ShoppingCart className="text-emerald-500"/> Your Cart</h3>
                <button onClick={() => setShowCartModal(false)} className="bg-red-100 hover:bg-red-200 text-red-600 font-bold px-4 py-2 rounded-lg transition-colors shadow-sm border border-red-200">
                  Close
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <ShoppingCart size={48} className="mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <div>
                          <p className="font-semibold text-slate-700">{item.name}</p>
                          <p className="text-sm text-slate-500">${item.price} x {item.quantity}</p>
                          {item.prescription_url && <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">Prescription Attached</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-800">${item.price * item.quantity}</span>
                          <button onClick={() => removeFromCart(item.id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-semibold text-slate-500 text-lg">Total</span>
                      <span className="text-3xl font-black text-slate-800">${getCartTotal()}</span>
                    </div>
                    <button onClick={() => {
                      setShowCartModal(false);
                      setPaymentData({
                        type: 'cart',
                        amount: getCartTotal(),
                        title: `Pharmacy Order (${cart.length} items)`
                      });
                      setShowPaymentModal(true);
                    }} className="w-full bg-[#FF6B00] hover:bg-[#E56000] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1 text-lg">
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {pendingCartItem && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">Prescription Required</h3>
                <button onClick={() => setPendingCartItem(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>
              <p className="text-center text-slate-500 mb-6 font-medium text-sm">Please upload a valid doctor's prescription for <span className="font-bold">{pendingCartItem.name}</span> to add it to your cart.</p>
              
              <label className="border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors mb-2 group">
                <UploadCloud size={40} className="text-slate-400 group-hover:text-blue-500 mb-3" />
                <span className="font-semibold text-slate-700">Click to upload prescription</span>
                <span className="text-xs text-slate-400 mt-1">Image or PDF files</span>
                <input type="file" className="hidden" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setLoading(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients/upload-prescription`, {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                      body: formData
                    });
                    if (res.ok) {
                      const data = await res.json();
                      addToCart(pendingCartItem, data.file_url);
                      setMessage(`${pendingCartItem.name} added to cart with prescription!`);
                      setPendingCartItem(null);
                      setShowCartModal(true);
                    } else {
                      setMessage('Failed to upload prescription.');
                    }
                  } catch (err) { console.error(err); }
                  setLoading(false);
                  setTimeout(() => setMessage(''), 4000);
                }} />
              </label>
            </div>
          </div>
        )}
    </div>
  );
};

export default PatientDashboard;

