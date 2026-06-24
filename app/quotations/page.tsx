"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function QuotationsPage() {
  const quotationRef = useRef<HTMLDivElement>(null);

  const [clientName, setClientName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");

  const generatePDF = async () => {
    if (!quotationRef.current) return;
    const canvas = await html2canvas(quotationRef.current, { 
        backgroundColor: "#ffffff", useCORS: true, scale: 2 
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297); 
    pdf.save(`Quotation_${clientName || "Event"}.pdf`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f4f4f4", padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        
        {/* වම් පස Form එක - දැන් පේන පරිදි සකසා ඇත */}
        <div style={{ width: "400px", background: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", flexShrink: 0 }}>
          <h2 style={{ color: "#333", marginBottom: "20px" }}>Quotation Details</h2>
          <input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
          <input placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
          <textarea placeholder="Package Details" value={packageName} onChange={(e) => setPackageName(e.target.value)} style={{ width: "100%", height: "100px", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
          <input placeholder="Total Amount (Rs.)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
          <textarea placeholder="Terms & Conditions" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ width: "100%", height: "80px", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
          
          <button onClick={generatePDF} style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", marginBottom: "10px", cursor: "pointer" }}>Download PDF</button>
          
          <a href="https://web.whatsapp.com/" target="_blank" style={{ display: "block", textAlign: "center", padding: "12px", background: "#25d366", color: "white", textDecoration: "none", borderRadius: "5px" }}>
            Open WhatsApp Web
          </a>
        </div>

        {/* Letterhead Preview */}
        <div ref={quotationRef} style={{ 
          background: "#fff", 
          color: "#000", 
          width: "210mm", 
          minHeight: "297mm", 
          position: "relative",
          backgroundImage: "url('/irosh-letterhead.png')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat" 
        }}>
          <div style={{ paddingTop: "250px", width: "100%", paddingLeft: "50px", paddingRight: "50px" }}> 
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
               <div>
                 <p><strong>To:</strong> {clientName}</p>
                 <p><strong>Event:</strong> {eventName}</p>
               </div>
               <div>
                 <p><strong>Date:</strong> {eventDate}</p>
               </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#eee" }}>
                  <th style={{ padding: "10px", border: "1px solid #999" }}>Description</th>
                  <th style={{ padding: "10px", border: "1px solid #999" }}>Amount (Rs)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "20px", border: "1px solid #999", height: "300px", verticalAlign: "top" }}>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{packageName}</pre>
                  </td>
                  <td style={{ padding: "20px", border: "1px solid #999", verticalAlign: "top", textAlign: "right" }}>
                    {amount ? Number(amount).toLocaleString() : "-"}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: "40px" }}>
              <p style={{ fontWeight: "bold" }}>Terms & Conditions:</p>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "12px" }}>{terms}</pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}