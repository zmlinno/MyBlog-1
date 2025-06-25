const dateInput = document.getElementById('dateInput');
const descInput = document.getElementById('descInput');
const amountInput = document.getElementById('amountInput');
const typeInput = document.getElementById('typeInput');
const addBtn = document.getElementById('addBtn');
const accountList = document.getElementById('accountList');
const accountSummary = document.getElementById('accountSummary');

function getRecords() {
    return JSON.parse(localStorage.getItem('accountRecords') || '[]');
}
function setRecords(records) {
    localStorage.setItem('accountRecords', JSON.stringify(records));
}

function renderRecords() {
    const records = getRecords();
    if (!records.length) {
        accountList.innerHTML = '<p style="color:#888;">暂无收支记录</p>';
        accountSummary.innerHTML = '';
        return;
    }
    let income = 0, expense = 0;
    accountList.innerHTML = records.map((r, i) => {
        if (r.type === '收入') income += Number(r.amount);
        else expense += Number(r.amount);
        return `
            <div class="account-item">
                <span>${r.date} | ${r.desc} | ${r.type === '收入' ? '+' : '-'}${r.amount}元</span>
                <button class="delete-btn" onclick="deleteRecord(${i})">删除</button>
            </div>
        `;
    }).join('');
    accountSummary.innerHTML = `总收入：<b style="color:green;">${income}</b> 元　总支出：<b style="color:red;">${expense}</b> 元　结余：<b style="color:#357ae8;">${income - expense}</b> 元`;
}

addBtn.onclick = function() {
    const date = dateInput.value;
    const desc = descInput.value.trim();
    const amount = amountInput.value;
    const type = typeInput.value;
    if (!date || !desc || !amount) return alert('请填写完整信息');
    const records = getRecords();
    records.push({ date, desc, amount, type });
    setRecords(records);
    dateInput.value = '';
    descInput.value = '';
    amountInput.value = '';
    renderRecords();
};

window.deleteRecord = function(idx) {
    if (!confirm('确定要删除这条记录吗？')) return;
    const records = getRecords();
    records.splice(idx, 1);
    setRecords(records);
    renderRecords();
};

renderRecords();