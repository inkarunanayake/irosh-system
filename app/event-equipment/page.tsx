"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: number;
  full_name: string;
}

interface Equipment {
  id: number;
  item_name: string;
}

interface AssignedEquipment {
  id: number;
  quantity: number;
  bookings: {
    full_name: string;
  };
  equipment: {
    item_name: string;
  };
}

export default function EventEquipmentPage() {

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  const [assigned, setAssigned] = useState<
    AssignedEquipment[]
  >([]);

  const [bookingId, setBookingId] =
    useState("");

  const [equipmentId, setEquipmentId] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  useEffect(() => {

    fetchBookings();
    fetchEquipment();
    fetchAssigned();

  }, []);

  const fetchBookings = async () => {

    const { data } = await supabase
      .from("bookings")
      .select("id, full_name");

    if (data) {
      setBookings(data);
    }
  };

  const fetchEquipment = async () => {

    const { data } = await supabase
      .from("equipment")
      .select("id, item_name");

    if (data) {
      setEquipment(data);
    }
  };

  const fetchAssigned = async () => {

    const { data } = await supabase
      .from("event_equipment")
      .select(`
        id,
        quantity,
        bookings (
          full_name
        ),
        equipment (
          item_name
        )
      `)
      .order("id", { ascending: false });

    if (data) {
      setAssigned(data as any);
    }
  };

  const assignEquipment = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const { error } = await supabase
      .from("event_equipment")
      .insert([
        {
          booking_id: bookingId,
          equipment_id: equipmentId,
          quantity,
        },
      ]);

    if (error) {

      alert("Assignment failed");

    } else {

      alert("Equipment assigned");

      setBookingId("");
      setEquipmentId("");
      setQuantity(1);

      fetchAssigned();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-10">
        Event Equipment Assign
      </h1>

      <form
        onSubmit={assignEquipment}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10 grid gap-6"
      >

        <select
          value={bookingId}
          onChange={(e) =>
            setBookingId(e.target.value)
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        >

          <option value="">
            Select Booking
          </option>

          {bookings.map((booking) => (

            <option
              key={booking.id}
              value={booking.id}
            >
              {booking.full_name}
            </option>

          ))}

        </select>

        <select
          value={equipmentId}
          onChange={(e) =>
            setEquipmentId(e.target.value)
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        >

          <option value="">
            Select Equipment
          </option>

          {equipment.map((item) => (

            <option
              key={item.id}
              value={item.id}
            >
              {item.item_name}
            </option>

          ))}

        </select>

        <input
          type="number"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
          placeholder="Quantity"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold"
        >
          Assign Equipment
        </button>

      </form>

      <div className="grid gap-6">

        {assigned.map((item) => (

          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >

            <h2 className="text-2xl font-bold text-red-500 mb-4">

              {item.bookings?.full_name}

            </h2>

            <div className="space-y-2 text-gray-300">

              <p>

                <span className="text-white font-semibold">
                  Equipment:
                </span>{" "}

                {item.equipment?.item_name}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Quantity:
                </span>{" "}

                {item.quantity}

              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}