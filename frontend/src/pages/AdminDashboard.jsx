import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, User, Package, Shield, Pill, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    } else if (activeTab === 'inventory') {
      fetchInventory();
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
      const res = await fetch('http://127.0.0.1:8000/admin/doctors', { headers: getHeaders() });
      if (res.ok) setDoctors(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/inventory', { headers: getHeaders() });
      if (res.ok) setInventory(await res.json());
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
          <div className="text-xs font-bold text-gray-400 mb-4 px-4 tracking-wider uppercase">Admin Menu</div>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Activity size={18} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'inventory' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Package size={18} /> Inventory
            </button>
            <button 
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'doctors' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Users size={18} /> Doctors
            </button>
            <button 
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'patients' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <User size={18} /> Patients
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
          
          {activeTab === 'doctors' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-[#1E3A8A] flex items-center gap-2 mb-8">
                  <Activity size={24} className="text-blue-500" /> Doctor Verification & Management
               </h2>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="text-xs text-gray-500 border-b border-gray-100">
                     <tr>
                       <th className="py-4 font-semibold w-20">ID</th>
                       <th className="py-4 font-semibold">Name</th>
                       <th className="py-4 font-semibold">Specialty</th>
                       <th className="py-4 font-semibold">Status</th>
                       <th className="py-4 font-semibold text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {doctors.length === 0 ? (
                       <tr>
                         <td colSpan="5" className="py-12 text-center text-gray-500">
                           No doctors registered yet.
                         </td>
                       </tr>
                     ) : (
                       doctors.map((doc, idx) => (
                         <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                           <td className="py-4 text-gray-500">#{doc.id}</td>
                           <td className="py-4 font-bold text-gray-900">Dr. {doc.user?.full_name}</td>
                           <td className="py-4 text-gray-500">{doc.specialty}</td>
                           <td className="py-4">
                             <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">Verified</span>
                           </td>
                           <td className="py-4 text-right">
                             <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-bold text-[#1E3A8A] flex items-center gap-2">
                       <Package size={24} className="text-blue-500" /> Inventory Management
                   </h2>
                   <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
                       <Plus size={18} /> Add New Item
                   </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {inventory.map(item => (
                   <div key={item.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow relative">
                       <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                           <Pill size={24} />
                       </div>
                       <h3 className="font-bold text-gray-900 mb-1">{item.item_name}</h3>
                       <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                       <div className="flex justify-between items-center">
                           <span className="font-bold text-lg text-blue-600">${item.price}</span>
                           <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold">In Stock: {item.stock_quantity}</span>
                       </div>
                   </div>
                 ))}
                 
                 {inventory.length === 0 && (
                     <div className="col-span-full text-center py-12 text-gray-500 bg-slate-50 rounded-xl border border-dashed border-gray-200">
                         No inventory items found. Add items to see them here.
                     </div>
                 )}
               </div>
            </div>
          )}

          {activeTab === 'overview' && (
              <div className="text-center py-20 text-gray-500 bg-white rounded-3xl shadow-sm border border-gray-100">
                  Overview metrics will be displayed here.
              </div>
          )}

          {activeTab === 'patients' && (
              <div className="text-center py-20 text-gray-500 bg-white rounded-3xl shadow-sm border border-gray-100">
                  Patient management interface will be displayed here.
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
