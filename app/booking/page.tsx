"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]); // මෙය තමයි සම්පූර්ණ ලැයිස්තුව
  const [workers, setWorkers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<Record<number, number[]>>({});
  const [selectedEquip, setSelectedEquip] = useState<Record<number, any[]>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    // 1. සියලුම බුකින් ලබා ගැනීම
    const { data: bData, error } = await supabase.from("bookings").select("*").order("event_date", { ascending: true });
    if (error) console.error("Error fetching bookings:", error);
    
    // 2. අනිත් දත්ත ලබා ගැනීම
    const { data: wData } = await supabase.from("users").select("id, name").eq("role", "worker");
    const { data: eData } = await supabase.from("equipment").select("*");
    
    setBookings(bData || []);
    setWorkers(wData || []);
    setEquipment(eData || []);
  };

  // --- Logic Functions (Worker, Equip, Update, Delete) ---
  const toggleWorker = (bookingId: number, workerId: number, date: string) => {
    const isBusy = bookings.some(b => b.id !== bookingId && b.event_date === date && selectedWorkers[b.id]?.includes(workerId));
    if (isBusy) { alert("⚠️ Worker is already busy!"); return; }
    setSelectedWorkers(prev => ({ ...prev, [bookingId]: prev[bookingId]?.includes(workerId) ? prev[bookingId].filter(id => id !== workerId) : [...(prev[bookingId] || []), workerId] }));
  };

  const addEquipment = (bookingId: number, equipId: string, date: string) => {
    const equip = equipment.find(e => e.id === Number(equipId));
    if (!equip) return;
    const totalAllocated = bookings.reduce((sum, b) => b.event_date === date ? sum + (selectedEquip[b.id]?.find((e: any) => e.id === equip.id)?.qty || 0) : sum, 0);
    if (totalAllocated >= equip.quantity) { alert("❌ Out of stock!"); return; }
    setSelectedEquip(prev => ({ ...prev, [bookingId]: [...(prev[bookingId] || []), { id: equip.id, brand: equip.brand, qty: 1 }] }));
  };

  const updateQty = (bookingId: number, eqId: number, newQty: number, date: string) => {
    const equip = equipment.find(e => e.id === eqId);
    if (newQty > equip.quantity) { alert("❌ Cannot exceed total stock!"); return; }
    setSelectedEquip(prev => ({ ...prev, [bookingId]: prev[bookingId].map(i => i.id === eqId ? {...i, qty: newQty} : i) }));
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
    const msg = `Hello ${b.full_name}, your booking is confirmed! Total Balance: Rs.${b.total_balance}.`;
    window.open(`https://wa.me/${b.customer_phone}?text=${encodeURIComponent(msg)}`, '_blank');
    fetchData();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-red-500">All Bookings ({bookings.length})</h1>
        <button onClick={() => fetchData()} className="bg-zinc-800 px-4 py-2 rounded text-sm">Refresh List</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
              {editingId === b.id ? (
                <div className="space-y-3">
                  <input className="w-full bg-black p-2 rounded text-sm" defaultValue={b.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} placeholder="Name" />
                  <input type="number" className="w-full bg-black p-2 rounded text-sm" defaultValue={b.total_balance} onChange={e => setEditForm({...editForm, total_balance: Number(e.target.value)})} placeholder="Balance" />
                  <button onClick={() => updateBooking(b.id)} className="bg-green-600 w-full py-2 rounded">Save</button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-red-500">{b.full_name}</h2>
                  <p className="text-xs text-gray-400">Date: {b.event_date} | Loc: {b.location}</p>
                  <p className="text-xs text-gray-400 mb-4">Status: {b.status || 'Pending'} | Bal: Rs.{b.total_balance}</p>
                  
                  {/* Workers Selection */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {workers.map(w => <button key={w.id} onClick={() => toggleWorker(b.id, w.id, b.event_date)} className={`px-2 py-0.5 text-[10px] rounded ${selectedWorkers[b.id]?.includes(w.id) ? 'bg-red-600' : 'bg-black border border-zinc-700'}`}>{w.name}</button>)}
                  </div>

                  {/* Equipment Selection */}
                  <select className="w-full bg-black p-2 text-xs rounded mb-2" onChange={(e) => addEquipment(b.id, e.target.value, b.event_date)}>
                    <option>Add Equipment...</option>
                    {equipment.map(e => <option key={e.id} value={e.id}>{e.brand}</option>)}
                  </select>

                  <div className="space-y-1 mb-4">
                    {selectedEquip[b.id]?.map((eq: any) => (
                      <div key={eq.id} className="flex justify-between bg-black p-1 rounded text-[10px]">
                        <span>{eq.brand}</span>
                        <input type="number" value={eq.qty} className="w-8 bg-zinc-800 text-center" onChange={(e) => updateQty(b.id, eq.id, Number(e.target.value), b.event_date)} />
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button onClick={() => confirmBooking(b)} className="bg-green-700 px-3 py-1 text-[10px] rounded">Confirm & WA</button>
                    <button onClick={() => {setEditingId(b.id); setEditForm(b);}} className="bg-blue-700 px-3 py-1 text-[10px] rounded">Edit</button>
                    <button onClick={() => deleteBooking(b.id)} className="bg-red-700 px-3 py-1 text-[10px] rounded">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}