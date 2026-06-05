import React, { useState, useEffect } from 'react';
import { Package, Users, Plus, Edit2, TrendingUp, Activity, X, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_patients: 0, total_doctors: 0 });
  const [inventory, setInventory] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', stock_quantity: 0, price: 0, requires_prescription: false });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ratings, setRatings] = useState([]);
  
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingInventoryItem, setEditingInventoryItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [searchQueryInventory, setSearchQueryInventory] = useState('');
  const [searchQueryDoctors, setSearchQueryDoctors] = useState('');
  const [searchQueryPatients, setSearchQueryPatients] = useState('');
  const [searchQueryRatings, setSearchQueryRatings] = useState('');

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    fetchStats();
    fetchInventory();
    fetchPatients();
    fetchDoctors();
    fetchRatings();

    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const interval = setInterval(fetchRatings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/ratings', { headers });
      if (res.ok) {
        const data = await res.json();
        setRatings(prevRatings => {
          if (prevRatings.length > 0 && data.length > prevRatings.length) {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("New Rating Received", { body: `A patient just rated Dr. ${data[0].doctor_name} ${data[0].rating} Stars.` });
            }
          }
          return data;
        });
      }
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/dashboard/stats', { headers });
      if (res.ok) setStats(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/inventory', { headers });
      if (res.ok) setInventory(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/patients', { headers });
      if (res.ok) setPatients(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/doctors', { headers });
      if (res.ok) setDoctors(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleVerifyDoctor = async (doctorId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/doctors/${doctorId}/verify`, { method: 'PUT', headers });
      if (res.ok) {
        fetchDoctors();
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/doctors/${doctorId}`, { method: 'DELETE', headers });
      if (res.ok) {
        fetchDoctors();
      }
    } catch (err) { console.error(err); }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/inventory', {
        method: 'POST',
        headers,
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        fetchInventory();
        setNewItem({ name: '', description: '', stock_quantity: 0, price: 0, requires_prescription: false });
      }
    } catch (err) { console.error(err); }
  };

  const handleAddStock = async (id, added_stock) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/inventory/${id}?added_stock=${added_stock}`, {
        method: 'PUT',
        headers
      });
      if (res.ok) fetchInventory();
    } catch (err) { console.error(err); }
  };

  const handleEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setEditFormData({
      full_name: doc.user?.full_name || '',
      email: doc.user?.email || '',
      phone: doc.user?.phone || '',
      specialty: doc.specialty || '',
      consultation_fee: doc.consultation_fee || 0
    });
  };

  const submitEditDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/doctors/${editingDoctor.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setEditingDoctor(null);
        fetchDoctors();
      }
    } catch (err) { console.error(err); }
  };

  const handleEditPatient = (pat) => {
    setEditingPatient(pat);
    setEditFormData({
      full_name: pat.full_name || '',
      email: pat.email || '',
      phone: pat.phone || ''
    });
  };

  const submitEditPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/patients/${editingPatient.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setEditingPatient(null);
        fetchPatients();
      }
    } catch (err) { console.error(err); }
  };

  const handleEditInventoryItem = (item) => {
    setEditingInventoryItem(item);
    setEditFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      requires_prescription: item.requires_prescription || false
    });
  };

  const submitEditInventoryItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/inventory/${editingInventoryItem.id}/details`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setEditingInventoryItem(null);
        fetchInventory();
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteInventoryItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/inventory/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) fetchInventory();
    } catch (err) { console.error(err); }
  };

  const lowStockItems = inventory.filter(item => item.stock_quantity <= 10);

  const filteredInventory = inventory.filter(item => item.name.toLowerCase().includes(searchQueryInventory.toLowerCase()) || (item.description && item.description.toLowerCase().includes(searchQueryInventory.toLowerCase())));
  const filteredDoctors = doctors.filter(doc => (doc.user?.full_name || '').toLowerCase().includes(searchQueryDoctors.toLowerCase()) || (doc.specialty || '').toLowerCase().includes(searchQueryDoctors.toLowerCase()));
  const filteredPatients = patients.filter(pat => pat.full_name.toLowerCase().includes(searchQueryPatients.toLowerCase()) || pat.email.toLowerCase().includes(searchQueryPatients.toLowerCase()));
  const filteredRatings = ratings.filter(r => r.doctor_name.toLowerCase().includes(searchQueryRatings.toLowerCase()) || r.patient_name.toLowerCase().includes(searchQueryRatings.toLowerCase()) || (r.review_notes && r.review_notes.toLowerCase().includes(searchQueryRatings.toLowerCase())));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-20 relative overflow-hidden">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-2/3 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-tr-full pointer-events-none z-0"></div>
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 h-auto md:min-h-[calc(100vh-5rem)] flex-shrink-0 p-4 space-y-2 relative z-10">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-3 mt-4">Admin Menu</h2>
        
        <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Activity size={20} /> Overview
        </button>
        
        <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'inventory' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Package size={20} /> Inventory
        </button>
        
        <button onClick={() => setActiveTab('doctors')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'doctors' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Users size={20} /> Doctors
        </button>
        
        <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'patients' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Users size={20} /> Patients
        </button>
        
        <button onClick={() => setActiveTab('ratings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'ratings' ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Activity size={20} /> Ratings
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 lg:p-10 max-w-6xl w-full relative z-10">
        
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-extrabold text-[#1E3A8A] mb-8">System Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
                  <Users size={32} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Patients</p>
                  <p className="text-4xl font-black text-slate-800">{stats.total_patients}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600">
                  <Users size={32} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Doctors</p>
                  <p className="text-4xl font-black text-slate-800">{stats.total_doctors}</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package className="text-orange-500" /> Limited Stock Items
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              {lowStockItems.length === 0 ? (
                <p className="text-slate-500">All inventory items are sufficiently stocked.</p>
              ) : (
                <div className="space-y-4">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 border border-orange-100 bg-orange-50/30 rounded-xl">
                      <div>
                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                        <p className="text-sm text-slate-500">Price: ${item.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
                          Only {item.stock_quantity} left
                        </span>
                        <button onClick={() => setActiveTab('inventory')} className="text-sm font-bold text-blue-600 hover:text-blue-700">
                          Restock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Package className="text-blue-500" /> Inventory Management
              </h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search inventory..." className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={searchQueryInventory} onChange={e => setSearchQueryInventory(e.target.value)} />
              </div>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 border-r border-slate-100 pr-0 md:pr-8">
                <h3 className="font-semibold text-slate-700 mb-4">Add New Item</h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <input type="text" placeholder="Item Name" required className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                  <input type="number" placeholder="Price ($)" required className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} />
                  <input type="number" placeholder="Initial Stock" required className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" value={newItem.stock_quantity || ''} onChange={e => setNewItem({...newItem, stock_quantity: parseInt(e.target.value)})} />
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={newItem.requires_prescription} onChange={e => setNewItem({...newItem, requires_prescription: e.target.checked})} className="rounded text-blue-600" />
                    Requires Prescription
                  </label>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors">Add Item</button>
                </form>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="font-semibold text-slate-700 mb-4">Current Stock</h3>
                <div className="space-y-3">
                  {filteredInventory.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                        <p className="text-sm text-slate-500">Stock: <span className={`font-bold ${item.stock_quantity > 10 ? 'text-emerald-600' : 'text-red-500'}`}>{item.stock_quantity}</span> • Price: ${item.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditInventoryItem(item)} className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 rounded-lg text-sm font-semibold text-indigo-700">Edit</button>
                        <button onClick={() => handleDeleteInventoryItem(item.id)} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-semibold text-red-700">Delete</button>
                        <button onClick={() => handleAddStock(item.id, 10)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-700">+10 Stock</button>
                        <button onClick={() => handleAddStock(item.id, 50)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-700">+50 Stock</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="text-blue-500" /> Doctor Verification & Management
              </h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search doctors..." className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={searchQueryDoctors} onChange={e => setSearchQueryDoctors(e.target.value)} />
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">ID</th>
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">Specialty</th>
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 px-4 text-center text-slate-500">No doctors found.</td>
                      </tr>
                    ) : (
                      filteredDoctors.map(doc => (
                        <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-slate-800 font-medium">#{doc.id}</td>
                          <td className="py-3 px-4 text-sm text-slate-800 font-bold">Dr. {doc.user?.full_name}</td>
                          <td className="py-3 px-4 text-sm text-slate-600">{doc.specialty}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${doc.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {doc.is_verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm flex gap-2">
                            <button onClick={() => handleEditDoctor(doc)} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                              Edit
                            </button>
                            {!doc.is_verified && (
                              <button onClick={() => handleVerifyDoctor(doc.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                                Verify
                              </button>
                            )}
                            <button onClick={() => handleDeleteDoctor(doc.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-emerald-500" /> Patient Management
              </h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={searchQueryPatients} onChange={e => setSearchQueryPatients(e.target.value)} />
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">ID</th>
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">Phone</th>
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">Joined</th>
                      <th className="py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 px-4 text-center text-slate-500">No patients found.</td>
                      </tr>
                    ) : (
                      filteredPatients.map(patient => (
                        <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-slate-800 font-medium">#{patient.id}</td>
                          <td className="py-3 px-4 text-sm text-slate-800 font-bold">{patient.full_name}</td>
                          <td className="py-3 px-4 text-sm text-slate-600">{patient.email}</td>
                          <td className="py-3 px-4 text-sm text-slate-600">{patient.phone || 'N/A'}</td>
                          <td className="py-3 px-4 text-sm text-slate-500">{new Date(patient.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-sm flex gap-2">
                            <button onClick={() => handleEditPatient(patient)} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ratings' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h1 className="text-3xl font-extrabold text-[#1E3A8A]">Doctor Ratings</h1>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search ratings..." className="pl-10 pr-4 py-2 w-full bg-white shadow-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={searchQueryRatings} onChange={e => setSearchQueryRatings(e.target.value)} />
              </div>
            </div>
            <div className="space-y-4">
              {filteredRatings.length === 0 ? (
                <p className="text-slate-500 text-center py-10">No ratings found.</p>
              ) : (
                filteredRatings.map(r => (
                  <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">Dr. {r.doctor_name}</h3>
                      <p className="text-sm text-slate-500">Rated by {r.patient_name} on {new Date(r.date).toLocaleDateString()}</p>
                      {r.review && <p className="text-slate-600 mt-2 italic bg-slate-50 p-3 rounded-lg border border-slate-100">"{r.review}"</p>}
                    </div>
                    <div className="bg-orange-50 text-orange-600 font-bold px-4 py-2 rounded-xl text-xl flex items-center gap-2">
                      ⭐ {r.rating}/5
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in-down">
            <button onClick={() => setEditingDoctor(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Edit2 className="text-blue-500" /> Edit Doctor</h2>
            <form onSubmit={submitEditDoctor} className="space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none" value={editFormData.full_name} onChange={e => setEditFormData({...editFormData, full_name: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Email</label><input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Specialty</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none" value={editFormData.specialty} onChange={e => setEditFormData({...editFormData, specialty: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Consultation Fee ($)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none" value={editFormData.consultation_fee} onChange={e => setEditFormData({...editFormData, consultation_fee: parseFloat(e.target.value)})} /></div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/30">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in-down">
            <button onClick={() => setEditingPatient(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Edit2 className="text-emerald-500" /> Edit Patient</h2>
            <form onSubmit={submitEditPatient} className="space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500 outline-none" value={editFormData.full_name} onChange={e => setEditFormData({...editFormData, full_name: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Email</label><input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500 outline-none" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500 outline-none" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} /></div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/30">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Inventory Item Modal */}
      {editingInventoryItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in-down">
            <button onClick={() => setEditingInventoryItem(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Edit2 className="text-blue-500" /> Edit Item</h2>
            <form onSubmit={submitEditInventoryItem} className="space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Item Name</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Description</label><textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20" value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Price ($)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none" value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: parseFloat(e.target.value)})} /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edit-req-prescription" className="w-4 h-4 text-blue-600 rounded" checked={editFormData.requires_prescription} onChange={e => setEditFormData({...editFormData, requires_prescription: e.target.checked})} />
                <label htmlFor="edit-req-prescription" className="text-sm font-semibold text-slate-700">Requires Prescription</label>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/30">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

