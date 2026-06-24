"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
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

  const toggleWorker = (bookingId: number, workerId: number, date: string) => {
    setSelectedWorkers(prev => ({ ...prev, [bookingId]: prev[bookingId]?.includes(workerId) ? prev[bookingId].filter(id => id !== workerId) : [...(prev[bookingId] || []), workerId] }));
  };

  const addEquipment = (bookingId: number, equipId: string) => {
    const equip = equipment.find(e => e.id === Number(equipId));
    if (!equip) return;
    setSelectedEquip(prev => ({ ...prev, [bookingId]: [...(prev[bookingId] || []), { id: equip.id, brand: equip.brand, qty: 1 }] }));
  };

  const updateBooking = async (id: number) => {
    await supabase.from("bookings").update(editForm).eq("id", id);
    setEditingId(null);
    fetchData();
  };

  const deleteBooking = async (id: number) => {
    if (confirm("Delete this booking?")) {
      await supabase.from("bookings").delete().eq("id", id);
      fetchData();
    }
  };

  const confirmBooking = async (b: any) => {
    await supabase.from("bookings").update({ status: 'confirmed' }).eq("id", b.id);
    window.open(`https://wa.me/${b.customer_phone}?text=Your booking is confirmed!`, '_blank');
    fetchData();
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black p-8">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={() => router.push("/admin")} className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition">← Back to Admin Dashboard</button>
        <h1 className="text-2xl font-extrabold text-gray-800">Booking Management</h1>
        <button onClick={fetchData} className="bg-gray-200 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-300">Refresh</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            {editingId === b.id ? (
              <div className="space-y-3">
                <input className="w-full bg-gray-100 p-2 rounded text-sm" defaultValue={b.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} />
                <button onClick={() => updateBooking(b.id)} className="bg-green-600 text-white w-full py-2 rounded">Save</button>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-gray-900">{b.full_name}</h2>
                <p className="text-xs text-gray-500 mb-4">Date: {b.event_date} | Status: {b.status || 'Pending'}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {workers.map(w => <button key={w.id} onClick={() => toggleWorker(b.id, w.id, b.event_date)} className={`px-2 py-1 text-[10px] rounded ${selectedWorkers[b.id]?.includes(w.id) ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{w.name}</button>)}
                </div>

                <select className="w-full bg-gray-100 p-2 text-xs rounded mb-3" onChange={(e) => addEquipment(b.id, e.target.value)}>
                  <option>Add Equipment...</option>
                  {equipment.map(e => <option key={e.id} value={e.id}>{e.brand}</option>)}
                </select>

                <div className="flex gap-2 pt-4 border-t">
                  <button onClick={() => confirmBooking(b)} className="flex-1 bg-black text-white py-2 rounded-lg text-xs font-bold hover:bg-gray-800">Confirm & WA</button>
                  <button onClick={() => {setEditingId(b.id); setEditForm(b);}} className="flex-1 bg-gray-100 py-2 rounded-lg text-xs font-bold hover:bg-gray-200">Edit</button>
                  <button onClick={() => deleteBooking(b.id)} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-xs font-bold">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}