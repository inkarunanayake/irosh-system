"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function QuotationsPage() {
  const quotationRef = useRef<HTMLDivElement>(null);

  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");

  const generatePDF = async () => {
    if (!quotationRef.current) return;
    const canvas = await html2canvas(quotationRef.current, { 
        backgroundColor: "#ffffff", 
        useCORS: true, 
        scale: 2 
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Quotation_${clientName || "Event"}.pdf`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* පෝරමය (Form) */}
        <div style={{ background: "#18181b", padding: "20px", borderRadius: "15px" }}>
          <h2 style={{ marginBottom: "20px" }}>Generate Quotation</h2>
          <input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <textarea placeholder="Package Details" value={packageName} onChange={(e) => setPackageName(e.target.value)} style={{ width: "100%", height: "120px", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <input placeholder="Amount (Rs.)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <textarea placeholder="Terms & Conditions" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ width: "100%", height: "80px", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <button onClick={generatePDF} style={{ width: "100%", padding: "15px", background: "#dc2626", color: "white", border: "none", cursor: "pointer", borderRadius: "5px", fontWeight: "bold" }}>Download PDF</button>
        </div>

        {/* Letterhead Preview */}
        <div ref={quotationRef} style={{ 
          background: "#fff", 
          color: "#000", 
          padding: "40px", 
          minHeight: "842px", 
          width: "100%",
          position: "relative",
          backgroundImage: "url('/irosh-letterhead.png')", 
          backgroundSize: "contain", 
          backgroundPosition: "top center", 
          backgroundRepeat: "no-repeat" 
        }}>
          {/* අන්තර්ගතය රූපයට පහළින් මැදට සිටින සේ සැකසුම */}
          <div style={{ marginTop: "220px", width: "100%" }}> 
            <div style={{ maxWidth: "90%", margin: "0 auto" }}>
              <p><strong>To:</strong> {clientName}</p>
              <p><strong>Date:</strong> {eventDate}</p>
              
              <div style={{ marginTop: "20px" }}>
                <strong>Sound System Package:</strong>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "14px" }}>{packageName}</pre>
              </div>

              <div style={{ marginTop: "30px", fontWeight: "bold", fontSize: "18px" }}>
                Total Price: Rs. {Number(amount).toLocaleString()}.00/=
              </div>

              <div style={{ marginTop: "30px" }}>
                <strong>Terms & Conditions:</strong>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "12px" }}>{terms}</pre>
              </div>

              <div style={{ marginTop: "50px", textAlign: "center", fontStyle: "italic", color: "#555" }}>
                Quality Sound... Perfect Moments...
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}