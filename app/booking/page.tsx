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

  // Logic Functions
  const toggleWorker = (bookingId: number, workerId: number) => {
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

  return (
    <main className="min-h-screen bg-gray-50 text-black p-8">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
        <button onClick={() => router.push("/admin")} className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-red-700">← Back to Admin Dashboard</button>
        <h1 className="text-2xl font-extrabold">Booking Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            {editingId === b.id ? (
              <div className="space-y-3">
                <input className="w-full bg-gray-100 p-2 rounded" defaultValue={b.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} placeholder="Name" />
                <input className="w-full bg-gray-100 p-2 rounded" defaultValue={b.location} onChange={e => setEditForm({...editForm, location: e.target.value})} placeholder="Location" />
                <input type="date" className="w-full bg-gray-100 p-2 rounded" defaultValue={b.event_date} onChange={e => setEditForm({...editForm, event_date: e.target.value})} />
                <input type="number" className="w-full bg-gray-100 p-2 rounded" defaultValue={b.total_balance} onChange={e => setEditForm({...editForm, total_balance: Number(e.target.value)})} placeholder="Balance" />
                <button onClick={() => updateBooking(b.id)} className="bg-green-600 text-white w-full py-2 rounded">Save Changes</button>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-red-600">{b.full_name}</h2>
                <p className="text-xs text-gray-500 mb-2">Date: {b.event_date} | Loc: {b.location}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {workers.map(w => <button key={w.id} onClick={() => toggleWorker(b.id, w.id)} className={`px-2 py-1 text-[10px] rounded ${selectedWorkers[b.id]?.includes(w.id) ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{w.name}</button>)}
                </div>

                <select className="w-full bg-gray-100 p-2 text-xs rounded mb-3" onChange={(e) => addEquipment(b.id, e.target.value)}>
                  <option>Add Equipment...</option>
                  {equipment.map(e => <option key={e.id} value={e.id}>{e.brand}</option>)}
                </select>

                <div className="flex gap-2 pt-4 border-t">
                  <button onClick={() => {setEditingId(b.id); setEditForm(b);}} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold">Edit All</button>
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