"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";

interface Equipment {
  id: number;
  item_name: string;
  category: string;
  brand: string;
  model: string;
  serial_number: string;
  status: string;
  condition: string;
  qr_code: string;
}

export default function ScannerPage() {

  const [equipment, setEquipment] =
    useState<Equipment | null>(null);

  useEffect(() => {

    const scanner =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250,
        },
        false
      );

    scanner.render(
      async (decodedText) => {

        scanner.clear();

        const { data } = await supabase
          .from("equipment")
          .select("*")
          .eq("qr_code", decodedText)
          .single();

        if (data) {

          setEquipment(data);

        } else {

          alert("Equipment not found");
        }
      },

      (error) => {
        console.log(error);
      }
    );

    return () => {
      scanner.clear();
    };

  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-10">
        QR Scanner
      </h1>

      {!equipment ? (

        <div
          id="reader"
          className="max-w-xl mx-auto bg-white rounded-3xl overflow-hidden"
        />

      ) : (

        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <h2 className="text-3xl font-bold text-red-500 mb-6">

            {equipment.item_name}

          </h2>

          <div className="space-y-4 text-gray-300">

            <p>

              <span className="text-white font-semibold">
                Category:
              </span>{" "}

              {equipment.category}

            </p>

            <p>

              <span className="text-white font-semibold">
                Brand:
              </span>{" "}

              {equipment.brand}

            </p>

            <p>

              <span className="text-white font-semibold">
                Model:
              </span>{" "}

              {equipment.model}

            </p>

            <p>

              <span className="text-white font-semibold">
                Serial:
              </span>{" "}

              {equipment.serial_number}

            </p>

            <p>

              <span className="text-white font-semibold">
                Status:
              </span>{" "}

              {equipment.status}

            </p>

            <p>

              <span className="text-white font-semibold">
                Condition:
              </span>{" "}

              {equipment.condition}

            </p>

            <p>

              <span className="text-white font-semibold">
                QR Code:
              </span>{" "}

              {equipment.qr_code}

            </p>

          </div>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-8 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl"
          >
            Scan Another
          </button>

        </div>

      )}

    </main>
  );
}