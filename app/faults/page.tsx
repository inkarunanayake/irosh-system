"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Equipment {
  id: number;
  item_name: string;
}

interface Fault {
  id: number;
  issue: string;
  reported_by: string;
  priority: string;
  status: string;
  technician_notes: string;
  equipment: {
    item_name: string;
  };
}

export default function FaultsPage() {

  const [equipment, setEquipment] =
    useState<Equipment[]>([]);

  const [faults, setFaults] =
    useState<Fault[]>([]);

  const [equipmentId, setEquipmentId] =
    useState("");

  const [issue, setIssue] =
    useState("");

  const [reportedBy, setReportedBy] =
    useState("");

  const [priority, setPriority] =
    useState("Medium");

  useEffect(() => {

    fetchEquipment();
    fetchFaults();

  }, []);

  const fetchEquipment = async () => {

    const { data } = await supabase
      .from("equipment")
      .select("id, item_name");

    if (data) {
      setEquipment(data);
    }
  };

  const fetchFaults = async () => {

    const { data } = await supabase
      .from("equipment_faults")
      .select(`
        id,
        issue,
        reported_by,
        priority,
        status,
        technician_notes,
        equipment (
          item_name
        )
      `)
      .order("id", { ascending: false });

    if (data) {
      setFaults(data as any);
    }
  };

  const addFault = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const { error } = await supabase
      .from("equipment_faults")
      .insert([
        {
          equipment_id: equipmentId,
          issue,
          reported_by: reportedBy,
          priority,
        },
      ]);

    if (error) {

      alert("Fault report failed");

    } else {

      alert("Fault reported");

      setEquipmentId("");
      setIssue("");
      setReportedBy("");
      setPriority("Medium");

      fetchFaults();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-10">
        Equipment Fault Reports
      </h1>

      <form
        onSubmit={addFault}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10 grid gap-6"
      >

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

        <textarea
          value={issue}
          onChange={(e) =>
            setIssue(e.target.value)
          }
          placeholder="Describe the issue"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          value={reportedBy}
          onChange={(e) =>
            setReportedBy(e.target.value)
          }
          placeholder="Reported By"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        >

          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>

        </select>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold"
        >
          Report Fault
        </button>

      </form>

      <div className="grid gap-6">

        {faults.map((fault) => (

          <div
            key={fault.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >

            <h2 className="text-2xl font-bold text-red-500 mb-4">

              {fault.equipment?.item_name}

            </h2>

            <div className="space-y-3 text-gray-300">

              <p>

                <span className="text-white font-semibold">
                  Issue:
                </span>{" "}

                {fault.issue}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Reported By:
                </span>{" "}

                {fault.reported_by}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Priority:
                </span>{" "}

                {fault.priority}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Status:
                </span>{" "}

                {fault.status}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Technician Notes:
                </span>{" "}

                {fault.technician_notes}

              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}