// 文章列表加载
function loadArticles() {
    fetch('/api/article')
        .then(res => res.json())
        .then(list => {
            const area = document.getElementById('articleList');
            if (!list.length) { area.innerHTML = '<p>暂无文章</p>'; return; }
            area.innerHTML = list.map(a => `
                <div class="article-card" onclick="showDetail(${a.id})">
                    <b>${a.title}</b> <span style="color:#888;font-size:0.95em;">[${a.type||''}]</span><br>
                    <span style="color:#666;">作者：${a.author||'匿名'} | ${a.createTime ? a.createTime.replace('T',' ').substring(0,16) : ''}</span>
                </div>
            `).join('');
        });
}

// 发布新文章
function publishArticle() {
    const title = document.getElementById('articleTitle').value.trim();
    const type = document.getElementById('articleType').value.trim();
    const author = document.getElementById('articleAuthor').value.trim();
    const content = document.getElementById('articleContent').value.trim();
    if (!title || !content) return alert('标题和内容不能为空');
    fetch('/api/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, author, content })
    }).then(() => {
        document.getElementById('publishForm').style.display = 'none';
        loadArticles();
    });
}

document.getElementById('showPublishBtn').onclick = function() {
    document.getElementById('publishForm').style.display = '';
};
document.getElementById('cancelPublishBtn').onclick = function() {
    document.getElementById('publishForm').style.display = 'none';
};
document.getElementById('publishBtn').onclick = publishArticle;

// 文章详情弹窗
let currentArticleId = null;
function showDetail(id) {
    currentArticleId = id;
    fetch(`/api/article/${id}`)
        .then(res => res.json())
        .then(a => {
            document.getElementById('articleDetail').innerHTML = `
                <h2>${a.title}</h2>
                <div style="color:#888;">作者：${a.author||'匿名'} | ${a.createTime ? a.createTime.replace('T',' ').substring(0,16) : ''}</div>
                <div style="margin:16px 0;">${a.content.replace(/\n/g,'<br>')}</div>
            `;
            loadFavorite();
            loadComments();
            document.getElementById('articleDetailModal').style.display = 'block';
        });
}
document.getElementById('closeDetailBtn').onclick = function() {
    document.getElementById('articleDetailModal').style.display = 'none';
};

// 评论区
function loadComments() {
    fetch(`/api/article/${currentArticleId}/comments`)
        .then(res => res.json())
        .then(list => {
            const area = document.getElementById('commentList');
            if (!list.length) { area.innerHTML = '<p>暂无评论</p>'; return; }
            area.innerHTML = list.map(c => `
                <div class="comment-item">
                    <b>${c.user||'匿名'}</b>：${c.content}<br>
                    <span style="color:#888;font-size:0.9em;">${c.createTime ? c.createTime.replace('T',' ').substring(0,16) : ''}</span>
                </div>
            `).join('');
        });
}
document.getElementById('commentBtn').onclick = function() {
    const user = document.getElementById('commentUser').value.trim();
    const content = document.getElementById('commentContent').value.trim();
    if (!content) return alert('评论不能为空');
    fetch(`/api/article/${currentArticleId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, content })
    }).then(() => {
        document.getElementById('commentContent').value = '';
        loadComments();
    });
};

// 收藏功能
function loadFavorite() {
    const user = localStorage.getItem('articleUser') || '游客';
    fetch(`/api/article/favorites?user=${encodeURIComponent(user)}`)
        .then(res => res.json())
        .then(favs => {
            const isFav = favs.includes(currentArticleId);
            document.getElementById('favoriteArea').innerHTML = `<button onclick="toggleFavorite()">${isFav ? '取消收藏' : '收藏'}</button>`;
        });
}
function toggleFavorite() {
    const user = localStorage.getItem('articleUser') || '游客';
    fetch(`/api/article/${currentArticleId}/favorite?user=${encodeURIComponent(user)}`, { method: 'POST' })
        .then(res => res.text())
        .then(msg => { alert(msg); loadFavorite(); });
}

// 用户名本地存储
if (!localStorage.getItem('articleUser')) {
    localStorage.setItem('articleUser', prompt('请输入你的昵称（可用于评论/收藏）：') || '游客');
}

// 初始化
loadArticles(); 