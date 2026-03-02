// CONFIGURATION
const ADMIN_PASS = "admin123"; // CHANGE YOUR PASSWORD HERE
const apts = ['9A', '9B', '9C', '9D'];

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    setupInputs();
    renderHistory();
});

// Generate Input fields for the Admin Panel
function setupInputs() {
    const container = document.getElementById('aptInputs');
    apts.forEach(apt => {
        container.innerHTML += `
            <div class="apt-card">
                <h3 class="font-bold mb-2">Apartment ${apt}</h3>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-[10px] uppercase font-bold text-slate-400">Prev</label>
                        <input type="number" id="prev-${apt}" class="form-input text-sm p-2" placeholder="0">
                    </div>
                    <div>
                        <label class="text-[10px] uppercase font-bold text-slate-400">Curr</label>
                        <input type="number" id="curr-${apt}" class="form-input text-sm p-2" placeholder="0">
                    </div>
                </div>
            </div>
        `;
    });
}

// Security Logic
function loginAdmin() {
    const p = prompt("Enter Password:");
    if (p === ADMIN_PASS) {
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('loginBtn').classList.add('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');
    } else {
        alert("Wrong Password");
    }
}

function logoutAdmin() {
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
}

// Calculation Logic
function calculateAndSave() {
    const totalCash = parseFloat(document.getElementById('totalCash').value);
    let totalUnits = 0;
    let aptResults = {};

    // 1. Calculate units used
    for (let apt of apts) {
        const p = parseFloat(document.getElementById(`prev-${apt}`).value) || 0;
        const c = parseFloat(document.getElementById(`curr-${apt}`).value) || 0;
        const used = c - p;
        
        if (used < 0) return alert(`Error: ${apt} current reading is less than previous.`);
        aptResults[apt] = used;
        totalUnits += used;
    }

    if (totalUnits === 0 || !totalCash) return alert("Enter valid data!");

    // 2. Split BDT proportionally
    const month = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    const billEntry = {
        month: month,
        total: totalCash,
        details: {}
    };

    apts.forEach(apt => {
        const share = (aptResults[apt] / totalUnits) * totalCash;
        billEntry.details[apt] = share.toFixed(2);
    });

    // 3. Save to LocalStorage
    let history = JSON.parse(localStorage.getItem('billData')) || [];
    history.unshift(billEntry);
    localStorage.setItem('billData', JSON.stringify(history));

    renderHistory();
    logoutAdmin();
    alert("Bill Posted Successfully!");
}

// Render Table
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('billData')) || [];
    const tbody = document.getElementById('historyBody');
    tbody.innerHTML = history.map(row => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 border font-bold">${row.month}</td>
            <td class="p-3 border">${row.details['9A']}</td>
            <td class="p-3 border">${row.details['9B']}</td>
            <td class="p-3 border">${row.details['9C']}</td>
            <td class="p-3 border">${row.details['9D']}</td>
            <td class="p-3 border bg-blue-50 font-bold text-blue-600">${row.total}</td>
        </tr>
    `).join('');
}
