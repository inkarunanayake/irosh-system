"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  
  const [selectedWorkers, setSelectedWorkers] = useState<Record<number, any[]>>({});
  const [selectedEquip, setSelectedEquip] = useState<Record<number, any[]>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: bData } = await supabase.from("bookings").select("*");
    const localBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings([...(bData || []), ...localBookings]);
    
    const { data: wData } = await supabase.from("users").select("id, name").eq("role", "worker");
    const { data: eData } = await supabase.from("equipment").select("*");
    setWorkers(wData || []);
    setEquipment(eData || []);
  };

  const toggleWorker = (bId: number, worker: any) => {
    setSelectedWorkers(prev => {
      const current = prev[bId] || [];
      const exists = current.find(w => w.id === worker.id);
      return { 
        ...prev, 
        [bId]: exists ? current.filter(w => w.id !== worker.id) : [...current, worker] 
      };
    });
  };

  const addEquip = (bId: number, equip: any) => {
    if (!equip) return;
    setSelectedEquip(prev => {
      const current = prev[bId] || [];
      if (current.find(e => e.id === equip.id)) return prev;
      return { ...prev, [bId]: [...current, equip] };
    });
  };

  const saveFinalBill = async (id: number) => {
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
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <button onClick={() => router.push("/admin")} className="bg-red-600 text-white px-4 py-2 rounded">Back to Dashboard</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-xl border shadow-sm">
            {editingId === b.id ? (
              <div className="space-y-3">
                <input className="w-full border p-2 text-sm" defaultValue={b.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} placeholder="Client Name" />
                <input className="w-full border p-2 text-sm" defaultValue={b.customer_phone} onChange={e => setEditForm({...editForm, customer_phone: e.target.value})} placeholder="Phone" />
                <input type="number" className="w-full border p-2 text-sm" defaultValue={b.total_balance} onChange={e => setEditForm({...editForm, total_balance: Number(e.target.value)})} placeholder="Amount" />
                <input type="number" className="w-full border p-2 text-sm" defaultValue={b.discount} onChange={e => setEditForm({...editForm, discount: Number(e.target.value)})} placeholder="Discount %" />
                
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs font-bold w-full">Workers:</p>
                  {workers.map(w => (
                    <button key={w.id} onClick={() => toggleWorker(b.id, w)} className={`p-1 text-xs border ${selectedWorkers[b.id]?.find(sw => sw.id === w.id) ? 'bg-black text-white' : ''}`}>
                      {w.name}
                    </button>
                  ))}
                </div>

                <select className="w-full border p-2 text-sm" onChange={(e) => addEquip(b.id, equipment.find(eq => eq.id == e.target.value))}>
                  <option>Select Equipment</option>
                  {equipment.map(e => <option key={e.id} value={e.id}>{e.brand}</option>)}
                </select>

                <button onClick={() => saveFinalBill(b.id)} className="w-full bg-black text-white py-2 rounded">Save & Print Bill</button>
              </div>
            ) : (
              <div>
                <h2 className="font-bold">{b.full_name}</h2>
                <p className="text-sm">Final Balance: Rs. {b.final_balance || b.total_balance}</p>
                <button onClick={() => {setEditingId(b.id); setEditForm(b);}} className="mt-4 text-blue-600 underline">Edit Full Details</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}