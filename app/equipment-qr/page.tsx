"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { supabase } from "@/lib/supabase";

interface Equipment {
  id: number;
  item_name: string;
  category: string;
  qr_code: string;
}

export default function EquipmentQRPage() {

  const [equipment, setEquipment] =
    useState<Equipment[]>([]);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {

    const { data } = await supabase
      .from("equipment")
      .select("*")
      .order("id", { ascending: false });

    if (data) {

      for (const item of data) {

        if (!item.qr_code) {

          const qrValue =
            `EQUIPMENT-${item.id}`;

          await supabase
            .from("equipment")
            .update({
              qr_code: qrValue,
            })
            .eq("id", item.id);

          item.qr_code = qrValue;
        }
      }

      setEquipment(data);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-10">
        Equipment QR Codes
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {equipment.map((item) => (

          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center"
          >

            <div className="bg-white p-4 rounded-2xl mb-4">

              <QRCode
                value={item.qr_code}
                size={180}
              />

            </div>

            <h2 className="text-2xl font-bold text-red-500 mb-2">

              {item.item_name}

            </h2>

            <p className="text-gray-400 mb-2">

              {item.category}

            </p>

            <p className="text-sm text-gray-500">

              {item.qr_code}

            </p>

          </div>

        ))}

      </div>

    </main>
  );
}