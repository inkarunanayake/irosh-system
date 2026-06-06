"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [search, setSearch] = useState("");
  
  const [selectedShifts, setSelectedShifts] = useState<Record<number, string>>({});
  const [selectedWorkers, setSelectedWorkers] = useState<Record<number, number[]>>({});
  const [selectedEquip, setSelectedEquip] = useState<Record<number, any[]>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: bData } = await supabase.from("bookings").select("*").order("event_date", { ascending: true });
    const { data: wData } = await supabase.from("users").select("id, name").eq("role", "worker");
    const { data: eData } = await supabase.from("equipment").select("*");
    
    if (bData) setBookings(bData);
    if (wData) setWorkers(wData);
    if (eData) setEquipment(eData);
  };

  // වර්කර් එකම දිනක වෙනත් තැනක වැඩ කරන්නේ දැයි පරීක්ෂා කිරීම
  const isWorkerBusy = (workerId: number, date: string, bookingId: number) => {
    return bookings.some(b => 
      b.id !== bookingId && 
      b.event_date === date && 
      selectedWorkers[b.id]?.includes(workerId)
    );
  };

  const toggleWorker = (bookingId: number, workerId: number, date: string) => {
    if (isWorkerBusy(workerId, date, bookingId)) {
      alert("⚠️ Warning: This worker is already assigned to another booking on this date!");
      return;
    }
    setSelectedWorkers(prev => ({
      ...prev,
      [bookingId]: prev[bookingId]?.includes(workerId) 
        ? prev[bookingId].filter(id => id !== workerId) 
        : [...(prev[bookingId] || []), workerId]
    }));
  };

  const updateEquipQty = (bookingId: number, equip: any, qty: number) => {
    setSelectedEquip(prev => ({
      ...prev,
      [bookingId]: [
        ...(prev[bookingId] || []).filter((e: any) => e.id !== equip.id), 
        { ...equip, qty }
      ]
    }));
  };

  const saveBooking = async (bookingId: number) => {
    // 1. Shift Update
    await supabase.from("bookings").update({ shift: selectedShifts[bookingId] || 'Day' }).eq("id", bookingId);
    
    // 2. Clear old assignments
    await supabase.from("booking_workers").delete().eq("booking_id", bookingId);
    await supabase.from("booking_equipment").delete().eq("booking_id", bookingId);
    
    // 3. Insert new
    if (selectedWorkers[bookingId]) 
      await supabase.from("booking_workers").insert(selectedWorkers[bookingId].map(wId => ({ booking_id: bookingId, worker_id: wId })));
    if (selectedEquip[bookingId]) 
      await supabase.from("booking_equipment").insert(selectedEquip[bookingId].filter((e:any) => e.qty > 0).map(e => ({ booking_id: bookingId, equipment_id: e.id, quantity: e.qty })));
    
    alert("Booking updated successfully!");
  };

  const getBalance = (b: any) => (b.total_amount || 0) - (b.advance_amount || 0);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-500">Booking Management</h1>
            <button onClick={() => router.push("/admin")} className="bg-zinc-800 px-4 py-2 rounded-lg text-sm">Back</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-zinc-900 p-2 rounded-lg text-sm border border-zinc-700">
            {[2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="bg-zinc-900 p-2 rounded-lg text-sm border border-zinc-700">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <input type="text" placeholder="Search by name..." onChange={(e) => setSearch(e.target.value)} className="bg-zinc-900 p-2 rounded-lg flex-1 text-sm border border-zinc-700" />
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.filter(b => {
            const d = new Date(b.event_date);
            return d.getFullYear() === selectedYear && (d.getMonth() + 1) === selectedMonth && b.full_name?.toLowerCase().includes(search.toLowerCase());
        }).map((b) => (
          <div key={b.id} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl">
            <h2 className="text-xl font-bold text-red-500">{b.full_name}</h2>
            <div className="flex items-center gap-2 mt-2 text-sm font-bold bg-zinc-800 p-2 rounded-lg">
                <span>📅 {b.event_date}</span>
                <span className="text-zinc-600">|</span>
                <span>📍 {b.location}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-300 my-4 py-4 border-y border-zinc-800">
              <div><p className="text-gray-500">Phone</p><p>{b.phone}</p></div>
              <div><p className="text-gray-500">Event Type</p><p className="font-semibold text-white">{b.event_type}</p></div>
              <div className="col-span-2"><p className="text-gray-500">Balance</p><p className="text-red-400 font-bold text-lg">{getBalance(b)} LKR</p></div>
            </div>

            {/* Shift Selection */}
            <div className="mb-4">
              <p className="text-[10px] uppercase text-gray-500 mb-1">Assign Shift</p>
              <select className="w-full bg-black p-2 rounded-lg border border-zinc-700 text-xs" value={selectedShifts[b.id] || 'Day'} onChange={(e) => setSelectedShifts({...selectedShifts, [b.id]: e.target.value})}>
                <option value="Day">Day Shift</option>
                <option value="Night">Night Shift</option>
                <option value="Full">Full Day</option>
              </select>
            </div>

            {/* Workers */}
            <div className="mb-4">
              <p className="text-[10px] uppercase text-gray-500">Workers</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {workers.map(w => (
                  <button key={w.id} onClick={() => toggleWorker(b.id, w.id, b.event_date)} className={`px-3 py-1 rounded-lg text-xs border ${selectedWorkers[b.id]?.includes(w.id) ? 'bg-red-600' : 'bg-black border-zinc-700'}`}>{w.name}</button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="mb-4">
              <p className="text-[10px] uppercase text-gray-500">Equipment</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {equipment.map(e => (
                  <div key={e.id} className="flex justify-between items-center bg-black p-2 rounded-lg border border-zinc-700">
                    <span className="text-[10px] truncate">{e.brand}</span>
                    <input type="number" placeholder="0" className="w-10 bg-zinc-900 text-center text-[10px]" onChange={(val) => updateEquipQty(b.id, e, Number(val.target.value))} />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => saveBooking(b.id)} className="w-full bg-white text-black py-3 rounded-2xl text-sm font-bold hover:bg-zinc-200">Save Assignment</button>
          </div>
        ))}
      </div>
    </main>
  );
}