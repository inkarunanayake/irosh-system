"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function QuotationsPage() {
  const quotationRef = useRef<HTMLDivElement>(null);

  const [clientName, setClientName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState(""); // අලුතින් එක් කළා
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");

  // මෙතැනදී ඔබට ඕනෑම වෙලාවක Default Terms අලුතින් එකතු කිරීමට හෝ වෙනස් කිරීමට හැකියාව ඇත
  const defaultTermsList = [
    "50% advance payment required for booking confirmation.",
    "The balance payment must be settled on the event day.",
    "Meals should be provided for the technical crew (sound & light team).",
    "Event time: Please specify the start and end time of the event.",
    "Equipment should be handled with care; any damage caused will be charged."
  ];

  const handleCheckboxChange = (term: string) => {
    setTerms((prev) => 
      prev.includes(term) ? prev.replace(term + "\n", "") : prev + term + "\n"
    );
  };

  // PDF උත්පාදනය
  const generatePDF = async () => {
    if (!quotationRef.current) return;
    const canvas = await html2canvas(quotationRef.current, { backgroundColor: "#ffffff", useCORS: true, scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297); 
    pdf.save(`Quotation_${clientName || "Event"}.pdf`);
  };

  const inputStyle = { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #999", color: "#000", background: "#fff" };
  const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "bold", color: "#000" };

  return (
    <main style={{ minHeight: "100vh", background: "#f4f4f4", padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        
        {/* වම් පස පෝරමය */}
        <div style={{ width: "400px", background: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "#000", marginBottom: "15px" }}>Quotation Details</h2>
          
          <label style={labelStyle}>Client Name</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} style={inputStyle} />
          
          <label style={labelStyle}>Event Name</label>
          <input value={eventName} onChange={(e) => setEventName(e.target.value)} style={inputStyle} />
          
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Date</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Time</label>
              <input type="text" placeholder="e.g. 6 PM - 12 AM" value={eventTime} onChange={(e) => setEventTime(e.target.value)} style={inputStyle} />
            </div>
          </div>
          
          <label style={labelStyle}>Total Amount (Rs.)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} style={inputStyle} />
          
          <label style={labelStyle}>Select Terms:</label>
          {defaultTermsList.map((term, index) => (
            <div key={index} style={{ marginBottom: "5px" }}>
              <label style={{ fontSize: "13px", cursor: "pointer", color: "#000" }}>
                <input type="checkbox" onChange={() => handleCheckboxChange(term)} style={{ marginRight: "5px" }} /> 
                {term}
              </label>
            </div>
          ))}
          
          <label style={labelStyle}>Edit/Add Terms:</label>
          <textarea value={terms} onChange={(e) => setTerms(e.target.value)} style={{...inputStyle, height: "80px"}} />
          
          <button onClick={generatePDF} style={{ width: "100%", padding: "12px", background: "#dc2626", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Download PDF</button>
        </div>

        {/* දකුණු පස Letterhead Preview */}
        <div ref={quotationRef} style={{ background: "#fff", color: "#000", width: "210mm", minHeight: "297mm", backgroundImage: "url('/irosh-letterhead.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div style={{ paddingTop: "250px", paddingLeft: "50px", paddingRight: "50px" }}> 
            <p><strong>To:</strong> {clientName} | <strong>Event:</strong> {eventName}</p>
            <p><strong>Date:</strong> {eventDate} | <strong>Time:</strong> {eventTime}</p>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead><tr style={{ background: "#eee" }}><th style={{ padding: "10px", border: "1px solid #999" }}>Description</th><th style={{ padding: "10px", border: "1px solid #999" }}>Amount (Rs)</th></tr></thead>
              <tbody>
                <tr>
                  <td style={{ padding: "20px", border: "1px solid #999", height: "200px", verticalAlign: "top" }}>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{packageName}</pre>
                  </td>
                  <td style={{ padding: "20px", border: "1px solid #999", verticalAlign: "top", textAlign: "right" }}>{amount ? Number(amount).toLocaleString() : "-"}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: "40px" }}>
              <p style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: "15px" }}>Terms & Conditions:</p>
              <ul style={{ fontSize: "14px", paddingLeft: "20px", listStyleType: "disc" }}>
                {terms.split('\n').filter(t => t.trim() !== "").map((term, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{term}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}