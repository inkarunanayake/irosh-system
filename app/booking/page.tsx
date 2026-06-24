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
    
    setBookings(bData || []);
    setWorkers(wData || []);
    setEquipment(eData || []);
  };

  // Multiple Workers Add/Remove
  const toggleWorker = (bId: number, worker: any) => {
    setSelectedWorkers(prev => {
      const current = prev[bId] || [];
      const exists = current.find(w => w.id === worker.id);
      return { ...prev, [bId]: exists ? current.filter(w => w.id !== worker.id) : [...current, worker] };
    });
  };

  // Multiple Equipment Add Logic (මකා නොදමා එකතු කිරීම)
  const addEquip = (bId: number, equipId: string) => {
    const equip = equipment.find(e => e.id == equipId);
    if (!equip) return;
    
    setSelectedEquip(prev => {
      const current = prev[bId] || [];
      // දැනටමත් තියෙන එකක් නම් නැවත එකතු නොකරයි
      if (current.find(e => e.id == equip.id)) return prev;
      return { ...prev, [bId]: [...current, equip] };
    });
  };

  const handleSave = async (id: number) => {
    const original = editForm.total_balance || 0;
    const disc = editForm.discount || 0;
    const final = original - (original * (disc / 100));
    
    await supabase.from("bookings").update({ 
      ...editForm, 
      final_balance: final,
      workers: selectedWorkers[id],
      equipment: selectedEquip[id]
    }).eq("id", id);
    
    setEditingId(null);
    fetchData();
    window.print();
  };

  return (
    <main className="p-8 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <button onClick={() => router.push("/admin")} className="bg-red-600 text-white px-4 py-2 rounded">Back to Admin</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white p-6 rounded-xl border shadow-sm">
            {editingId === b.id ? (
              <div className="space-y-3">
                <input className="w-full border p-2 text-sm" defaultValue={b.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} placeholder="Client Name" />
                <input className="w-full border p-2 text-sm" defaultValue={b.total_balance} onChange={e => setEditForm({...editForm, total_balance: Number(e.target.value)})} placeholder="Amount" />
                <input className="w-full border p-2 text-sm" defaultValue={b.discount || 0} onChange={e => setEditForm({...editForm, discount: Number(e.target.value)})} placeholder="Discount %" />
                
                <div className="text-xs font-bold">Workers:</div>
                <div className="flex flex-wrap gap-1">
                  {workers.map(w => (
                    <button key={w.id} onClick={() => toggleWorker(b.id, w)} className={`p-1 text-[10px] rounded border ${selectedWorkers[b.id]?.find(sw => sw.id === w.id) ? 'bg-black text-white' : 'bg-gray-200'}`}>{w.name}</button>
                  ))}
                </div>

                <div className="text-xs font-bold">Equipment:</div>
                <select className="w-full border p-2 text-sm" onChange={(e) => addEquip(b.id, e.target.value)}>
                  <option>Select Equipment</option>
                  {equipment.map(e => <option key={e.id} value={e.id}>{e.brand}</option>)}
                </select>
                
                <div className="text-[10px] text-gray-500">Selected: {selectedEquip[b.id]?.map(e => e.brand).join(", ")}</div>

                <button onClick={() => handleSave(b.id)} className="w-full bg-black text-white py-2 rounded font-bold">Save & Print Bill</button>
              </div>
            ) : (
              <div>
                <h2 className="font-bold text-lg">{b.full_name}</h2>
                <p className="text-sm">Final Balance: Rs. {b.final_balance || b.total_balance}</p>
                <button onClick={() => {setEditingId(b.id); setEditForm(b);}} className="mt-4 text-blue-600 underline">Edit Details</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}