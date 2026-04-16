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
    clickPlaceMode: false // 팔레트에서 클릭하면 책상 클릭 대기
};

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
    setTimeout(() => { updateHint(); updateCount(); saveToLocal(); }, items.length * 40 + 300);
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
        }
    } catch (e) {
        console.warn('로컬 저장 데이터 로드 실패:', e);
    }
}

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

    // 저장된 데이터 로드
    loadFromLocal();

    console.log('🌸 책상 꾸미기 v2에 오신 것을 환영합니다!');
    console.log('💾 배치된 아이템은 자동 저장됩니다.');
    console.log('⌨️  단축키: ⌘S(저장) | ⌘D(전체삭제) | ⌘R(랜덤) | Del(삭제) | +/-(크기)');
})();
