// SET YOUR CREDENTIALS HERE
const VALID_ID = "rashedramsey";
const VALID_PASS = "RASHED1234";

const apts = ['9A', '9B', '9C', '9D'];
let isAdmin = false;

document.addEventListener('DOMContentLoaded', () => {
    setupInputs();
    renderHistory();
});

// Modal Controls
function openModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('adminID').value = '';
    document.getElementById('adminPass').value = '';
}

function handleLogin() {
    const id = document.getElementById('adminID').value;
    const pass = document.getElementById('adminPass').value;

    if (id === VALID_ID && pass === VALID_PASS) {
        isAdmin = true;
        closeModal();
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('loginBtn').classList.add('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');
        document.getElementById('adminHead').classList.remove('hidden');
        renderHistory();
    } else {
        alert("Invalid ID or Password!");
    }
}

function logoutAdmin() {
    isAdmin = false;
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    document.getElementById('adminHead').classList.add('hidden');
    renderHistory();
}

// Logic functions (setupInputs, calculateAndSave, renderHistory) remain the same
function setupInputs() {
    const container = document.getElementById('aptInputs');
    apts.forEach(apt => {
        container.innerHTML += `
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 class="font-bold text-slate-800 mb-4 text-lg">Apartment ${apt}</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] uppercase font-bold text-slate-400">Previous</label>
                        <input type="number" id="prev-${apt}" class="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="0">
                    </div>
                    <div>
                        <label class="text-[10px] uppercase font-bold text-slate-400">Current</label>
                        <input type="number" id="curr-${apt}" class="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="0">
                    </div>
                </div>
            </div>
        `;
    });
}

function calculateAndSave() {
    const totalCash = parseFloat(document.getElementById('totalCash').value);
    let totalUnits = 0;
    let aptData = [];

    for (let apt of apts) {
        const prev = parseFloat(document.getElementById(`prev-${apt}`).value) || 0;
        const curr = parseFloat(document.getElementById(`curr-${apt}`).value) || 0;
        const used = curr - prev;
        if (used < 0) return alert(`Error in ${apt}: Current reading is lower than previous.`);
        aptData.push({ apt, prev, curr, used });
        totalUnits += used;
    }

    if (totalUnits === 0 || !totalCash) return alert("Fill all fields!");

    const perUnitRate = (totalCash / totalUnits).toFixed(4);
    const month = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

    const billEntry = {
        month, totalCash, totalUnits, perUnitRate,
        details: aptData.map(item => ({
            ...item,
            billAmount: (item.used * perUnitRate).toFixed(2)
        }))
    };

    let history = JSON.parse(localStorage.getItem('building_bills_final')) || [];
    history.unshift(billEntry);
    localStorage.setItem('building_bills_final', JSON.stringify(history));

    renderHistory();
    alert("Bill Posted Successfully!");
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('building_bills_final')) || [];
    const tbody = document.getElementById('historyBody');
    tbody.innerHTML = '';

    history.forEach((monthGroup, mIndex) => {
        monthGroup.details.forEach((row, rIndex) => {
            const isFirst = rIndex === 0;
            tbody.innerHTML += `
                <tr class="${isFirst ? 'border-t-4 border-slate-200' : 'border-t border-slate-100'} hover:bg-slate-50 transition-colors">
                    <td class="p-4 border-r font-bold text-slate-800">${isFirst ? monthGroup.month : ''}</td>
                    <td class="p-4 border-r font-semibold text-blue-600">${row.apt}</td>
                    <td class="p-4 border-r text-center text-slate-500">${row.prev}</td>
                    <td class="p-4 border-r text-center text-slate-500">${row.curr}</td>
                    <td class="p-4 border-r text-center font-bold text-slate-800">${row.used}</td>
                    <td class="p-4 border-r text-center text-slate-400">${isFirst ? monthGroup.perUnitRate : ''}</td>
                    <td class="p-4 border-r text-center font-black text-slate-900">${row.billAmount} BDT</td>
                    ${isAdmin && isFirst ? `
                        <td class="p-4 text-center" rowspan="4">
                            <button onclick="deleteEntry(${mIndex})" class="bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-all">Delete</button>
                        </td>
                    ` : (isAdmin ? '<td></td>' : '')}
                </tr>
            `;
        });
    });
}

function deleteEntry(index) {
    if (confirm("Delete this entire month's record?")) {
        let history = JSON.parse(localStorage.getItem('building_bills_final')) || [];
        history.splice(index, 1);
        localStorage.setItem('building_bills_final', JSON.stringify(history));
        renderHistory();
    }
}


function renderHistory() {
    const history = JSON.parse(localStorage.getItem('building_bills_final')) || [];
    const tbody = document.getElementById('historyBody');
    tbody.innerHTML = '';

    history.forEach((monthGroup, mIndex) => {
        monthGroup.details.forEach((row, rIndex) => {
            const isFirst = rIndex === 0;
            tbody.innerHTML += `
                <tr class="${isFirst ? 'border-t-4 border-slate-200' : 'border-t border-slate-100'} hover:bg-slate-50 transition-colors">
                    <td class="p-4 border-r font-bold text-slate-800 bg-slate-50">${isFirst ? monthGroup.month : ''}</td>
                    
                    <td class="p-4 border-r font-semibold text-blue-600">${row.apt}</td>
                    
                    <td class="p-4 border-r text-center text-slate-500">${row.prev}</td>
                    <td class="p-4 border-r text-center text-slate-500">${row.curr}</td>
                    
                    <td class="p-4 border-r text-center font-bold text-slate-800">${row.used}</td>
                    
                    <td class="p-4 border-r text-center text-slate-400">${isFirst ? monthGroup.perUnitRate : ''}</td>
                    
                    <td class="p-4 border-r text-center font-bold text-blue-700 bg-blue-50/50">
                        ${isFirst ? monthGroup.totalCash + ' BDT' : ''}
                    </td>

                    <td class="p-4 border-r text-center font-black text-slate-900">${row.billAmount} BDT</td>
                    
                    ${isAdmin && isFirst ? `
                        <td class="p-4 text-center" rowspan="4">
                            <button onclick="deleteEntry(${mIndex})" class="bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold">Delete</button>
                        </td>
                    ` : (isAdmin ? '<td></td>' : '')}
                </tr>
            `;
        });
    });
}

