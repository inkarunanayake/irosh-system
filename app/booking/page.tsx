"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [selectedWorkers, setSelectedWorkers] = useState<Record<number, any[]>>({});
  const [selectedEquip, setSelectedEquip] = useState<Record<number, any[]>>({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: bData } = await supabase.from("bookings").select("*");
    const { data: wData } = await supabase.from("users").select("id, name").eq("role", "worker");
    const { data: eData } = await supabase.from("equipment").select("*");
    setBookings(bData || []); setWorkers(wData || []); setEquipment(eData || []);
  };

  const addEquip = (bId: number, equipId: string) => {
    const equip = equipment.find(e => e.id == equipId);
    if (!equip) return;
    // පැරණි ඒවා තබාගෙන අලුත් ඒවා එකතු කිරීම
    setSelectedEquip(prev => ({ ...prev, [bId]: [...(prev[bId] || []), equip] }));
  };

  const removeEquip = (bId: number, equipId: number) => {
    setSelectedEquip(prev => ({ ...prev, [bId]: (prev[bId] || []).filter(e => e.id !== equipId) }));
  };

  const deleteBooking = async (id: number) => {
    await supabase.from("bookings").delete().eq("id", id);
    fetchData();
  };

  const handleSave = async (id: number, action: string) => {
    const final = editForm.total_balance - (editForm.total_balance * (editForm.discount || 0) / 100);
    await supabase.from("bookings").update({ 
        ...editForm, 
        final_balance: final, 
        workers: selectedWorkers[id], 
        equipment: selectedEquip[id] 
    }).eq("id", id);
    
    if (action === "send") {
      const msg = `Booking Confirmed! Final: Rs.${final}`;
      window.open(`https://wa.me/${editForm.customer_phone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
    setEditingId(null); fetchData();
  };

  return (
    <main className="p-8 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <button onClick={() => router.push("/admin")} className="bg-red-600 text-white px-4 py-2 rounded">Back</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white p-6 rounded-xl border shadow-sm">
            {editingId === b.id ? (
              <div className="space-y-2">
                <input className="w-full border p-2 text-sm" defaultValue={b.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} placeholder="Client Name" />
                <input type="number" className="w-full border p-2 text-sm" defaultValue={b.total_balance} onChange={e => setEditForm({...editForm, total_balance: Number(e.target.value)})} placeholder="Amount" />
                
                <div className="text-xs font-bold mt-2">Add Equipment:</div>
                <select className="w-full border p-2 text-sm" onChange={(e) => addEquip(b.id, e.target.value)}>
                  <option>Select Equipment</option>
                  {equipment.map(e => <option key={e.id} value={e.id}>{e.brand}</option>)}
                </select>
                <div className="flex flex-wrap gap-1">
                  {selectedEquip[b.id]?.map((e, idx) => (
                    <button key={idx} onClick={() => removeEquip(b.id, e.id)} className="bg-red-100 text-[10px] p-1 rounded">X {e.brand}</button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button onClick={() => handleSave(b.id, "close")} className="bg-black text-white p-2 text-xs rounded">Save & Close</button>
                  <button onClick={() => handleSave(b.id, "send")} className="bg-blue-600 text-white p-2 text-xs rounded">Save & Send WA</button>
                  <button onClick={() => window.print()} className="bg-green-600 text-white p-2 text-xs rounded">Print Bill</button>
                  <button onClick={() => deleteBooking(b.id)} className="bg-red-600 text-white p-2 text-xs rounded">Delete</button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="font-bold text-lg">{b.full_name}</h2>
                <p className="text-sm">Balance: Rs. {b.final_balance || b.total_balance}</p>
                <button onClick={() => {setEditingId(b.id); setEditForm(b); setSelectedEquip({[b.id]: b.equipment || []});}} className="mt-4 text-blue-600 underline">Edit Details</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}