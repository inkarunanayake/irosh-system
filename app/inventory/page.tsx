"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { QRCodeCanvas } from "qrcode.react";

export default function InventoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<any | null>(null);

  const [catName, setCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    item_type: "", brand: "", model: "", serial_number: "", 
    condition: "Available", notes: "", sub_category: "", quantity: 1
  });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data);
  };

  const fetchItems = async (catId: number) => {
    const { data } = await supabase.from("equipment").select("*").eq("category_id", catId);
    if (data) setItems(data);
  };

  const handleCategoryAction = async () => {
    if (!catName) return;
    if (editingCatId) {
      await supabase.from("categories").update({ name: catName }).eq("id", editingCatId);
      setEditingCatId(null);
    } else {
      await supabase.from("categories").insert([{ name: catName }]);
    }
    setCatName("");
    fetchCategories();
  };

  const deleteCat = async (id: number) => {
    if (confirm("Delete this category?")) {
      await supabase.from("categories").delete().eq("id", id);
      setActiveCat(null);
      fetchCategories();
    }
  };

  const startEdit = (cat: any) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
  };

  const addItem = async () => {
    if (!formData.item_type || !activeCat) return;
    const qrValue = `${formData.item_type}-${Date.now()}`;
    await supabase.from("equipment").insert([{ 
      ...formData, category_id: activeCat.id, qr_code: qrValue 
    }]);
    setFormData({ item_type: "", brand: "", model: "", serial_number: "", condition: "Available", notes: "", sub_category: "", quantity: 1 });
    fetchItems(activeCat.id);
  };

  const deleteItem = async (id: number) => {
    await supabase.from("equipment").delete().eq("id", id);
    fetchItems(activeCat.id);
  };

  return (
    <main className="p-6 bg-black text-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-500">IROSH ENTERTAINMENT</h1>
          <p className="text-gray-400">Inventory Management System</p>
        </div>
        
        <div className="flex gap-3">
          {/* Admin Panel Link */}
          <button 
            onClick={() => window.location.href = '/admin'} 
            className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-600 font-bold"
          >
            Go to Admin Panel
          </button>
          
          {activeCat && (
            <button onClick={() => setActiveCat(null)} className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600">
              ← Back to Inventory List
            </button>
          )}
        </div>
      </div>

      {!activeCat && (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700">
          <h2 className="text-xl font-bold mb-4">Inventory Categories</h2>
          <div className="flex gap-2 mb-6">
            <input className="bg-black p-2 rounded flex-1 border border-zinc-700" placeholder="Category Name" value={catName} onChange={(e) => setCatName(e.target.value)} />
            <button onClick={handleCategoryAction} className="bg-red-600 px-4 py-2 rounded font-bold">
              {editingCatId ? "Update Category" : "Add New Category"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-zinc-800 p-4 rounded border border-zinc-700 text-center">
                <h3 className="text-lg font-bold mb-4">{cat.name}</h3>
                <div className="flex justify-center gap-2">
                  <button onClick={() => { setActiveCat(cat); fetchItems(cat.id); }} className="bg-blue-600 px-3 py-1 rounded text-sm">View Items</button>
                  <button onClick={() => startEdit(cat)} className="bg-gray-600 px-3 py-1 rounded text-sm">Edit</button>
                  <button onClick={() => deleteCat(cat.id)} className="bg-red-600 px-3 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCat && (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Inventory: {activeCat.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input className="bg-black p-2 rounded border" placeholder="Item Name" value={formData.item_type} onChange={(e) => setFormData({...formData, item_type: e.target.value})} />
            <input className="bg-black p-2 rounded border" placeholder="Brand" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
            <input className="bg-black p-2 rounded border" placeholder="Model" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
            <input className="bg-black p-2 rounded border" placeholder="Serial Number" value={formData.serial_number} onChange={(e) => setFormData({...formData, serial_number: e.target.value})} />
            <input className="bg-black p-2 rounded border" placeholder="Sub Category" value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})} />
            <input className="bg-black p-2 rounded border" placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            <select className="bg-black p-2 rounded border" value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}>
              <option>Available</option><option>In-Use</option><option>Maintenance</option>
            </select>
            <input type="number" className="bg-black p-2 rounded border" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} />
            <button onClick={addItem} className="bg-blue-600 p-2 rounded font-bold col-span-full">Add New Equipment</button>
          </div>

          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-zinc-800 p-4 rounded border flex justify-between items-center">
                <div>
                  <p className="font-bold">{item.item_type} ({item.brand})</p>
                  <p className="text-xs text-gray-400">S/N: {item.serial_number} | {item.notes}</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div id={`qr-${item.id}`} className="bg-white p-1">
                    <QRCodeCanvas value={item.qr_code} size={150} />
                  </div>
                  <button onClick={() => {
                    const canvas = document.getElementById(`qr-${item.id}`)?.querySelector("canvas");
                    const url = canvas?.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = url || "";
                    link.download = `QR-${item.item_type}.png`;
                    link.click();
                  }} className="bg-green-600 text-xs px-2 py-1 rounded hover:bg-green-700">Download QR</button>
                </div>

                <button onClick={() => deleteItem(item.id)} className="text-red-500 text-sm">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}