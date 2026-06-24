"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function QuotationsPage() {
  const quotationRef = useRef<HTMLDivElement>(null);

  // States
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");

  const generatePDF = async () => {
    if (!quotationRef.current) return;
    const canvas = await html2canvas(quotationRef.current, { backgroundColor: "#ffffff", useCORS: true, scale: 2 });
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
          <input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} />
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} />
          <textarea placeholder="Package Details" value={packageName} onChange={(e) => setPackageName(e.target.value)} style={{ width: "100%", height: "150px", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} />
          <input placeholder="Amount (Rs.)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} />
          <textarea placeholder="Terms & Conditions" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ width: "100%", height: "100px", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} />
          <button onClick={generatePDF} style={{ width: "100%", padding: "15px", background: "#dc2626", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>Download PDF</button>
        </div>

        {/* ඔබ එවා තිබූ Letterhead එකට සමාන ආකෘතිය */}
        <div ref={quotationRef} style={{ background: "#fff", color: "#000", padding: "40px", minHeight: "842px", fontFamily: "Arial, sans-serif" }}>
          <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
            <h1 style={{ fontSize: "28px", margin: "0" }}>IROSH Entertainment [cite: 1]</h1>
            <p style={{ margin: "5px 0" }}>0777-432573, 077-9441340 [cite: 2] | inkarunanayake@gmail.com [cite: 6]</p>
            <p style={{ fontSize: "12px" }}>VIDEO PRODUCTION [cite: 3, 4] | SOUND SYSTEMS [cite: 7] | MUSICAL BAND [cite: 8] | DJ SERVICES [cite: 9] | LED VIDEO WALL [cite: 10, 11]</p>
            <p style={{ fontSize: "10px" }}>Reg no: cp.ga.1424 [cite: 6] | Galewela [cite: 5]</p>
          </div>

          <h2 style={{ textAlign: "center", textTransform: "uppercase", marginTop: "20px" }}>SOUNDS QUOTATION [cite: 12]</h2>
          
          <p><strong>To:</strong> {clientName}</p>
          <p><strong>Date:</strong> {eventDate}</p>

          <div style={{ marginTop: "20px" }}>
            <strong>Sound System Package: [cite: 14]</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{packageName}</pre>
          </div>

          <div style={{ marginTop: "30px", fontWeight: "bold", fontSize: "18px" }}>
            Total Package Price: Rs. {Number(amount).toLocaleString()}.00/= [cite: 23]
          </div>

          <div style={{ marginTop: "30px" }}>
            <strong>Terms & Conditions: [cite: 24]</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{terms}</pre>
          </div>

          <div style={{ marginTop: "50px", textAlign: "center", fontStyle: "italic" }}>
            Quality Sound... Perfect Moments... [cite: 32, 33]
          </div>
        </div>
      </div>
    </main>
  );
}