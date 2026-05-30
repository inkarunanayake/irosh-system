"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Equipment {
  id: number;
  item_name: string;
  category: string;
  sub_category: string;
  brand: string;
  model: string;
  serial_number: string;
  quantity: number;
  status: string;
  condition: string;
  notes: string;
}

export default function EquipmentPage() {

  const [equipment, setEquipment] = useState<Equipment[]>([]);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    sub_category: "",
    brand: "",
    model: "",
    serial_number: "",
    quantity: 1,
    status: "Available",
    condition: "Good",
    notes: "",
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {

    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setEquipment(data);
    }

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addEquipment = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const { error } = await supabase
      .from("equipment")
      .insert([formData]);

    if (error) {

      alert("Failed to add equipment");

    } else {

      alert("Equipment added");

      setFormData({
        item_name: "",
        category: "",
        sub_category: "",
        brand: "",
        model: "",
        serial_number: "",
        quantity: 1,
        status: "Available",
        condition: "Good",
        notes: "",
      });

      fetchEquipment();
    }
  };

  const deleteEquipment = async (
    id: number
  ) => {

    const confirmDelete = confirm(
      "Delete this equipment?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("equipment")
      .delete()
      .eq("id", id);

    fetchEquipment();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-10">
        Equipment Inventory
      </h1>

      <form
        onSubmit={addEquipment}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10 grid md:grid-cols-2 gap-6"
      >

        <input
          type="text"
          name="item_name"
          value={formData.item_name}
          onChange={handleChange}
          placeholder="Item Name"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          name="sub_category"
          value={formData.sub_category}
          onChange={handleChange}
          placeholder="Sub Category"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Model"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <input
          type="text"
          name="serial_number"
          value={formData.serial_number}
          onChange={handleChange}
          placeholder="Serial Number"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        >

          <option>Available</option>
          <option>In Use</option>
          <option>Maintenance</option>
          <option>Broken</option>

        </select>

        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        >

          <option>Good</option>
          <option>Average</option>
          <option>Damaged</option>

        </select>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3 md:col-span-2"
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold md:col-span-2"
        >
          Add Equipment
        </button>

      </form>

      {loading ? (

        <p>Loading...</p>

      ) : (

        <div className="grid gap-6">

          {equipment.map((item) => (

            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                <div>

                  <div className="flex items-center gap-4 mb-4">

                    <h2 className="text-2xl font-bold text-red-500">
                      {item.item_name}
                    </h2>

                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                      {item.status}
                    </span>

                  </div>

                  <div className="space-y-2 text-gray-300">

                    <p>
                      <span className="text-white font-semibold">
                        Category:
                      </span>{" "}
                      {item.category}
                    </p>

                    <p>
                      <span className="text-white font-semibold">
                        Sub Category:
                      </span>{" "}
                      {item.sub_category}
                    </p>

                    <p>
                      <span className="text-white font-semibold">
                        Brand:
                      </span>{" "}
                      {item.brand}
                    </p>

                    <p>
                      <span className="text-white font-semibold">
                        Model:
                      </span>{" "}
                      {item.model}
                    </p>

                    <p>
                      <span className="text-white font-semibold">
                        Serial:
                      </span>{" "}
                      {item.serial_number}
                    </p>

                    <p>
                      <span className="text-white font-semibold">
                        Quantity:
                      </span>{" "}
                      {item.quantity}
                    </p>

                    <p>
                      <span className="text-white font-semibold">
                        Condition:
                      </span>{" "}
                      {item.condition}
                    </p>

                    <p>
                      <span className="text-white font-semibold">
                        Notes:
                      </span>{" "}
                      {item.notes}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    deleteEquipment(item.id)
                  }
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>
  );
}