// 弹窗显示/关闭
const addBtn = document.getElementById('addMemberBtn');
const modal = document.getElementById('addModal');
const closeModal = document.getElementById('closeModal');
const addForm = document.getElementById('addMemberForm');
const memberList = document.getElementById('memberList');

addBtn.onclick = () => { modal.style.display = 'flex'; };
closeModal.onclick = () => { modal.style.display = 'none'; };
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

let editMemberId = null;

// 获取成员列表
function getMembers() {
    return fetch('/api/family').then(res => res.json());
}

// 渲染成员列表
function renderMembers() {
    getMembers().then(members => {
        if (!members.length) {
            memberList.innerHTML = '<p style="color:#888;">暂无家庭成员</p>';
            return;
        }
        memberList.innerHTML = members.map(m => `
            <div class="member-card">
                <img class="member-photo" src="${m.photoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}" alt="photo">
                <div class="member-info">
                    <div><b>${m.name}</b> (${m.relation})</div>
                    <div>生日: ${m.birthday || '-'}</div>
                </div>
                <div class="member-actions">
                    <button class="edit-btn" onclick="editMember(${m.id})">修改</button>
                    <button onclick="deleteMember(${m.id})">删除</button>
                </div>
            </div>
        `).join('');
    });
}

// 修改按钮事件
window.editMember = function(id) {
    fetch('/api/family')
        .then(res => res.json())
        .then(members => {
            const m = members.find(item => item.id === id);
            if (m) {
                document.getElementById('memberName').value = m.name;
                document.getElementById('memberRelation').value = m.relation;
                document.getElementById('memberBirthday').value = m.birthday;
                // 照片不自动填充（安全原因），如需更换可重新上传
                editMemberId = id;
                modal.style.display = 'flex';
            }
        });
};

// 表单提交事件
addForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('memberName').value.trim();
    const relation = document.getElementById('memberRelation').value.trim();
    const birthday = document.getElementById('memberBirthday').value;
    const photoInput = document.getElementById('memberPhoto');
    let photoUrl = '';
    if (photoInput.files.length) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            photoUrl = evt.target.result;
            saveOrUpdateMember(name, relation, birthday, photoUrl);
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        saveOrUpdateMember(name, relation, birthday, photoUrl);
    }
};

function saveOrUpdateMember(name, relation, birthday, photoUrl) {
    if (editMemberId) {
        // 修改成员
        fetch(`/api/family/${editMemberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, relation, birthday, photoUrl })
        }).then(() => {
            modal.style.display = 'none';
            addForm.reset();
            editMemberId = null;
            renderMembers();
        });
    } else {
        // 新增成员
        fetch('/api/family', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, relation, birthday, photoUrl })
        }).then(() => {
            modal.style.display = 'none';
            addForm.reset();
            renderMembers();
        });
    }
}

// 删除成员
window.deleteMember = function(id) {
    if (!confirm('确定要删除该成员吗？')) return;
    fetch(`/api/family/${id}`, { method: 'DELETE' })
        .then(() => renderMembers());
};

// 初始化
renderMembers(); 