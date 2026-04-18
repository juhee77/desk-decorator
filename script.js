/* ========================
   SCRIPT.JS — 책상 꾸미기 게임 (v2)
   기능: 드래그앤드롭, 클릭배치, 크기조절, 테마, LocalStorage, 토스트 알림
======================== */

// ── 상태 ──────────────────────────────────────────
const state = {
    placedItems: [],      // { id, content, x, y, size }
    currentCat: 'study',
    currentTheme: 'sunset',
    selectedItem: null,   // DOM element
    dragging: null,       // { source: 'palette'|'desk', element, content, offsetX, offsetY }
    itemSeq: 0,
    clickPlaceMode: false, // 팔레트에서 클릭하면 책상 클릭 대기
    hasAnalyzed: false
};

// ── DOM (추가) ──────────────────────────────────
const analyzeBtn     = document.getElementById('analyzeBtn');

// Challenge
const challengeWidget= document.getElementById('challengeWidget');
const challengeTitle = document.getElementById('challengeTitle');
const challengeDesc  = document.getElementById('challengeDesc');
const challengeCount = document.getElementById('challengeCount');
const challengeFill  = document.getElementById('challengeFill');
const challengeEmoji = document.getElementById('challengeEmoji');

// Result
const resultOverlay  = document.getElementById('resultOverlay');
const resultCard     = document.getElementById('resultCard');
const resultClose    = document.getElementById('resultClose');
const resultSaveBtn  = document.getElementById('resultSaveBtn');

// Music
const musicFab       = document.getElementById('musicFab');
const musicFabIcon   = document.getElementById('musicFabIcon');
const musicPanel     = document.getElementById('musicPanel');
const musicCloseBtn  = document.getElementById('musicCloseBtn');
const musicPlayBtn   = document.getElementById('musicPlayBtn');
const musicPlayIcon  = document.getElementById('musicPlayIcon');
const musicVol       = document.getElementById('musicVol');
const vinyl          = document.getElementById('vinyl');

// ── DOM ──────────────────────────────────────────
const deskSurface    = document.getElementById('deskSurface');
const deskHint       = document.getElementById('deskHint');
const itemCountEl    = document.getElementById('itemCount');
const lastSavedEl    = document.getElementById('lastSaved');
const itemsGrid      = document.getElementById('itemsGrid');
const clearBtn       = document.getElementById('clearBtn');
const saveBtn        = document.getElementById('saveBtn');
const randomBtn      = document.getElementById('randomBtn');
const toastContainer = document.getElementById('toastContainer');
const itemToolkit    = document.getElementById('itemToolkit');
const scaleUpBtn     = document.getElementById('scaleUp');
const scaleDownBtn   = document.getElementById('scaleDown');
const deleteItemBtn  = document.getElementById('deleteItem');

// ── 토스트 ──────────────────────────────────────
function showToast(message, type = 'info', duration = 2500) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ── 테마 ──────────────────────────────────────────
function applyTheme(theme) {
    state.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    saveToLocal();
}

document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
});

// ── 카테고리 탭 ──────────────────────────────────
function renderCategory(cat) {
    state.currentCat = cat;
    document.querySelectorAll('.cat-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.cat === cat);
    });

    const items = itemsConfig[cat] || [];
    itemsGrid.innerHTML = '';

    items.forEach(cfg => {
        const el = document.createElement('div');
        el.className = 'item';
        el.draggable = true;
        el.dataset.content = cfg.image;
        el.dataset.name    = cfg.name;
        el.innerHTML = `
            <div class="item-image-wrap">
                <img src="${cfg.image}" alt="${cfg.name}" loading="lazy">
            </div>
            <span class="item-label">${cfg.name}</span>
        `;

        // Drag start (palette → desk)
        el.addEventListener('dragstart', e => {
            state.dragging = { source: 'palette', content: cfg.image, name: cfg.name };
            el.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'copy';
        });
        el.addEventListener('dragend', () => el.classList.remove('dragging'));

        // Click: enter 배치 모드
        el.addEventListener('click', () => {
            if (state.clickPlaceMode && state.dragging?.pendingContent === cfg.image) {
                // 두 번 클릭 시 취소
                cancelClickPlace();
                return;
            }
            state.dragging = { source: 'palette', content: cfg.image, name: cfg.name, pendingContent: cfg.image };
            state.clickPlaceMode = true;
            deskSurface.style.cursor = 'crosshair';
            showToast(`${cfg.name}을(를) 책상에 놓을 위치를 클릭하세요`, 'info', 2000);
        });

        itemsGrid.appendChild(el);
    });
}

function cancelClickPlace() {
    state.clickPlaceMode = false;
    state.dragging = null;
    deskSurface.style.cursor = '';
}

document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => renderCategory(tab.dataset.cat));
});

// ── 책상 드래그 앤 드롭 ────────────────────────────
deskSurface.addEventListener('dragover', e => {
    e.preventDefault();
    deskSurface.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'copy';
});

deskSurface.addEventListener('dragleave', e => {
    if (!deskSurface.contains(e.relatedTarget)) {
        deskSurface.classList.remove('drag-over');
    }
});

deskSurface.addEventListener('drop', e => {
    e.preventDefault();
    deskSurface.classList.remove('drag-over');

    if (state.dragging) {
        const rect = deskSurface.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        if (state.dragging.source === 'palette') {
            placeItem(state.dragging.content, x, y);
        } else if (state.dragging.source === 'desk' && state.dragging.element) {
            const dx = state.dragging.offsetX || 36;
            const dy = state.dragging.offsetY || 36;
            moveItem(state.dragging.element, x - dx, y - dy);
        }
        state.dragging = null;
        cancelClickPlace();
    }
});

// 책상 클릭 배치
deskSurface.addEventListener('click', e => {
    if (!state.clickPlaceMode || !state.dragging?.content) return;
    if (e.target.closest('.placed-item')) return;

    const rect = deskSurface.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    placeItem(state.dragging.content, x, y, state.dragging.name);
    cancelClickPlace();
});

// 빈 곳 클릭 → 선택 해제
deskSurface.addEventListener('pointerdown', e => {
    if (!e.target.closest('.placed-item')) {
        deselectAll();
    }
});

// ── 아이템 배치 ────────────────────────────────────
function placeItem(content, x, y, name = '') {
    const size = 72;
    const id = `item-${++state.itemSeq}`;

    const el = document.createElement('div');
    el.className = 'placed-item';
    el.id = id;
    el.style.left = `${Math.max(0, x - size / 2)}px`;
    el.style.top  = `${Math.max(0, y - size / 2)}px`;
    el.style.setProperty('--item-size', `${size}px`);
    el.dataset.content = content;
    el.dataset.size    = size;

    const img = document.createElement('img');
    img.src = content;
    img.alt = name || 'desk item';
    img.draggable = false;
    el.appendChild(img);

    // 책상 위 드래그 (이동)
    el.addEventListener('pointerdown', e => {
        e.stopPropagation();
        selectItem(el);

        const rect   = deskSurface.getBoundingClientRect();
        const itemR  = el.getBoundingClientRect();
        const offsetX = e.clientX - itemR.left;
        const offsetY = e.clientY - itemR.top;

        let moved = false;

        const onMove = ev => {
            ev.preventDefault();
            moved = true;
            const sx = ev.clientX - rect.left - offsetX;
            const sy = ev.clientY - rect.top  - offsetY;
            moveItem(el, sx, sy);
        };

        const onUp = () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            if (moved) saveToLocal();
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);

        // dragstart용
        state.dragging = {
            source: 'desk',
            element: el,
            offsetX, offsetY
        };
    });

    // 더블클릭 삭제
    el.addEventListener('dblclick', () => removeItem(el));

    deskSurface.appendChild(el);
    updateHint();
    updateCount();
    checkChallenge();
    saveToLocal();

    return el;
}

function moveItem(el, x, y) {
    const maxX = deskSurface.clientWidth  - (parseInt(el.dataset.size) || 72);
    const maxY = deskSurface.clientHeight - (parseInt(el.dataset.size) || 72);
    el.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    el.style.top  = `${Math.max(0, Math.min(y, maxY))}px`;
}

function removeItem(el) {
    el.classList.add('removing');
    hideToolkit();
    setTimeout(() => {
        el.remove();
        updateHint();
        updateCount();
        checkChallenge();
        saveToLocal();
    }, 280);
}

// ── 선택 & 툴킷 ────────────────────────────────────
function selectItem(el) {
    deselectAll();
    state.selectedItem = el;
    el.classList.add('selected');
    positionToolkit(el);
}

function deselectAll() {
    document.querySelectorAll('.placed-item.selected').forEach(e => e.classList.remove('selected'));
    state.selectedItem = null;
    hideToolkit();
}

function positionToolkit(el) {
    const rect  = el.getBoundingClientRect();
    const tx    = rect.left + rect.width / 2 - itemToolkit.offsetWidth / 2;
    const ty    = rect.top - 48;
    itemToolkit.style.left = `${Math.max(4, tx)}px`;
    itemToolkit.style.top  = `${Math.max(4, ty)}px`;
    itemToolkit.classList.add('visible');
}

function hideToolkit() {
    itemToolkit.classList.remove('visible');
}

scaleUpBtn.addEventListener('click', () => {
    if (!state.selectedItem) return;
    const cur = parseInt(state.selectedItem.dataset.size) || 72;
    const nxt = Math.min(cur + 16, 160);
    state.selectedItem.dataset.size = nxt;
    state.selectedItem.style.setProperty('--item-size', `${nxt}px`);
    positionToolkit(state.selectedItem);
    saveToLocal();
});

scaleDownBtn.addEventListener('click', () => {
    if (!state.selectedItem) return;
    const cur = parseInt(state.selectedItem.dataset.size) || 72;
    const nxt = Math.max(cur - 16, 32);
    state.selectedItem.dataset.size = nxt;
    state.selectedItem.style.setProperty('--item-size', `${nxt}px`);
    positionToolkit(state.selectedItem);
    saveToLocal();
});

deleteItemBtn.addEventListener('click', () => {
    if (state.selectedItem) removeItem(state.selectedItem);
});

// ── UI 업데이트 ─────────────────────────────────────
function updateCount() {
    const n = deskSurface.querySelectorAll('.placed-item').length;
    itemCountEl.textContent = n;
    itemCountEl.style.transform = 'scale(1.2)';
    setTimeout(() => itemCountEl.style.transform = '', 200);
}

function updateHint() {
    const hasItems = deskSurface.querySelectorAll('.placed-item').length > 0;
    deskHint.classList.toggle('hidden', hasItems);
}

// ── 버튼 이벤트 ─────────────────────────────────────
clearBtn.addEventListener('click', () => {
    const items = deskSurface.querySelectorAll('.placed-item');
    if (!items.length) { showToast('배치된 아이템이 없어요!', 'info'); return; }
    if (!confirm('모든 아이템을 삭제할까요?')) return;
    items.forEach((el, i) => {
        setTimeout(() => el.classList.add('removing'), i * 40);
        setTimeout(() => el.remove(), i * 40 + 280);
    });
    setTimeout(() => { updateHint(); updateCount(); checkChallenge(); saveToLocal(); }, items.length * 40 + 300);
    showToast('책상이 깨끗해졌어요 ✨', 'success');
});

randomBtn.addEventListener('click', () => {
    // 기존 아이템 제거
    deskSurface.querySelectorAll('.placed-item').forEach(el => el.remove());

    const all = [];
    Object.values(itemsConfig).forEach(cat => cat.forEach(i => all.push(i)));

    const count = Math.floor(Math.random() * 6) + 8;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const cfg = all[Math.floor(Math.random() * all.length)];
            const x   = Math.random() * (deskSurface.clientWidth  - 100) + 50;
            const y   = Math.random() * (deskSurface.clientHeight - 100) + 50;
            const el  = placeItem(cfg.image, x, y, cfg.name);
            // optional: random sizes
            const size = [48, 64, 72, 80, 96][Math.floor(Math.random() * 5)];
            el.dataset.size = size;
            el.style.setProperty('--item-size', `${size}px`);
            
            if (i === count - 1) checkChallenge();
        }, i * 80);
    }
    showToast('랜덤 배치 완료! 🎲', 'success');
});

saveBtn.addEventListener('click', async () => {
    try {
        const hint = deskHint;
        hint.style.display = 'none';
        deselectAll();

        if (typeof html2canvas === 'undefined') {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            document.head.appendChild(s);
            await new Promise(res => { s.onload = res; });
        }

        const canvas = await html2canvas(deskSurface, { backgroundColor: null, scale: 2, useCORS: true });
        const link   = document.createElement('a');
        const ts     = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = `my-desk-${ts}.png`;
        link.href     = canvas.toDataURL('image/png');
        link.click();

        hint.style.display = '';
        showToast('스크린샷이 저장됐어요! 📸', 'success');
    } catch (err) {
        console.error(err);
        showToast('저장에 실패했어요. 다시 시도해주세요.', 'error');
    }
});

// ── LocalStorage ──────────────────────────────────
const SAVE_KEY = 'desk-decorator-v2';

function saveToLocal() {
    const items = Array.from(deskSurface.querySelectorAll('.placed-item')).map(el => ({
        content: el.dataset.content,
        x: parseInt(el.style.left),
        y: parseInt(el.style.top),
        size: parseInt(el.dataset.size) || 72
    }));

    const data = {
        items,
        theme: state.currentTheme,
        savedAt: new Date().toISOString()
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(data));

    const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    lastSavedEl.textContent = time;
}

function loadFromLocal() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);

        if (data.theme) applyTheme(data.theme);

        (data.items || []).forEach(item => {
            const el = placeItem(item.content, item.x + (item.size / 2), item.y + (item.size / 2));
            el.dataset.size = item.size || 72;
            el.style.setProperty('--item-size', `${item.size || 72}px`);
            // 위치 직접 세팅 (placeItem이 size/2 offset을 더했으므로 재정의)
            el.style.left = `${item.x}px`;
            el.style.top  = `${item.y}px`;
        });

        if (data.savedAt) {
            const d = new Date(data.savedAt);
            lastSavedEl.textContent = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        }

        if (data.items?.length) {
            showToast(`이전 책상을 불러왔어요 💾 (${data.items.length}개)`, 'info', 2000);
            checkChallenge();
        }
    } catch (e) {
        console.warn('로컬 저장 데이터 로드 실패:', e);
    }
}

// ── V3 Features: 데일리 챌린지 ─────────────────────────
const challenges = [
    { title: '집중 모드', desc: '학용품 3개 이상 배치하기', emoji: '📚', target: 3, check: (items) => countCat(items, 'study') },
    { title: '식물 집사', desc: '식물 3개 이상 배치하기', emoji: '🌿', target: 3, check: (items) => countCat(items, 'plants') },
    { title: '휴식 시간', desc: '음료/디저트 3개 이상 배치하기', emoji: '☕', target: 3, check: (items) => countCat(items, 'drinks') }
];
// (매일 바뀌게 하려면 Date 기반 index 선택)
const todayChallenge = challenges[new Date().getDate() % challenges.length];

function initChallenge() {
    challengeTitle.textContent = todayChallenge.title;
    challengeDesc.textContent  = todayChallenge.desc;
    challengeEmoji.textContent = todayChallenge.emoji;
    checkChallenge();
}

function countCat(itemsDOM, catName) {
    const urls = itemsConfig[catName].map(i => i.image);
    let count = 0;
    itemsDOM.forEach(el => {
        if(urls.includes(el.dataset.content)) count++;
    });
    return count;
}

function checkChallenge() {
    const itemsDOM = deskSurface.querySelectorAll('.placed-item');
    const current = todayChallenge.check(itemsDOM);
    const target = todayChallenge.target;
    
    // Update UI
    challengeCount.textContent = `${Math.min(current, target)}/${target}`;
    challengeFill.style.width = `${Math.min(100, (current/target)*100)}%`;
    
    if (current >= target) {
        if(!challengeWidget.classList.contains('completed')) {
            challengeWidget.classList.add('completed');
            showToast('🎉 오늘의 챌린지 달성!', 'success');
        }
    } else {
        challengeWidget.classList.remove('completed');
    }
}

// ── V3 Features: 취향 분석 ─────────────────────────
analyzeBtn.addEventListener('click', () => {
    const itemsDOM = deskSurface.querySelectorAll('.placed-item');
    if(itemsDOM.length < 5) {
        showToast('아이템을 5개 이상 배치해야 분석이 가능해요!', 'info');
        return;
    }
    
    const counts = {
        study: countCat(itemsDOM, 'study'),
        plants: countCat(itemsDOM, 'plants'),
        deco: countCat(itemsDOM, 'deco'),
        drinks: countCat(itemsDOM, 'drinks'),
        hobby: countCat(itemsDOM, 'hobby')
    };
    
    let maxCat = 'study';
    let maxVal = counts.study;
    for(const [cat, val] of Object.entries(counts)) {
        if(val > maxVal) { maxVal = val; maxCat = cat; }
    }
    
    const profiles = {
        study: { icon: '🎓', title: '집중력 만렙 학구파', desc: '펜과 노트가 항상 준비된 워커홀릭! 오늘 할 일을 내일로 미루지 않는 꼼꼼한 성격의 소유자네요.' },
        plants: { icon: '🪴', title: '힐링이 필요한 식물집사', desc: '책상 위 작은 숲을 가꾸며 마음에 안정을 찾는 타입. 자연을 사랑하고 차분한 무드를 즐겨요.' },
        deco: { icon: '✨', title: '갬성 충만 데코레이터', desc: '아무리 바빠도 예쁜 건 참을 수 없어! 반짝이는 조명과 소품들로 나만의 아늑한 세계를 만들었어요.' },
        drinks: { icon: '☕', title: '카페인 중독 홈카페장인', desc: '일/공부의 시작은 맛있는 음료부터. 커피나 디저트 없이는 책상에 앉지 않는 진정한 미식가네요!' },
        hobby: { icon: '🎧', title: '노는게 젤 좋아 취미부자', desc: '음악, 게임, 취미 생활이 인생의 원동력. 일할 땐 일하고 놀 땐 확실히 노는 쿨한 마인드예요.' }
    };
    
    const profile = profiles[maxCat];
    
    resultCard.innerHTML = `
        <div class="rc-stamp">DESK DECORATOR</div>
        <div class="rc-icon">${profile.icon}</div>
        <div class="rc-subtitle">나만의 책상 취향 결과는...</div>
        <div class="rc-title">${profile.title}</div>
        <div class="rc-desc">${profile.desc}</div>
        <div class="rc-footer">
            배치한 아이템: ${itemsDOM.length}개<br>가장 선호하는 테마: ${document.querySelector('.theme-btn.active').textContent.trim()}
        </div>
    `;
    
    resultOverlay.classList.add('active');
    state.hasAnalyzed = true;
});

resultClose.addEventListener('click', () => {
    resultOverlay.classList.remove('active');
});

resultSaveBtn.addEventListener('click', async () => {
    const originalSaveText = resultSaveBtn.innerHTML;
    try {
        resultSaveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 저장 중...';
        
        if (typeof html2canvas === 'undefined') {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            document.head.appendChild(s);
            await new Promise(res => { s.onload = res; });
        }
        
        // Hide close button temporarily
        resultClose.style.display = 'none';
        
        const canvas = await html2canvas(resultCard, { backgroundColor: null, scale: 2, useCORS: true });
        const link   = document.createElement('a');
        const ts     = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = `my-desk-profile-${ts}.png`;
        link.href     = canvas.toDataURL('image/png');
        link.click();
        
        resultClose.style.display = '';
        resultSaveBtn.innerHTML = '✅ 저장 완료!';
        showToast('내 취향 카드가 저장됐어요!', 'success');
        
        setTimeout(() => { resultSaveBtn.innerHTML = originalSaveText; }, 2000);
    } catch(err) {
        resultClose.style.display = '';
        resultSaveBtn.innerHTML = originalSaveText;
        showToast('저장에 실패했어요.', 'error');
    }
});

// ── V3 Features: Lofi YouTube BGM ─────────────────────────
let ytPlayer;
let isMusicPlaying = false;

// Load YT API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('ytPlayerWrap', {
        height: '1',
        width: '1',
        // Lofi Girl Live Stream (or a stable playlist, using generic Lofi radio)
        videoId: 'jfKfPfyJRdk', 
        playerVars: { 'autoplay': 0, 'controls': 0 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Ready to play
    event.target.setVolume(musicVol.value);
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        isMusicPlaying = true;
        musicPlayIcon.className = 'fas fa-pause';
        vinyl.classList.add('spinning');
        musicFab.classList.add('playing');
        musicFabIcon.textContent = '🔊';
    } else {
        isMusicPlaying = false;
        musicPlayIcon.className = 'fas fa-play';
        vinyl.classList.remove('spinning');
        musicFab.classList.remove('playing');
        musicFabIcon.textContent = '🎵';
    }
}

musicFab.addEventListener('click', () => {
    musicPanel.classList.toggle('active');
});

musicCloseBtn.addEventListener('click', () => {
    musicPanel.classList.remove('active');
});

musicPlayBtn.addEventListener('click', () => {
    if(!ytPlayer || !ytPlayer.playVideo) return showToast('음악을 불러오는 중입니다...', 'info');
    
    if (isMusicPlaying) {
        ytPlayer.pauseVideo();
    } else {
        ytPlayer.playVideo();
    }
});

musicVol.addEventListener('input', (e) => {
    if(ytPlayer && ytPlayer.setVolume) {
        ytPlayer.setVolume(e.target.value);
    }
});

// ── 모바일 탭 ─────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;
        document.getElementById('palettePanel').classList.toggle('active', tab === 'palette');
        document.getElementById('deskPanel').classList.toggle('active', tab === 'desk');
    });
});

// ── 키보드 단축키 ─────────────────────────────────
document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); saveBtn.click(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'd') { e.preventDefault(); clearBtn.click(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'r') { e.preventDefault(); randomBtn.click(); }
    if (e.key === 'Escape') { deselectAll(); cancelClickPlace(); }
    if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedItem) {
        removeItem(state.selectedItem);
    }
    if (e.key === '+' && state.selectedItem) scaleUpBtn.click();
    if (e.key === '-' && state.selectedItem) scaleDownBtn.click();
});

// 툴킷이 열려있을 때 스크롤/리사이즈 시 위치 업데이트
window.addEventListener('scroll', () => {
    if (state.selectedItem) positionToolkit(state.selectedItem);
});
window.addEventListener('resize', () => {
    if (state.selectedItem) positionToolkit(state.selectedItem);
});

// ── 초기화 ─────────────────────────────────────────
(function init() {
    // 모바일: 기본 palettePanel active
    if (window.innerWidth <= 600) {
        document.getElementById('palettePanel').classList.add('active');
        document.getElementById('deskPanel').classList.remove('active');
    } else {
        // desktop: 둘 다 표시
        document.getElementById('palettePanel').classList.remove('active');
        document.getElementById('deskPanel').classList.remove('active');
    }

    // 기본 테마 적용
    document.body.setAttribute('data-theme', 'sunset');

    // 기본 카테고리 렌더
    renderCategory('study');
    
    // 챌린지 초기화
    initChallenge();

    // 저장된 데이터 로드
    loadFromLocal();

    console.log('🌸 책상 꾸미기 v2에 오신 것을 환영합니다!');
    console.log('💾 배치된 아이템은 자동 저장됩니다.');
    console.log('⌨️  단축키: ⌘S(저장) | ⌘D(전체삭제) | ⌘R(랜덤) | Del(삭제) | +/-(크기)');
})();
