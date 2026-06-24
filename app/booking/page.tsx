"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  
  // දත්ත තබාගැනීම සඳහා State
  const [selectedWorkers, setSelectedWorkers] = useState<Record<number, number[]>>({});
  const [selectedEquip, setSelectedEquip] = useState<Record<number, any[]>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: bData } = await supabase.from("bookings").select("*").order("event_date", { ascending: true });
    const localBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings([...(bData || []), ...localBookings]);
    
    const { data: wData } = await supabase.from("users").select("id, name").eq("role", "worker");
    const { data: eData } = await supabase.from("equipment").select("*");
    setWorkers(wData || []);
    setEquipment(eData || []);
  };

  // පැරණි ඒවා තබාගෙන අලුතින් Workers එකතු කිරීම
  const toggleWorker = (bookingId: number, workerId: number) => {
    setSelectedWorkers(prev => {
        const currentList = prev[bookingId] || [];
        const updatedList = currentList.includes(workerId) 
            ? currentList.filter(id => id !== workerId) 
            : [...currentList, workerId];
        return { ...prev, [bookingId]: updatedList };
    });
  };

  // පැරණි ඒවා තබාගෙන අලුතින් Equipment එකතු කිරීම
  const addEquipment = (bookingId: number, equipId: string) => {
    const equip = equipment.find(e => e.id === Number(equipId));
    if (!equip) return;
    setSelectedEquip(prev => {
        const currentEquip = prev[bookingId] || [];
        if (currentEquip.find(e => e.id === equip.id)) return prev;
        return { ...prev, [bookingId]: [...currentEquip, { id: equip.id, brand: equip.brand }] };
    });
  };

  // Discount ගණනය කර අවසාන මුදල සුරැකීම
  const saveBooking = async (id: number) => {
    const discount = editForm.discount || 0;
    const originalAmount = editForm.total_balance || 0;
    const finalAmount = originalAmount - (originalAmount * (discount / 100));
    
    await supabase.from("bookings").update({ 
        ...editForm, 
        final_balance: finalAmount,
        selected_workers: selectedWorkers[id],
        selected_equipment: selectedEquip[id]
    }).eq("id", id);
    
    setEditingId(null);
    fetchData();
  };

  const confirmBooking = async (b: any) => {
    const finalAmount = b.final_balance || b.total_balance;
    const msg = `Hello ${b.full_name}, your booking is confirmed! Final Bill: Rs.${finalAmount}.`;
    window.open(`https://wa.me/${b.customer_phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black p-8">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
        <button onClick={() => router.push("/admin")} className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-red-700">← Back</button>
        <h1 className="text-2xl font-extrabold">Booking Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-2xl border shadow-sm">
            {editingId === b.id ? (
              <div className="space-y-2">
                <input className="w-full bg-gray-100 p-2 rounded text-xs" defaultValue={b.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} placeholder="Name" />
                <input type="number" className="w-full bg-gray-100 p-2 rounded text-xs" defaultValue={b.total_balance} onChange={e => setEditForm({...editForm, total_balance: Number(e.target.value)})} placeholder="Original Amount" />
                <input type="number" className="w-full bg-gray-100 p-2 rounded text-xs" onChange={e => setEditForm({...editForm, discount: Number(e.target.value)})} placeholder="Discount %" />
                
                <p className="text-[10px] font-bold mt-2">Assign Workers:</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {workers.map(w => <button key={w.id} onClick={() => toggleWorker(b.id, w.id)} className={`px-2 py-1 text-[10px] rounded ${selectedWorkers[b.id]?.includes(w.id) ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{w.name}</button>)}
                </div>

                <select className="w-full bg-gray-100 p-2 text-xs rounded" onChange={(e) => addEquipment(b.id, e.target.value)}>
                  <option>Add Equipment...</option>
                  {equipment.map(e => <option key={e.id} value={e.id}>{e.brand}</option>)}
                </select>

                <button onClick={() => saveBooking(b.id)} className="bg-green-600 text-white w-full py-2 rounded text-xs font-bold">Save Final Bill</button>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-red-600">{b.full_name}</h2>
                <p className="text-xs text-gray-500">Date: {b.event_date} | Final: Rs.{b.final_balance || b.total_balance}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => {setEditingId(b.id); setEditForm(b);}} className="flex-1 bg-gray-200 py-2 rounded text-xs font-bold">Edit</button>
                  <button onClick={() => confirmBooking(b)} className="flex-1 bg-blue-600 text-white py-2 rounded text-xs font-bold">Confirm & WA</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}