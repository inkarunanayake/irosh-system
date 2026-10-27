<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IROSH Entertainment - Quotation Builder</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }

        /* A4 Page Layout Simulation */
        .a4-page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        @media print {
            body * {
                visibility: hidden;
            }
            #quotation-preview, #quotation-preview * {
                visibility: visible;
            }
            #quotation-preview {
                position: absolute;
                left: 0;
                top: 0;
                width: 210mm;
                height: 297mm;
                padding: 15mm;
                margin: 0;
                box-shadow: none;
            }
            .no-print {
                display: none !important;
            }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    </style>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen">

    <!-- Top Navigation Bar -->
    <header class="bg-slate-900 text-white shadow-md sticky top-0 z-50 no-print">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <div class="bg-red-600 text-white font-black text-xl px-3 py-1 rounded">IE</div>
                <div>
                    <h1 class="font-bold text-lg leading-none">IROSH Entertainment</h1>
                    <p class="text-xs text-slate-400">Automated Quotation System</p>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <button onclick="window.history.back()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 transition flex items-center gap-2">
                    <i class="fa-solid fa-arrow-left"></i> Admin Dashboard
                </button>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT PANEL: APPLICATION FORM -->
            <div class="lg:col-span-5 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden no-print">
                <div class="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <h2 class="font-bold text-lg flex items-center gap-2">
                        <i class="fa-solid fa-file-pen text-red-500"></i> Quotation Application Form
                    </h2>
                    <span class="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-1 rounded font-medium">Draft Mode</span>
                </div>

                <form id="quotationForm" onsubmit="event.preventDefault();" class="p-6 space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto">
                    
                    <!-- Section: General Info -->
                    <div>
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                            <i class="fa-regular fa-calendar-check text-slate-500"></i> Quotation Meta
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Quotation Date</label>
                                <input type="text" id="quotationDate" value="2026.10.02" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="YYYY.MM.DD">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Valid Until</label>
                                <input type="text" id="validityPeriod" value="30 Days from Issue" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition">
                            </div>
                        </div>
                    </div>

                    <hr class="border-slate-100">

                    <!-- Section: Client Details -->
                    <div>
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                            <i class="fa-solid fa-user text-slate-500"></i> Customer Details
                        </h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Customer / School Name *</label>
                                <input type="text" id="clientName" value="Bulanawawa Primary School" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="e.g. Bulanawawa Primary School">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Contact Number *</label>
                                    <input type="text" id="phone" value="077-4123949" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="077-XXXXXXX">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                                    <input type="email" id="email" value="bulanawawa@gmail.com" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="client@example.com">
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr class="border-slate-100">

                    <!-- Section: Event Specification -->
                    <div>
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                            <i class="fa-solid fa-location-dot text-slate-500"></i> Event Specifications
                        </h3>
                        <div class="space-y-3">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Event Type</label>
                                    <input type="text" id="eventType" value="Outdoor School Concert" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="e.g. Musical Show / Concert">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Event Location</label>
                                    <input type="text" id="eventLocation" value="Bulanawawa Primary School Grounds" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="e.g. Galewela">
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Event Date</label>
                                    <input type="text" id="eventDate" value="2026.10.15" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="YYYY.MM.DD">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1">Event Time Window</label>
                                    <input type="text" id="eventTime" value="5.00 PM - 10.00 PM" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="5.00 PM to 10.00 PM">
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr class="border-slate-100">

                    <!-- Section: Dynamic Services / Products Table -->
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <i class="fa-solid fa-list-check text-slate-500"></i> Service Breakdown & Charges
                            </h3>
                            <button type="button" onclick="addItemRow()" class="text-xs bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-2.5 py-1 rounded-md border border-red-200 transition flex items-center gap-1">
                                <i class="fa-solid fa-plus"></i> Add Item
                            </button>
                        </div>

                        <div id="itemsContainer" class="space-y-3">
                            <!-- Items will be populated dynamically -->
                        </div>
                    </div>

                    <hr class="border-slate-100">

                    <!-- Section: Terms & Conditions -->
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <i class="fa-solid fa-shield-halved text-slate-500"></i> Terms & Conditions
                            </h3>
                        </div>

                        <div id="termsContainer" class="space-y-2 mb-3">
                            <!-- Terms list will be dynamically rendered here -->
                        </div>

                        <div class="flex gap-2">
                            <input type="text" id="newTermInput" placeholder="Add custom condition..." class="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                            <button type="button" onclick="addTerm()" class="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition">
                                Add
                            </button>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="pt-4 space-y-3">
                        <button type="button" onclick="handlePrintOrSave()" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2 text-base">
                            <i class="fa-solid fa-file-pdf"></i> Download PDF & Save Booking
                        </button>
                        <p class="text-[11px] text-center text-slate-400">Generates full-resolution Word-formatted A4 PDF document</p>
                    </div>

                </form>
            </div>

            <!-- RIGHT PANEL: LIVE WORD DOCUMENT PREVIEW -->
            <div class="lg:col-span-7 flex flex-col items-center">
                
                <div class="w-full flex justify-between items-center mb-3 px-2 no-print">
                    <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-eye text-red-500"></i> Live Document Preview (A4 Format)
                    </span>
                    <button onclick="window.print()" class="text-xs bg-white hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-md border border-slate-300 shadow-sm transition flex items-center gap-1.5">
                        <i class="fa-solid fa-print text-slate-500"></i> Print / Export
                    </button>
                </div>

                <!-- Document Paper Canvas -->
                <div id="quotation-preview" class="a4-page border border-slate-300 text-slate-900 leading-normal">
                    
                    <!-- DOCUMENT TOP HEADER (Letterhead) -->
                    <div>
                        <div class="text-center border-b-2 border-slate-900 pb-3 mb-4">
                            <h1 class="text-2xl font-black tracking-wider text-slate-900 mb-0.5">IROSH ENTERTAINMENT</h1>
                            <p class="text-xs font-medium text-slate-700 mb-1">
                                Galewela. Reg No: CP.GA.1424 | Event Audio & Production Services
                            </p>
                            <p class="text-[11px] text-slate-600 space-x-2 mb-1">
                                <span><i class="fa-solid fa-phone text-slate-400"></i> 0777-432573 / 077-9441340</span>
                                <span>•</span>
                                <span><i class="fa-solid fa-envelope text-slate-400"></i> inkarunanayake@gmail.com</span>
                                <span>•</span>
                                <span><i class="fa-solid fa-location-dot text-slate-400"></i> Galewela, Sri Lanka</span>
                            </p>
                            <div class="bg-slate-900 text-white text-[10px] font-bold tracking-widest py-1 px-2 rounded uppercase mt-2 inline-block">
                                SOUND SYSTEMS • STAGE LIGHTING • VIDEO PRODUCTION • DJ SERVICES • LED VIDEO WALL
                            </div>
                        </div>

                        <!-- QUOTATION METADATA BAR -->
                        <div class="flex justify-between items-baseline mb-4">
                            <h2 class="text-lg font-bold underline tracking-wide text-slate-900">QUOTATION</h2>
                            <p class="text-xs font-bold text-slate-800">Date: <span id="prev-quotationDate">2026.10.02</span></p>
                        </div>

                        <!-- CUSTOMER & EVENT DETAILS BOX -->
                        <div class="bg-slate-50 border border-slate-300 rounded p-3 mb-5 text-xs space-y-1">
                            <div class="grid grid-cols-12 gap-2">
                                <div class="col-span-7">
                                    <span class="font-bold">Customer Name:</span> <span id="prev-clientName" class="text-slate-900 font-semibold">Bulanawawa Primary School</span>
                                </div>
                                <div class="col-span-5">
                                    <span class="font-bold">Contact Number:</span> <span id="prev-phone">077-4123949</span>
                                </div>
                            </div>
                            <div class="grid grid-cols-12 gap-2">
                                <div class="col-span-7">
                                    <span class="font-bold">Event Type:</span> <span id="prev-eventType">Outdoor School Concert</span>
                                </div>
                                <div class="col-span-5">
                                    <span class="font-bold">Email:</span> <span id="prev-email">bulanawawa@gmail.com</span>
                                </div>
                            </div>
                            <div class="grid grid-cols-12 gap-2">
                                <div class="col-span-7">
                                    <span class="font-bold">Event Location:</span> <span id="prev-eventLocation">Bulanawawa Primary School Grounds</span>
                                </div>
                                <div class="col-span-5">
                                    <span class="font-bold">Date & Time:</span> <span id="prev-eventDateTime">2026.10.15, 5.00 PM - 10.00 PM</span>
                                </div>
                            </div>
                        </div>

                        <!-- SERVICES BREAKDOWN TABLE -->
                        <table class="w-full border-collapse border border-slate-900 text-xs mb-6">
                            <thead>
                                <tr class="bg-slate-100 text-slate-900 border-b border-slate-900">
                                    <th class="border border-slate-900 p-2 text-left font-bold w-[75%]">Description / Services</th>
                                    <th class="border border-slate-900 p-2 text-right font-bold w-[25%]">Amount (LKR)</th>
                                </tr>
                            </thead>
                            <tbody id="prev-itemsTable">
                                <!-- Dynamic rows rendered here -->
                            </tbody>
                            <tfoot>
                                <tr class="bg-slate-50 font-bold border-t border-slate-900">
                                    <td class="border border-slate-900 p-2 text-right uppercase tracking-wider text-[11px]">
                                        Total with Transport:
                                    </td>
                                    <td id="prev-totalAmount" class="border border-slate-900 p-2 text-right text-slate-900 font-bold text-sm bg-slate-100">
                                        LKR 0.00
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        <!-- TERMS & CONDITIONS -->
                        <div class="mb-5">
                            <h4 class="font-bold text-xs underline mb-2 text-slate-900 uppercase tracking-wide">TERMS & CONDITIONS</h4>
                            <ul id="prev-termsList" class="list-disc list-inside text-[11px] text-slate-700 space-y-1 pl-1">
                                <!-- Dynamic terms listed here -->
                            </ul>
                        </div>

                        <!-- BANK ACCOUNT DETAILS BOX -->
                        <div class="border border-slate-900 rounded p-2.5 text-[11px] bg-white space-y-1 mb-6">
                            <p class="font-bold underline text-slate-900">Bank Details:</p>
                            <p class="text-slate-800"><span class="font-semibold">Account Name:</span> I.N. Karunanayake</p>
                            <p class="text-slate-800"><span class="font-semibold">Account No:</span> Peoples Bank: 115200120037869 / Commercial Bank: 8090007547</p>
                            <p class="text-slate-800"><span class="font-semibold">Branch:</span> Galewela</p>
                        </div>
                    </div>

                    <!-- DOCUMENT FOOTER SIGNATURE -->
                    <div class="pt-4 border-t border-slate-200 flex justify-between items-end">
                        <div class="text-left">
                            <p class="font-bold text-xs text-slate-900">Irosha Nuwan Karunanayake</p>
                            <p class="text-[11px] text-slate-600">Management - IROSH Entertainment</p>
                            <p class="text-[10px] text-slate-500">Galewela (Reg No: CP.GA.1424)</p>
                        </div>
                        <div class="text-right">
                            <div class="border-b border-slate-400 w-32 mb-1"></div>
                            <p class="text-[10px] text-slate-500">Authorized Signature</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>

    <!-- Application Script -->
    <script>
        // Initial Default State
        let items = [
            { description: "Complete stage light setup (16 beam light, 16 color wash, 4 GL face light, smoke)", amount: 55000 },
            { description: "Full stage outdoor LED video wall with runner (20'X8' back wall, stage front runner screen)", amount: 110000 },
            { description: "Outdoor line array sound system with generator (line array 12 top, 8 base bin, 90KW generator)", amount: 115000 },
            { description: "40'x20' mega stage with dancing floor", amount: 120000 },
            { description: "Live videography with Facebook Live (4 video camera, Blackmagic multi camera setup, drone camera)", amount: 55000 }
        ];

        let terms = [
            "Advance Payment: A 50% advance payment is required upon confirmation.",
            "Balance Payment: The remaining balance must be paid prior to the commencement of the event.",
            "If additional time or extra services are required, additional charges will apply.",
            "Food and Refreshments: Should be provided for the technical crew attending the event.",
            "Validity: This quotation is valid for 30 days from the date of issue."
        ];

        // Bind form input triggers to preview updater
        const inputFields = [
            'quotationDate', 'clientName', 'phone', 'email', 'eventType', 
            'eventLocation', 'eventDate', 'eventTime'
        ];

        window.onload = function() {
            inputFields.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('input', updatePreview);
                }
            });

            renderItemsForm();
            renderTermsForm();
            updatePreview();
        };

        // Render Service Items in Input Form
        function renderItemsForm() {
            const container = document.getElementById('itemsContainer');
            container.innerHTML = '';

            items.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2';
                itemDiv.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="text-[11px] font-bold text-slate-500">Service #${index + 1}</span>
                        ${items.length > 1 ? `
                            <button type="button" onclick="removeItemRow(${index})" class="text-red-500 hover:text-red-700 text-xs font-semibold">
                                <i class="fa-solid fa-trash"></i> Remove
                            </button>
                        ` : ''}
                    </div>
                    <textarea 
                        oninput="updateItemDescription(${index}, this.value)" 
                        placeholder="Service description & equipment specification..." 
                        class="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-red-500 outline-none h-14 resize-none"
                    >${item.description}</textarea>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-medium text-slate-500">LKR</span>
                        <input 
                            type="number" 
                            value="${item.amount}" 
                            oninput="updateItemAmount(${index}, this.value)" 
                            placeholder="Amount" 
                            class="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-red-500 outline-none"
                        />
                    </div>
                `;
                container.appendChild(itemDiv);
            });
            updatePreview();
        }

        function addItemRow() {
            items.push({ description: '', amount: '' });
            renderItemsForm();
        }

        function removeItemRow(index) {
            items.splice(index, 1);
            renderItemsForm();
        }

        function updateItemDescription(index, val) {
            items[index].description = val;
            updatePreview();
        }

        function updateItemAmount(index, val) {
            items[index].amount = parseFloat(val) || 0;
            updatePreview();
        }

        // Terms Rendering & Controls
        function renderTermsForm() {
            const container = document.getElementById('termsContainer');
            container.innerHTML = '';

            terms.forEach((term, index) => {
                const termDiv = document.createElement('div');
                termDiv.className = 'flex items-center gap-2';
                termDiv.innerHTML = `
                    <input type="text" value="${term}" oninput="updateTerm(${index}, this.value)" class="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded outline-none focus:border-red-500">
                    <button type="button" onclick="removeTerm(${index})" class="text-slate-400 hover:text-red-500 px-1">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                `;
                container.appendChild(termDiv);
            });
            updatePreview();
        }

        function updateTerm(index, value) {
            terms[index] = value;
            updatePreview();
        }

        function addTerm() {
            const input = document.getElementById('newTermInput');
            if (input.value.trim() !== '') {
                terms.push(input.value.trim());
                input.value = '';
                renderTermsForm();
            }
        }

        function removeTerm(index) {
            terms.splice(index, 1);
            renderTermsForm();
        }

        // Synchronize Right Side Preview
        function updatePreview() {
            // Text fields
            document.getElementById('prev-quotationDate').innerText = document.getElementById('quotationDate').value || 'N/A';
            document.getElementById('prev-clientName').innerText = document.getElementById('clientName').value || '—';
            document.getElementById('prev-phone').innerText = document.getElementById('phone').value || '—';
            document.getElementById('prev-email').innerText = document.getElementById('email').value || '—';
            document.getElementById('prev-eventType').innerText = document.getElementById('eventType').value || '—';
            document.getElementById('prev-eventLocation').innerText = document.getElementById('eventLocation').value || '—';
            
            const eventDate = document.getElementById('eventDate').value || '';
            const eventTime = document.getElementById('eventTime').value || '';
            document.getElementById('prev-eventDateTime').innerText = `${eventDate}${eventTime ? ', ' + eventTime : ''}`;

            // Table items
            const tableBody = document.getElementById('prev-itemsTable');
            tableBody.innerHTML = '';
            let total = 0;

            items.forEach(item => {
                const amt = parseFloat(item.amount) || 0;
                total += amt;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="border border-slate-900 p-2 whitespace-pre-wrap vertical-top">${item.description || '—'}</td>
                    <td class="border border-slate-900 p-2 text-right vertical-top font-medium">${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                `;
                tableBody.appendChild(tr);
            });

            document.getElementById('prev-totalAmount').innerText = `LKR ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            // Terms List
            const termsList = document.getElementById('prev-termsList');
            termsList.innerHTML = '';
            terms.forEach(term => {
                if(term.trim() !== "") {
                    const li = document.createElement('li');
                    li.innerText = term;
                    termsList.appendChild(li);
                }
            });
        }

        // Download / Print / LocalStorage Action
        function handlePrintOrSave() {
            const client = document.getElementById('clientName').value || 'Client';
            
            // Save Booking to local storage
            const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
            const newBooking = {
                id: Date.now(),
                full_name: client,
                customer_phone: document.getElementById('phone').value,
                customer_email: document.getElementById('email').value,
                location: document.getElementById('eventLocation').value,
                event_date: document.getElementById('eventDate').value,
                total_balance: total,
                status: "Pending"
            };

            const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));

            // Trigger Print Dialog (Saves directly as clean PDF layout)
            window.print();
        }
    </script>
</body>
</html>
