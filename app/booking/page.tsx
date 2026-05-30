"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

interface Booking {
  id: number;
  full_name: string;
  phone: string;
  event_date: string;
  location: string;
  status: string;
}

interface Worker {
  id: number;
  name: string;
}

interface Equipment {
  id: number;
  item_type: string;
  brand: string;
  model: string;
}

export default function BookingPage() {

  const router = useRouter();

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [workers, setWorkers] =
    useState<Worker[]>([]);

  const [equipment, setEquipment] =
    useState<Equipment[]>([]);

  const [expandedBooking, setExpandedBooking] =
    useState<number | null>(null);

  const [editBooking, setEditBooking] =
    useState<Booking | null>(null);

  const [selectedWorkers, setSelectedWorkers] =
    useState<number[]>([]);

  const [selectedEquipment, setSelectedEquipment] =
    useState<number[]>([]);

  useEffect(() => {

    fetchBookings();

    fetchWorkers();

    fetchEquipment();

  }, []);

  const fetchBookings = async () => {

    const { data } =
      await supabase
        .from("bookings")
        .select("*")
        .order("id", {
          ascending: false,
        });

    if (data) {

      setBookings(data);
    }
  };

  const fetchWorkers = async () => {

    const { data } =
      await supabase
        .from("users")
        .select("id, name")
        .eq("role", "worker");

    if (data) {

      setWorkers(data);
    }
  };

  const fetchEquipment =
    async () => {

      const { data } =
        await supabase
          .from("equipment")
          .select("*")
          .eq(
            "status",
            "Available"
          );

      if (data) {

        setEquipment(data);
      }
    };

  const updateStatus =
    async (
      bookingId: number,
      status: string
    ) => {

      await supabase
        .from("bookings")
        .update({
          status,
        })
        .eq("id", bookingId);

      fetchBookings();
    };

  const deleteBooking =
    async (
      bookingId: number
    ) => {

      const confirmDelete =
        confirm(
          "Delete booking?"
        );

      if (!confirmDelete)
        return;

      await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      fetchBookings();
    };

  const saveBookingEdit =
    async () => {

      if (!editBooking)
        return;

      await supabase
        .from("bookings")
        .update({
          full_name:
            editBooking.full_name,

          phone:
            editBooking.phone,

          event_date:
            editBooking.event_date,

          location:
            editBooking.location,
        })
        .eq("id", editBooking.id);

      alert(
        "Booking Updated"
      );

      setEditBooking(null);

      fetchBookings();
    };

  const toggleWorker = (
    workerId: number
  ) => {

    setSelectedWorkers(
      (prev) => {

        if (
          prev.includes(workerId)
        ) {

          return prev.filter(
            (id) =>
              id !== workerId
          );
        }

        return [
          ...prev,
          workerId,
        ];
      }
    );
  };

  const toggleEquipment =
    (
      equipmentId: number
    ) => {

      setSelectedEquipment(
        (prev) => {

          if (
            prev.includes(
              equipmentId
            )
          ) {

            return prev.filter(
              (id) =>
                id !==
                equipmentId
            );
          }

          return [
            ...prev,
            equipmentId,
          ];
        }
      );
    };

  const assignWorkers =
    async (
      bookingId: number
    ) => {

      if (
        selectedWorkers.length === 0
      ) {

        alert(
          "Select workers"
        );

        return;
      }

      const insertData =
        selectedWorkers.map(
          (workerId) => ({
            booking_id:
              bookingId,
            worker_id:
              workerId,
          })
        );

      await supabase
        .from(
          "booking_workers"
        )
        .insert(insertData);

      alert(
        "Workers Assigned"
      );

      setSelectedWorkers([]);
    };

  const assignEquipment =
    async (
      bookingId: number
    ) => {

      if (
        selectedEquipment.length === 0
      ) {

        alert(
          "Select equipment"
        );

        return;
      }

      const insertData =
        selectedEquipment.map(
          (equipmentId) => ({
            booking_id:
              bookingId,
            equipment_id:
              equipmentId,
          })
        );

      await supabase
        .from(
          "booking_equipment"
        )
        .insert(insertData);

      for (const id of selectedEquipment) {

        await supabase
          .from("equipment")
          .update({
            status:
              "In Use",
          })
          .eq("id", id);
      }

      alert(
        "Equipment Assigned"
      );

      setSelectedEquipment([]);

      fetchEquipment();
    };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-bold text-red-500">

            Booking Management

          </h1>

          <p className="text-gray-400 mt-2">

            Professional Event Dashboard

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

      <div className="grid gap-4">

        {bookings.map((booking) => (

          <div
            key={booking.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5"
          >

            <div className="flex justify-between items-center flex-wrap gap-4">

              <div>

                <h2 className="text-2xl font-bold text-red-500">

                  {booking.full_name}

                </h2>

                <p className="text-gray-400">

                  {booking.event_date}

                </p>

              </div>

              <div className="flex items-center gap-3 flex-wrap">

                <span className="bg-black px-4 py-2 rounded-xl border border-zinc-700">

                  {booking.status}

                </span>

                <button
                  onClick={() =>
                    setExpandedBooking(
                      expandedBooking ===
                        booking.id
                        ? null
                        : booking.id
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-bold"
                >

                  {expandedBooking ===
                  booking.id
                    ? "Close"
                    : "Open"}

                </button>

              </div>

            </div>

            {expandedBooking ===
              booking.id && (

              <div className="mt-8 border-t border-zinc-800 pt-8">

                <div className="grid md:grid-cols-2 gap-8">

                  <div>

                    <h3 className="text-2xl font-bold mb-5">

                      Booking Details

                    </h3>

                    <div className="space-y-3 text-gray-300">

                      <p>

                        Phone:
                        {" "}
                        {booking.phone}

                      </p>

                      <p>

                        Location:
                        {" "}
                        {booking.location}

                      </p>

                    </div>

                    <div className="flex gap-3 flex-wrap mt-6">

                      <button
                        onClick={() =>
                          updateStatus(
                            booking.id,
                            "Pending"
                          )
                        }
                        className="bg-yellow-600 px-4 py-2 rounded-xl font-bold"
                      >

                        Pending

                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            booking.id,
                            "Confirmed"
                          )
                        }
                        className="bg-green-600 px-4 py-2 rounded-xl font-bold"
                      >

                        Confirm

                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            booking.id,
                            "Completed"
                          )
                        }
                        className="bg-blue-600 px-4 py-2 rounded-xl font-bold"
                      >

                        Complete

                      </button>

                      <button
                        onClick={() =>
                          setEditBooking(
                            booking
                          )
                        }
                        className="bg-purple-600 px-4 py-2 rounded-xl font-bold"
                      >

                        Edit

                      </button>

                      <button
                        onClick={() =>
                          deleteBooking(
                            booking.id
                          )
                        }
                        className="bg-red-600 px-4 py-2 rounded-xl font-bold"
                      >

                        Delete

                      </button>

                    </div>

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold mb-5">

                      Assign Workers

                    </h3>

                    <div className="grid gap-3">

                      {workers.map(
                        (worker) => (

                          <label
                            key={
                              worker.id
                            }
                            className="bg-black border border-zinc-700 rounded-2xl p-3 flex items-center gap-3"
                          >

                            <input
                              type="checkbox"
                              checked={selectedWorkers.includes(
                                worker.id
                              )}
                              onChange={() =>
                                toggleWorker(
                                  worker.id
                                )
                              }
                            />

                            <span>

                              {
                                worker.name
                              }

                            </span>

                          </label>

                        )
                      )}

                    </div>

                    <button
                      onClick={() =>
                        assignWorkers(
                          booking.id
                        )
                      }
                      className="mt-5 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-bold"
                    >

                      Assign Workers

                    </button>

                    <h3 className="text-2xl font-bold mt-10 mb-5">

                      Assign Equipment

                    </h3>

                    <div className="grid gap-3">

                      {equipment.map(
                        (item) => (

                          <label
                            key={item.id}
                            className="bg-black border border-zinc-700 rounded-2xl p-3 flex items-center gap-3"
                          >

                            <input
                              type="checkbox"
                              checked={selectedEquipment.includes(
                                item.id
                              )}
                              onChange={() =>
                                toggleEquipment(
                                  item.id
                                )
                              }
                            />

                            <span>

                              {
                                item.item_type
                              }
                              {" - "}
                              {
                                item.brand
                              }
                              {" "}
                              {
                                item.model
                              }

                            </span>

                          </label>

                        )
                      )}

                    </div>

                    <button
                      onClick={() =>
                        assignEquipment(
                          booking.id
                        )
                      }
                      className="mt-5 bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-bold"
                    >

                      Assign Equipment

                    </button>

                  </div>

                </div>

              </div>

            )}

          </div>

        ))}

      </div>

      {editBooking && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">

          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-8">

              Edit Booking

            </h2>

            <div className="grid gap-5">

              <input
                type="text"
                value={
                  editBooking.full_name
                }
                onChange={(e) =>
                  setEditBooking({
                    ...editBooking,
                    full_name:
                      e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
              />

              <input
                type="text"
                value={
                  editBooking.phone
                }
                onChange={(e) =>
                  setEditBooking({
                    ...editBooking,
                    phone:
                      e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
              />

              <input
                type="date"
                value={
                  editBooking.event_date
                }
                onChange={(e) =>
                  setEditBooking({
                    ...editBooking,
                    event_date:
                      e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
              />

              <input
                type="text"
                value={
                  editBooking.location
                }
                onChange={(e) =>
                  setEditBooking({
                    ...editBooking,
                    location:
                      e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
              />

              <div className="flex gap-4 mt-4">

                <button
                  onClick={
                    saveBookingEdit
                  }
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl font-bold"
                >

                  Save

                </button>

                <button
                  onClick={() =>
                    setEditBooking(
                      null
                    )
                  }
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-bold"
                >

                  Cancel

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}