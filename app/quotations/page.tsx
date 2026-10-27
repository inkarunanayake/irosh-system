"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";

interface Item {
  description: string;
  amount: string;
}

export default function QuotationsPage() {
  const router = useRouter();
  const quotationRef = useRef<HTMLDivElement>(null);

  // Customer & Event States
  const [quotationDate, setQuotationDate] = useState("2026.10.02");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  // Items List
  const [items, setItems] = useState<Item[]>([
    { description: "", amount: "" },
  ]);

  // Terms States
  const [terms, setTerms] = useState<string[]>([
    "Advance Payment: A 50% advance payment is required upon confirmation.",
    "Balance Payment: The remaining balance must be paid prior to the commencement of the event.",
    "If additional time or extra services are required, additional charges will apply.",
    "Food and refreshments: should be provided for the crew attending the event.",
    "Validity: This quotation is valid for 30 days from the date of issue."
  ]);
  const [newTerm, setNewTerm] = useState("");

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItemRow = () => {
    setItems([...items, { description: "", amount: "" }]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

  const handleTermChange = (index: number, value: string) => {
    const updated = [...terms];
    updated[index] = value;
    setTerms(updated);
  };

  const addTerm = () => {
    if (newTerm.trim()) {
      setTerms([...terms, newTerm]);
      setNewTerm("");
    }
  };

  const removeTerm = (index: number) => {
    setTerms(terms.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    if (!quotationRef.current) return;
    const canvas = await html2canvas(quotationRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(`Quotation_${clientName || "Event"}.pdf`);

    // Save Booking in LocalStorage
    const newBooking = {
      id: Date.now(),
      full_name: clientName,
      customer_phone: phone,
      customer_email: email,
      location: eventLocation,
      event_date: eventDate,
      total_balance: calculateTotal(),
      status: "Pending"
    };
    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([...existing, newBooking]));
    alert("Quotation PDF Downloaded & Booking Saved!");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#e5e7eb", padding: "20px" }}>
      <button 
        onClick={() => router.push("/admin")} 
        style={{ marginBottom: "20px", padding: "10px 20px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
      >
        ← Back to Admin Dashboard
      </button>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", justifyContent: "center" }}>
        
        {/* INPUT FORM PANEL */}
        <div style={{ width: "420px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxHeight: "90vh", overflowY: "auto" }}>
          <h2 style={{ color: "#111827", marginBottom: "15px" }}>Quotation Details</h2>
          
          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Quotation Date</label>
          <input type="text" value={quotationDate} onChange={(e) => setQuotationDate(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Customer Name</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Contact Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Event Type</label>
          <input value={eventType} onChange={(e) => setEventType(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Event Location</label>
          <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", fontSize: "14px" }}>Event Date</label>
              <input value={eventDate} onChange={(e) => setEventDate(e.target.value)} placeholder="2026.10.15" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", fontSize: "14px" }}>Event Time</label>
              <input value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="5.00pm to 10.00 pm" style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            </div>
          </div>

          <h3 style={{ marginTop: "15px", marginBottom: "10px", fontSize: "16px", borderBottom: "2px solid #dc2626", paddingBottom: "4px" }}>Services / Description</h3>
          {items.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px", background: "#f9fafb", padding: "10px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
              <textarea 
                placeholder="Description" 
                value={item.description} 
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                style={{ width: "100%", height: "50px", padding: "5px", marginBottom: "5px" }} 
              />
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input 
                  type="number" 
                  placeholder="Amount (LKR)" 
                  value={item.amount} 
                  onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                  style={{ flex: 1, padding: "5px" }} 
                />
                {items.length > 1 && (
                  <button onClick={() => removeItemRow(index)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}>X</button>
                )}
              </div>
            </div>
          ))}
          <button onClick={addItemRow} style={{ width: "100%", padding: "8px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>+ Add Service Item</button>

          <h3 style={{ marginTop: "20px", marginBottom: "10px", fontSize: "16px", borderBottom: "2px solid #dc2626", paddingBottom: "4px" }}>Terms & Conditions</h3>
          {terms.map((term, index) => (
            <div key={index} style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
              <input value={term} onChange={(e) => handleTermChange(index, e.target.value)} style={{ flex: 1, padding: "5px" }} />
              <button onClick={() => removeTerm(index)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "5px", cursor: "pointer", borderRadius: "4px" }}>X</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
            <input value={newTerm} onChange={(e) => setNewTerm(e.target.value)} placeholder="Add new condition..." style={{ flex: 1, padding: "5px" }} />
            <button onClick={addTerm} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}>Add</button>
          </div>

          <button onClick={generatePDF} style={{ marginTop: "20px", width: "100%", padding: "12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
            Download PDF & Save Booking
          </button>
        </div>

        {/* QUOTATION PREVIEW (WORD MATCHING DESIGN) */}
        <div ref={quotationRef} style={{ background: "#fff", color: "#000", width: "210mm", minHeight: "297mm", padding: "40px", boxShadow: "0 0 10px rgba(0,0,0,0.15)", fontFamily: "Arial, sans-serif", fontSize: "13px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          
          <div>
            {/* Header */}
            <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
              <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>IROSH ENTERTAINMENT</h1>
              <p style={{ margin: "2px 0", fontSize: "12px" }}>Galewela. Reg No: CP.GA.1424 | Event Audio & Production Services</p>
              <p style={{ margin: "2px 0", fontSize: "12px" }}>☎ 0777-432573 / 077-9441340 &nbsp;&nbsp;•&nbsp;&nbsp; ✉ inkarunanayake@gmail.com / iroshvideoteam@gmail.com &nbsp;&nbsp;📍 Galewela, Sri Lanka</p>
              <p style={{ margin: "4px 0 0 0", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>
                SOUND SYSTEMS • STAGE LIGHTING • VIDEO PRODUCTION • DJ SERVICES • LED VIDEO WALL
              </p>
            </div>

            {/* Title & Date */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px", marginBottom: "15px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", textDecoration: "underline" }}>QUOTATION</h2>
              <p style={{ margin: 0, fontWeight: "bold" }}>Date: {quotationDate}</p>
            </div>

            {/* Customer Details */}
            <div style={{ background: "#f8f9fa", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "20px", lineHeight: "1.6" }}>
              <p style={{ margin: 0 }}><strong>Customer Name:</strong> {clientName}</p>
              <p style={{ margin: 0 }}><strong>Contact Number:</strong> {phone}</p>
              <p style={{ margin: 0 }}>
                <strong>Event Type:</strong> {eventType} &nbsp;|&nbsp; 
                <strong>Event Location:</strong> {eventLocation} &nbsp;|&nbsp; 
                <strong>Event Date & Time:</strong> {eventDate}{eventTime ? `, ${eventTime}` : ''}
              </p>
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left", width: "75%" }}>Description / Services</th>
                  <th style={{ border: "1px solid #000", padding: "8px", textAlign: "right", width: "25%" }}>Amount (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #000", padding: "8px", whiteSpace: "pre-wrap", verticalAlign: "top" }}>
                      {item.description}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "8px", textAlign: "right", verticalAlign: "top" }}>
                      {item.amount ? parseFloat(item.amount).toFixed(2) : "0.00"}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "8px", fontWeight: "bold", textAlign: "right" }}>
                    Total with transport:
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px", fontWeight: "bold", textAlign: "right", background: "#f9fafb" }}>
                    LKR {calculateTotal().toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Terms and Conditions */}
            <div style={{ marginTop: "20px" }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "bold", textDecoration: "underline" }}>TERMS & CONDITIONS</p>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "12px", lineHeight: "1.5" }}>
                {terms.map((term, i) => (
                  <li key={i} style={{ marginBottom: "3px" }}>{term}</li>
                ))}
              </ul>
            </div>

            {/* Bank Details */}
            <div style={{ marginTop: "15px", border: "1px solid #000", padding: "8px", borderRadius: "4px", fontSize: "11px", background: "#fff" }}>
              <p style={{ margin: "0 0 4px 0", fontWeight: "bold", textDecoration: "underline" }}>Bank Details:</p>
              <p style={{ margin: "2px 0" }}><strong>Account Name:</strong> I.N. Karunanayake</p>
              <p style={{ margin: "2px 0" }}><strong>Account No:</strong> Peoples bank: 115200120037869 / Commercial bank: 8090007547</p>
              <p style={{ margin: "2px 0" }}><strong>Branch:</strong> Galewela</p>
            </div>
          </div>

          {/* Footer / Signature */}
          <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ margin: 0, fontWeight: "bold" }}>Irosha Nuwan Karunanayake</p>
              <p style={{ margin: 0, fontSize: "11px" }}>Management - IROSH Entertainment</p>
              <p style={{ margin: 0, fontSize: "11px" }}>Galewela (Reg No: CP.GA.1424)</p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
