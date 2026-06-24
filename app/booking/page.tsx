"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [selectedEquip, setSelectedEquip] = useState<Record<number, any[]>>({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: bData } = await supabase.from("bookings").select("*");
    const { data: eData } = await supabase.from("equipment").select("*");
    setBookings(bData || []);
    setEquipment(eData || []);
  };

  const addEquip = (bId: number, equipId: string) => {
    const equip = equipment.find(e => e.id == equipId);
    if (!equip) return;
    setSelectedEquip(prev => ({ ...prev, [bId]: [...(prev[bId] || []), equip] }));
  };

  const removeEquip = (bId: number, equipId: number) => {
    setSelectedEquip(prev => ({ ...prev, [bId]: (prev[bId] || []).filter(e => e.id !== equipId) }));
  };

  const handleAction = async (b: any, action: string) => {
    if (action === "delete") {
      await supabase.from("bookings").delete().eq("id", b.id);
    } else {
      const final = editForm.total_balance - (editForm.total_balance * (editForm.discount || 0) / 100);
      await supabase.from("bookings").update({ 
        ...editForm, 
        final_balance: final,
        equipment: selectedEquip[b.id]
      }).eq("id", b.id);
      
      if (action === "send") {
        window.open(`https://wa.me/${editForm.customer_phone}?text=Booking Confirmed! Final: Rs.${final}`, '_blank');
      }
      if (action === "print") window.print();
    }
    setEditingId(null);
    fetchData();
  };

  return (
    <main className="p-8 bg-gray-50 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white p-6 rounded-xl border shadow">
            {editingId === b.id ? (
              <div className="space-y-3">
                <input className="w-full border p-2 text-sm" defaultValue={b.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} placeholder="Client Name" />
                <input className="w-full border p-2 text-sm" defaultValue={b.customer_phone} onChange={e => setEditForm({...editForm, customer_phone: e.target.value})} placeholder="Phone" />
                <input className="w-full border p-2 text-sm" defaultValue={b.customer_email} onChange={e => setEditForm({...editForm, customer_email: e.target.value})} placeholder="Email" />
                <input type="number" className="w-full border p-2 text-sm" defaultValue={b.total_balance} onChange={e => setEditForm({...editForm, total_balance: Number(e.target.value)})} placeholder="Amount" />
                <input type="number" className="w-full border p-2 text-sm" defaultValue={b.discount || 0} onChange={e => setEditForm({...editForm, discount: Number(e.target.value)})} placeholder="Discount %" />
                
                <select className="w-full border p-2 text-sm" onChange={(e) => addEquip(b.id, e.target.value)}>
                  <option>Add Equipment</option>
                  {equipment.map(e => <option key={e.id} value={e.id}>{e.brand}</option>)}
                </select>
                <div className="flex flex-wrap gap-1">
                  {selectedEquip[b.id]?.map((e, i) => (
                    <button key={i} onClick={() => removeEquip(b.id, e.id)} className="bg-red-200 text-[10px] p-1 rounded">X {e.brand}</button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button onClick={() => handleAction(b, "save")} className="bg-black text-white p-2 text-xs rounded">Save & Close</button>
                  <button onClick={() => handleAction(b, "send")} className="bg-blue-600 text-white p-2 text-xs rounded">Save & Send WA</button>
                  <button onClick={() => handleAction(b, "print")} className="bg-green-600 text-white p-2 text-xs rounded">Print Bill</button>
                  <button onClick={() => handleAction(b, "delete")} className="bg-red-600 text-white p-2 text-xs rounded">Delete Booking</button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="font-bold text-lg">{b.full_name}</h2>
                <p className="text-sm">Phone: {b.customer_phone} | Email: {b.customer_email}</p>
                <p className="text-sm font-bold mt-2">Balance: Rs. {b.final_balance || b.total_balance}</p>
                <button onClick={() => {setEditingId(b.id); setEditForm(b); setSelectedEquip({[b.id]: b.equipment || []});}} className="mt-4 text-blue-600 underline">Edit Details</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}