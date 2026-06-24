"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function QuotationsPage() {
  const quotationRef = useRef<HTMLDivElement>(null);

  // Form States
  const [clientName, setClientName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");

  const generatePDF = async () => {
    if (!quotationRef.current) return;
    const canvas = await html2canvas(quotationRef.current, { 
        backgroundColor: "#ffffff", 
        useCORS: true, 
        scale: 2,
        width: quotationRef.current.offsetWidth,
        height: quotationRef.current.offsetHeight
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297); 
    pdf.save(`Quotation_${clientName || "Event"}.pdf`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "20px" }}>
        
        {/* පෝරමය (Form) */}
        <div style={{ background: "#18181b", padding: "20px", borderRadius: "15px", height: "fit-content" }}>
          <h2 style={{ marginBottom: "20px" }}>Enter Details</h2>
          <input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <input placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <textarea placeholder="Package Details / Items" value={packageName} onChange={(e) => setPackageName(e.target.value)} style={{ width: "100%", height: "120px", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <input placeholder="Total Amount (Rs.)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <textarea placeholder="Terms & Conditions" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ width: "100%", height: "80px", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <button onClick={generatePDF} style={{ width: "100%", padding: "15px", background: "#dc2626", color: "white", border: "none", cursor: "pointer", borderRadius: "5px", fontWeight: "bold" }}>Download PDF</button>
        </div>

        {/* Letterhead Preview */}
        <div ref={quotationRef} style={{ 
          background: "#fff", 
          color: "#000", 
          width: "210mm", 
          height: "297mm", 
          position: "relative",
          margin: "0 auto", 
          padding: "0",
          backgroundImage: "url('/irosh-letterhead.png')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat" 
        }}>
          <div style={{ paddingTop: "250px", width: "100%", paddingLeft: "50px", paddingRight: "50px" }}> 
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", fontSize: "16px" }}>
               <div>
                 <p><strong>To:</strong> {clientName}</p>
                 <p><strong>Event:</strong> {eventName}</p>
               </div>
               <div>
                 <p><strong>Date:</strong> {eventDate}</p>
               </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ background: "#eee", textAlign: "left" }}>
                  <th style={{ padding: "12px", border: "1px solid #999" }}>Description</th>
                  <th style={{ padding: "12px", border: "1px solid #999", width: "150px" }}>Amount (Rs)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "20px", border: "1px solid #999", verticalAlign: "top", height: "300px" }}>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{packageName}</pre>
                  </td>
                  <td style={{ padding: "20px", border: "1px solid #999", verticalAlign: "top", textAlign: "right" }}>
                    {amount ? Number(amount).toLocaleString() : "-"}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold", background: "#f9f9f9" }}>
                  <td style={{ padding: "12px", border: "1px solid #999", textAlign: "right" }}>Total</td>
                  <td style={{ padding: "12px", border: "1px solid #999", textAlign: "right" }}>Rs. {amount ? Number(amount).toLocaleString() : "0"}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: "40px" }}>
              <p style={{ fontWeight: "bold", textDecoration: "underline" }}>Terms & Conditions:</p>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "13px" }}>{terms}</pre>
            </div>

            <div style={{ marginTop: "80px", display: "flex", justifyContent: "space-between" }}>
               <div style={{ borderTop: "1px solid #000", width: "220px", textAlign: "center", paddingTop: "5px" }}>Client Signature</div>
               <div style={{ borderTop: "1px solid #000", width: "220px", textAlign: "center", paddingTop: "5px" }}>Manager, IROSH Sounds</div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}