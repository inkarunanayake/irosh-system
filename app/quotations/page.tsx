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

  const inputStyle = { width: "100%", background: "#000000", color: "#ffffff", border: "1px solid #3f3f46", borderRadius: "14px", padding: "14px", fontSize: "15px" };

  return (
    <main style={{ minHeight: "100vh", background: "#000000", color: "#ffffff", padding: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}>Quotation Generator</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Input Section */}
        <div style={{ background: "#18181b", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <input placeholder="Client / Event Name" value={clientName} onChange={(e) => setClientName(e.target.value)} style={inputStyle} />
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={inputStyle} />
          <textarea placeholder="Package Details (Bullet points)" value={packageName} onChange={(e) => setPackageName(e.target.value)} style={{ ...inputStyle, height: "150px" }} />
          <input placeholder="Total Amount (Rs.)" value={amount} onChange={(e) => setAmount(e.target.value)} style={inputStyle} />
          <textarea placeholder="Terms & Conditions" value={terms} onChange={(e) => setTerms(e.target.value)} style={inputStyle} />
          <button onClick={generatePDF} style={{ background: "#dc2626", color: "#ffffff", padding: "16px", border: "none", borderRadius: "14px", fontWeight: "bold", cursor: "pointer" }}>Download PDF</button>
        </div>

        {/* Letterhead Preview */}
        <div ref={quotationRef} style={{ background: "#ffffff", color: "#000000", padding: "40px", borderRadius: "10px", minHeight: "900px" }}>
          <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "20px" }}>
            <h1 style={{ fontSize: "32px", margin: "0" }}>IROSH Entertainment</h1>
            <p style={{ margin: "5px 0" }}>Galewela | 0777-432573, 077-9441340 | inkarunanayake@gmail.com</p>
            <p style={{ fontSize: "12px" }}>VIDEO PRODUCTION | SOUND SYSTEMS | MUSICAL BAND | DJ SERVICES | LED VIDEO WALL</p>
            <p style={{ fontSize: "10px", fontWeight: "bold" }}>Reg no: cp.ga.1424</p>
          </div>

          <h2 style={{ textAlign: "center", textDecoration: "underline", marginTop: "20px" }}>SOUNDS QUOTATION</h2>
          <p><strong>Event:</strong> {clientName}</p>
          <p><strong>Date:</strong> {eventDate}</p>

          <div style={{ marginTop: "20px" }}>
            <strong>Sound System Package:</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{packageName}</pre>
          </div>

          <div style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>
            Total Price: Rs. {Number(amount).toLocaleString()}.00/=
          </div>

          <div style={{ marginTop: "30px", fontSize: "12px" }}>
            <strong>Terms & Conditions:</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{terms}</pre>
          </div>

          <div style={{ marginTop: "50px", textAlign: "center", fontStyle: "italic" }}>
            Quality Sound... Perfect Moments...
          </div>
        </div>
      </div>
    </main>
  );
}