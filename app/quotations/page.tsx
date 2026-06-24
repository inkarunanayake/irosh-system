"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";

export default function QuotationsPage() {
  const router = useRouter();
  const quotationRef = useRef<HTMLDivElement>(null);

  // States
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
    const canvas = await html2canvas(quotationRef.current, { backgroundColor: "#ffffff", useCORS: true, scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297); 
    pdf.save(`Quotation_${clientName || "Event"}.pdf`);
    
    // Save to LocalStorage for BookingPage
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
    alert("Quotation downloaded & Booking saved as Pending!");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f4f4f4", padding: "20px" }}>
      {/* Admin Dashboard වෙත යන බොත්තම */}
      <button 
        onClick={() => router.push("/admin")} 
        style={{ marginBottom: "20px", padding: "10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
      >
        ← Back to Admin Dashboard
      </button>
      
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/* Input Form */}
        <div style={{ width: "400px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "#000", marginBottom: "15px" }}>Quotation Details</h2>
          <label style={{ fontWeight: "bold", color: "#000" }}>Client Name</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", color: "#000" }} />
          
          <label style={{ fontWeight: "bold", color: "#000" }}>Event Name</label>
          <input value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", color: "#000" }} />
          
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", color: "#000" }}>Date</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: "100%", padding: "8px", color: "#000" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", color: "#000" }}>Time</label>
              <input value={eventTime} onChange={(e) => setEventTime(e.target.value)} style={{ width: "100%", padding: "8px", color: "#000" }} />
            </div>
          </div>

          <label style={{ marginTop: "10px", display: "block", fontWeight: "bold", color: "#000" }}>Package Details</label>
          <textarea value={packageName} onChange={(e) => setPackageName(e.target.value)} style={{ width: "100%", height: "80px", color: "#000" }} />

          <label style={{ marginTop: "10px", display: "block", fontWeight: "bold", color: "#000" }}>Total Amount (Rs.)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", color: "#000" }} />
          
          <label style={{ fontWeight: "bold", color: "#000" }}>Select Terms:</label>
          {defaultTermsList.map((term, index) => (
            <div key={index}><label style={{ fontSize: "13px", color: "#000" }}><input type="checkbox" onChange={() => handleCheckboxChange(term)} /> {term}</label></div>
          ))}
          
          <div style={{ marginTop: "10px" }}>
            <input value={newTerm} onChange={(e) => setNewTerm(e.target.value)} placeholder="Add new term..." style={{ width: "70%", padding: "5px", color: "#000" }} />
            <button onClick={addNewTerm} style={{ padding: "5px", background: "#333", color: "#fff" }}>Add</button>
          </div>

          <label style={{ marginTop: "10px", display: "block", fontWeight: "bold", color: "#000" }}>Edit Terms:</label>
          <textarea value={terms} onChange={(e) => setTerms(e.target.value)} style={{ width: "100%", height: "80px", color: "#000" }} />
          
          <button onClick={generatePDF} style={{ marginTop: "15px", width: "100%", padding: "12px", background: "#dc2626", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>Download PDF & Save Booking</button>
        </div>

        {/* Letterhead Preview */}
        <div ref={quotationRef} style={{ background: "#fff", color: "#000", width: "210mm", minHeight: "297mm", backgroundImage: "url('/irosh-letterhead.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div style={{ paddingTop: "250px", paddingLeft: "50px", paddingRight: "50px" }}> 
            <p><strong>To:</strong> {clientName} | <strong>Event:</strong> {eventName} | <strong>Date:</strong> {eventDate} | <strong>Time:</strong> {eventTime}</p>
            
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead><tr style={{ background: "#eee" }}><th style={{ padding: "10px", border: "1px solid #999" }}>Description</th><th style={{ padding: "10px", border: "1px solid #999" }}>Amount (Rs)</th></tr></thead>
              <tbody>
                <tr>
                  <td style={{ padding: "20px", border: "1px solid #999", height: "300px", verticalAlign: "top" }}>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{packageName}</pre>
                  </td>
                  <td style={{ padding: "20px", border: "1px solid #999", verticalAlign: "top", textAlign: "right" }}>{amount ? Number(amount).toLocaleString() : "-"}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: "40px" }}>
              <p style={{ fontWeight: "bold", textDecoration: "underline" }}>Terms & Conditions:</p>
              <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
                {terms.split('\n').filter(t => t.trim() !== "").map((term, i) => <li key={i} style={{ marginBottom: "8px" }}>{term}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}