{/* Letterhead Preview - Sample අනුව සකසා ඇත */}
        <div ref={quotationRef} style={{ 
          background: "#fff", 
          color: "#000", 
          width: "210mm", 
          height: "297mm", 
          position: "relative",
          margin: "0", 
          padding: "0",
          backgroundImage: "url('/irosh-letterhead.png')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat" 
        }}>
          <div style={{ paddingTop: "250px", width: "100%", paddingLeft: "40px", paddingRight: "40px" }}> 
            
            {/* Quotation Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
               <div>
                 <p><strong>To:</strong> {clientName}</p>
                 <p><strong>Event:</strong> {/* Event නම සඳහා input එකක් එකතු කරන්න පුළුවන් */}</p>
               </div>
               <div>
                 <p><strong>Date:</strong> {eventDate}</p>
                 <p><strong>Quotation No:</strong> #IROSH-2026-001</p>
               </div>
            </div>

            {/* Main Details Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ background: "#f0f0f0", textAlign: "left" }}>
                  <th style={{ padding: "10px", border: "1px solid #ccc" }}>Description</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc", width: "100px" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "15px", border: "1px solid #ccc", verticalAlign: "top" }}>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{packageName}</pre>
                  </td>
                  <td style={{ padding: "15px", border: "1px solid #ccc", verticalAlign: "top", textAlign: "right" }}>
                    {amount ? `Rs. ${Number(amount).toLocaleString()}` : "-"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Terms & Conditions */}
            <div style={{ marginTop: "30px" }}>
              <p style={{ fontWeight: "bold", textDecoration: "underline" }}>Terms & Conditions:</p>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "12px", color: "#333" }}>{terms}</pre>
            </div>

            {/* Signature Area */}
            <div style={{ marginTop: "60px", display: "flex", justifyContent: "space-between" }}>
               <div style={{ borderTop: "1px solid #000", width: "200px", textAlign: "center" }}>Client Signature</div>
               <div style={{ borderTop: "1px solid #000", width: "200px", textAlign: "center" }}>Manager, IROSH Sounds</div>
            </div>

          </div>
        </div>