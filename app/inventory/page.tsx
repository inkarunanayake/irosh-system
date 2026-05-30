"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { QRCodeCanvas } from "qrcode.react";

interface Equipment {

  id: number;

  item_type: string;

  category: string;

  sub_category: string;

  brand: string;

  model: string;

  serial_number: string | null;

  condition: string;

  notes: string;

  status: string;

  qr_code: string | null;
}

export default function InventoryPage() {

  const router = useRouter();

  const [equipment, setEquipment] =
    useState<Equipment[]>([]);

  const [search, setSearch] =
    useState("");

  const [itemType, setItemType] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [subCategory, setSubCategory] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [model, setModel] =
    useState("");

  const [serialNumber, setSerialNumber] =
    useState("");

  const [condition, setCondition] =
    useState("Good");

  const [notes, setNotes] =
    useState("");

  useEffect(() => {

    checkAdmin();

    fetchEquipment();

  }, []);

  const checkAdmin = () => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {

      router.push("/login");

      return;
    }

    const parsedUser =
      JSON.parse(savedUser);

    if (
      parsedUser.role !== "admin"
    ) {

      router.push("/login");

      return;
    }
  };

  const fetchEquipment =
    async () => {

      const { data, error } =
        await supabase
          .from("equipment")
          .select("*")
          .order("id", {
            ascending: false,
          });

      if (error) {

        console.log(error);

        return;
      }

      if (data) {

        setEquipment(data);
      }
    };

  const addEquipment =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      const qrData =
        `QR-${Date.now()}`;

      const insertData = {

        item_type: itemType,

        category: category,

        sub_category:
          subCategory,

        brand: brand,

        model: model,

        serial_number:
          serialNumber.trim() === ""
            ? null
            : serialNumber,

        condition: condition,

        notes: notes,

        qr_code: qrData,

        status: "Available",
      };

      const { error } =
        await supabase
          .from("equipment")
          .insert([insertData]);

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      alert(
        "Equipment added"
      );

      setItemType("");

      setCategory("");

      setSubCategory("");

      setBrand("");

      setModel("");

      setSerialNumber("");

      setCondition("Good");

      setNotes("");

      fetchEquipment();
    };

  const deleteEquipment =
    async (id: number) => {

      const confirmDelete =
        confirm(
          "Delete equipment?"
        );

      if (!confirmDelete)
        return;

      const { error } =
        await supabase
          .from("equipment")
          .delete()
          .eq("id", id);

      if (error) {

        alert(error.message);

        return;
      }

      fetchEquipment();
    };

  const changeStatus =
    async (
      id: number,
      newStatus: string
    ) => {

      const { error } =
        await supabase
          .from("equipment")
          .update({
            status: newStatus,
          })
          .eq("id", id);

      if (error) {

        alert(error.message);

        return;
      }

      fetchEquipment();
    };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold">

            Equipment Inventory

          </h1>

          <p className="text-gray-400 mt-2">

            Manage all equipment

          </p>

        </div>

        <button
          onClick={() =>
            router.push("/admin")
          }
          className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 px-5 py-3 rounded-2xl font-bold"
        >

          Back

        </button>

      </div>

      <div className="mb-8">

        <input
          type="text"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4"
        />

      </div>

      <form
        onSubmit={addEquipment}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10 grid gap-5"
      >

        <input
          type="text"
          placeholder="Item Type"
          value={itemType}
          onChange={(e) =>
            setItemType(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        >

          <option value="">
            Select Category
          </option>

          <option>
            Camera
          </option>

          <option>
            Lighting
          </option>

          <option>
            Audio
          </option>

          <option>
            LED
          </option>

          <option>
            Streaming
          </option>

          <option>
            Power
          </option>

          <option>
            Accessories
          </option>

        </select>

        <input
          type="text"
          placeholder="Sub Category"
          value={subCategory}
          onChange={(e) =>
            setSubCategory(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) =>
            setBrand(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) =>
            setModel(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="Serial Number (Optional)"
          value={serialNumber}
          onChange={(e) =>
            setSerialNumber(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <select
          value={condition}
          onChange={(e) =>
            setCondition(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        >

          <option>
            Good
          </option>

          <option>
            Repair Needed
          </option>

          <option>
            Damaged
          </option>

        </select>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold"
        >

          Add Equipment

        </button>

      </form>

      <div className="grid gap-6">

        {equipment
          .filter((item) => {

            return (

              item.item_type
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||

              item.brand
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||

              item.category
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            );
          })
          .map((item) => (

            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
            >

              <div className="flex justify-between items-start flex-wrap gap-6">

                <div>

                  <h2 className="text-3xl font-bold text-red-500 mb-4">

                    {item.item_type}

                  </h2>

                  <div className="space-y-2 text-gray-300">

                    <p>

                      Category:
                      {" "}
                      {item.category}

                    </p>

                    <p>

                      Sub Category:
                      {" "}
                      {item.sub_category}

                    </p>

                    <p>

                      Brand:
                      {" "}
                      {item.brand}

                    </p>

                    <p>

                      Model:
                      {" "}
                      {item.model}

                    </p>

                    <p>

                      Serial:
                      {" "}
                      {item.serial_number || "N/A"}

                    </p>

                    <p>

                      Condition:
                      {" "}
                      {item.condition}

                    </p>

                    <p>

                      Status:
                      {" "}
                      {item.status}

                    </p>

                    <p>

                      Notes:
                      {" "}
                      {item.notes}

                    </p>

                  </div>

                  <div className="mt-5 bg-white p-3 rounded-xl inline-block">

                    <QRCodeCanvas
                      value={
                        item.qr_code || ""
                      }
                      size={140}
                      includeMargin={true}
                    />

                  </div>

                </div>

                <div className="flex gap-3 flex-wrap">

                  <button
                    onClick={() =>
                      changeStatus(
                        item.id,
                        "Available"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-bold"
                  >

                    Available

                  </button>

                  <button
                    onClick={() =>
                      changeStatus(
                        item.id,
                        "In Use"
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-bold"
                  >

                    In Use

                  </button>

                  <button
                    onClick={() =>
                      changeStatus(
                        item.id,
                        "Repair"
                      )
                    }
                    className="bg-yellow-600 hover:bg-yellow-700 px-5 py-3 rounded-xl font-bold"
                  >

                    Repair

                  </button>

                  <button
                    onClick={() =>
                      deleteEquipment(
                        item.id
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
                  >

                    Delete

                  </button>

                </div>

              </div>

            </div>

          ))}

      </div>

    </main>
  );
}