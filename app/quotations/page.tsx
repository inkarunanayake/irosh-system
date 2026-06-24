"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";

export default function QuotationsPage() {
  const router = useRouter();
  const quotationRef = useRef<HTMLDivElement>(null);
  
  const [clientName, setClientName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [defaultTermsList, setDefaultTermsList] = useState([
    "50% advance payment required for booking confirmation.",
    "The balance payment must be settled on the event day.",
    "Meals should be provided for the technical crew.",
    "Event time: Please specify the start and end time of the event.",
    "Equipment should be handled with care; any damage caused will be charged."
  ]);

  const addNewTerm = () => {
    if (newTerm.trim() !== "") {
      setDefaultTermsList([...defaultTermsList, newTerm]);
      setNewTerm("");
    }
  };

  const handleCheckboxChange = (term: string) => {
    setTerms((prev) => 
      prev.includes(term) ? prev.replace(term + "\n", "") : prev + term + "\n"
    );
  };

  const generatePDF = async () => {
    if (!quotationRef.current) return;
    
    // 1. PDF සෑදීම
    const canvas = await html2canvas(quotationRef.current, { backgroundColor: "#ffffff", useCORS: true, scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297); 
    pdf.save(`Quotation_${clientName || "Event"}.pdf`);
    
    // 2. Booking එකක් ලෙස Pending ලැයිස්තුවට එකතු කිරීම
    const newBooking = {
      id: Date.now(),
      full_name: clientName,
      location: eventName,
      event_date: eventDate,
      total_balance: amount,
      status: "Pending"
    };
    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([...existing, newBooking]));
    
    alert("Quotation saved and Booking added to Pending List!");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f4f4f4", padding: "20px" }}>
      <button onClick={() => router.push("/")} style={{ marginBottom: "20px", padding: "10px", background: "#333", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>← Back Home</button>
      
      {/* (මෙහි ඉහත සාකච්ඡා කළ Form සහ Letterhead Preview කොටස් ඇතුළත් වේ) */}
      
      <button onClick={generatePDF} style={{ padding: "15px", background: "#dc2626", color: "white", width: "100%", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
        Download PDF & Save Booking
      </button>
    </main>
  );
}