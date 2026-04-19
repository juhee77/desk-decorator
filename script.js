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
    hasAnalyzed: false,
    unlockedItems: [],    // 해금된 가챠 아이템 ID들
    lastGachaDate: null,  // 마지막 뽑기 날짜
    focusCoins: 0,        // 포모도로 타이머를 통해 획득한 코인
    isRainy: false,       // 날씨 상태
    pets: []              // 현재 책상 위의 펫 요소들
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

// Timer
const timerFab       = document.getElementById('timerFab');
const timerPanel     = document.getElementById('timerPanel');
const timerCloseBtn  = document.getElementById('timerCloseBtn');
const timerDisplay   = document.getElementById('timerDisplay');
const timerPlayBtn   = document.getElementById('timerPlayBtn');
const timerPlayIcon  = document.getElementById('timerPlayIcon');
const timerResetBtn  = document.getElementById('timerResetBtn');
const focusCoinCount = document.getElementById('focusCoinCount');

// Note Editor
const noteEditorOverlay = document.getElementById('noteEditorOverlay');
const noteInput         = document.getElementById('noteInput');
const noteSaveBtn      = document.getElementById('noteSaveBtn');
const noteCancelBtn    = document.getElementById('noteCancelBtn');
let currentEditingItem = null; // 현재 편집 중인 아이템 ID

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
// ── 테마 & 실시간 연동 ─────────────────────────
let manualThemeOverride = false;

function applyTheme(theme, isManual = false) {
    if (isManual) manualThemeOverride = true;
    state.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    saveToLocal();
}

function syncThemeToTime() {
    if (manualThemeOverride) return;
    
    const hour = new Date().getHours();
    let targetTheme = 'ocean'; // 기본값 (낮)
    
    if (hour >= 6 && hour < 16) {
        targetTheme = 'ocean'; // 낮 (아침~오후) - 바다/숲 등 밝은 테마 사용
    } else if (hour >= 16 && hour < 19) {
        targetTheme = 'sunset'; // 노을
    } else {
        targetTheme = 'night';  // 밤
    }
    
    if (state.currentTheme !== targetTheme) {
        applyTheme(targetTheme, false);
    }
}

// 1분마다 시간 체크하여 테마 변경
setInterval(syncThemeToTime, 60000);

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
        const isLocked = cfg.isLocked && !state.unlockedItems.includes(cfg.id);
        
        el.className = `item ${isLocked ? 'locked' : ''}`;
        el.draggable = !isLocked;
        el.dataset.id      = cfg.id;
        el.dataset.content = cfg.image;
        el.dataset.name    = cfg.name;
        el.dataset.isPet   = cfg.isPet || false;
        
        el.innerHTML = `
            <div class="item-image-wrap">
                <img src="${cfg.image}" alt="${cfg.name}" loading="lazy">
            </div>
            <span class="item-label">${cfg.name}</span>
        `;

        if (isLocked) {
            el.addEventListener('click', () => showToast('가챠를 통해 해금해야 하는 아이템입니다! 🔒', 'info'));
            itemsGrid.appendChild(el);
            return;
        }

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
function placeItem(content, x, y, name = '', initialText = '') {
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
    el.dataset.text    = initialText; // 데이터 속성에 텍스트 저장
    
    // 펫 여부 확인
    const isPet = Object.values(itemsConfig).flat().find(i => i.image === content)?.isPet;
    if (isPet) {
        el.classList.add('is-pet');
        initPetBehavior(el);
    }

    const img = document.createElement('img');
    img.src = content;
    img.alt = name || 'desk item';
    img.draggable = false;
    el.appendChild(img);

    // [Memo] 텍스트 레이어 추가
    const itemCfg = Object.values(itemsConfig).flat().find(i => i.image === content);
    if (itemCfg?.isNote) {
        el.classList.add('is-note');
        const textDiv = document.createElement('div');
        textDiv.className = 'placed-item-text';
        // 전달받은 텍스트가 있으면 표시
        if (initialText) {
            textDiv.textContent = initialText;
        }
        el.appendChild(textDiv);

        el.addEventListener('click', () => {
            if (state.clickPlaceMode) return;
            openNoteEditor(id);
        });
    }

    // [Music Player] 클릭 이벤트 추가
    if (itemCfg?.isMusicPlayer) {
        el.classList.add('music-player-item');
        if (isMusicPlaying) el.classList.add('playing');

        el.addEventListener('click', () => {
            if (state.clickPlaceMode) return;
            // 글로벌 재생 버튼 클릭과 동일한 동적 처리
            musicPlayBtn.click();
        });
    }

    // [Weather Window] 클릭 이벤트 추가
    if (itemCfg?.isWeatherWindow) {
        el.classList.add('weather-window-item');
        if (state.isRainy) el.classList.add('rainy');

        el.addEventListener('click', () => {
            if (state.clickPlaceMode) return;
            toggleRain();
        });
    }

    // 더블클릭 (좋아요 액션)
    el.addEventListener('dblclick', (e) => {
        if (state.clickPlaceMode) return;
        spawnPetHeart(el, e.clientX, e.clientY);
        
        // 아이템이 살짝 떨리는 애니메이션 (선택적)
        el.style.transform += ' rotate(-5deg) scale(1.1)';
        setTimeout(() => {
            el.style.transform = el.style.transform.replace(' rotate(-5deg) scale(1.1)', '');
        }, 300);
    });

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
        size: parseInt(el.dataset.size) || 72,
        text: el.dataset.text || '' // 텍스트 필드 추가
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
            const el = placeItem(item.content, item.x + (item.size / 2), item.y + (item.size / 2), '', item.text || '');
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
// ── V3 Features: 취향 분석 (Psychological Assessment) ─────────────────────────
analyzeBtn.addEventListener('click', () => {
    const itemsDOM = deskSurface.querySelectorAll('.placed-item');
    if(itemsDOM.length < 5) {
        showToast('정확한 심리 분석을 위해 최소 5개 이상의 오브젝트 배치가 필요합니다.', 'info');
        return;
    }

    resultOverlay.classList.add('active');
    const loadingScreen = document.getElementById('analysisLoading');
    const loadingText = document.getElementById('loadingText');
    
    loadingScreen.classList.add('active');
    resultCard.innerHTML = ''; // Keep the box visible so container doesn't shrink
    resultCard.style.display = 'flex';
    
    // Reset and start typewriter effect
    loadingText.innerHTML = '>> SYSTEM BOOT...<br/>';
    const steps = [
        ">> CALIBRATING SURROUNDINGS...",
        ">> ANALYZING SPATIAL DENSITY...",
        ">> CALCULATING CLUSTER VARIANCES [x, y]...",
        ">> MAPPING TO BIG-FIVE ARCHETYPES...",
        ">> DIAGNOSIS COMPLETE."
    ];
    
    let stepIdx = 0;
    const loadInt = setInterval(() => {
        if(stepIdx < steps.length) {
            loadingText.innerHTML += steps[stepIdx] + '<br/>';
            stepIdx++;
        } else {
            clearInterval(loadInt);
            loadingText.innerHTML += '<span class="loading-cursor"></span>';
            setTimeout(() => {
                loadingScreen.classList.remove('active');
                resultCard.style.display = 'flex';
                generateDiagnosticReport(itemsDOM);
            }, 800);
        }
    }, 500);
});

function generateDiagnosticReport(itemsDOM) {
    // 1. Spatial Analysis (Positions)
    let sumX = 0, sumY = 0;
    const coords = [];
    itemsDOM.forEach(el => {
        const x = parseFloat(el.style.left || 0);
        const y = parseFloat(el.style.top || 0);
        coords.push({x, y});
        sumX += x; sumY += y;
    });
    
    const count = coords.length;
    const meanX = sumX / count;
    const meanY = sumY / count;
    
    let varX = 0, varY = 0;
    coords.forEach(c => {
        varX += Math.pow(c.x - meanX, 2);
        varY += Math.pow(c.y - meanY, 2);
    });
    // Standard deviation as a metric of scattering
    const stdDev = Math.sqrt((varX + varY) / count);
    
    const isSpread = stdDev > 180;
    const spatialLabel = isSpread ? "확장 분산형 (Broad Workspace)" : "중앙 집중형 (Centered Focus)";
    
    // 2. Density Analysis
    const isMaximalist = count >= 15;
    const densityLabel = isMaximalist ? "맥시멀리즘 (High Cognitive Load Capacity)" : "미니멀리즘 (Controlled Environment)";
    
    // 3. Category Dominance (Big Five Mapping)
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
        study: { 
            title: '조율된 완벽주의자', 
            trait: '성실성 (Conscientiousness) 최상',
            expert: '통제된 환경에서 최상의 성과를 내는 날카로운 집중력의 소유자입니다. 목표 지향적이며 체계적인 사고를 선호합니다.' 
        },
        plants: { 
            title: '자연 친화적 몽상가', 
            trait: '개방성 (Openness) 최상',
            expert: '정형화된 틀을 깨고 초록의 생명력에서 시각적 영감을 얻습니다. 일상 속 변주를 즐기는 창의적 마인드가 돋보이네요.' 
        },
        deco: { 
            title: '공간 창조형 아티스트', 
            trait: '미적 감각 (Aesthetics) 극대화',
            expert: '아무리 바빠도 환경의 미학은 포기할 수 없습니다. 자기표현 욕구가 강하고 디테일한 센스가 뛰어납니다.' 
        },
        drinks: { 
            title: '소셜 커넥터 & 미식가', 
            trait: '외향/친화성 (Extraversion) 우세',
            expert: '루틴 속에 작은 보상을 배치함으로써 에너지를 얻는 타입입니다. 여유와 소통을 소중히 여기는 긍정적인 활동가네요.' 
        },
        hobby: { 
            title: '안전기지 구축가', 
            trait: '안정 추구 (Comfort Seeking)',
            expert: '치열한 일상 속, 책상을 온전한 나만의 도피처(Safe Haven)로 조형했습니다. 현재 멘탈 케어와 심리적 환기가 필요할 수도 있습니다.' 
        }
    };
    
    const profile = profiles[maxCat];
    const themeMap = { 'sunset': '🌅 Sunset', 'night': '🌙 Night', 'forest': '🌿 Forest', 'ocean': '🌊 Ocean' };
    const themeStr = themeMap[state.currentTheme] || '🎨 Auto';
    const dateStr = new Date().toISOString().split('T')[0];
    
    resultCard.innerHTML = `
        <div class="rc-stamp">CONFIDENTIAL</div>
        <div class="rc-header">
            <div class="rc-doc-tit">PSYCHOLOGICAL SPACE ASSESSMENT</div>
            <div style="font-size:0.75rem; color:#666;">Date: ${dateStr}</div>
        </div>
        <div class="rc-subtitle">Primary Archetype</div>
        <div class="rc-title">${profile.title}</div>
        
        <div class="rc-grid">
            <div class="rc-stat"><span>DOMINANCE</span>${profile.trait}</div>
            <div class="rc-stat"><span>SPATIAL</span>${spatialLabel}</div>
            <div class="rc-stat"><span>DENSITY</span>${densityLabel}</div>
            <div class="rc-stat"><span>ENVIRONMENT</span>Theme: ${themeStr}</div>
        </div>
        
        <div class="rc-desc">
            <strong>Behavioral Analysis:</strong> 피험자의 데스크톱 환경은 총 ${count}개의 시각적 객체로 구성되어 있으며, 
            좌표 편차(σ=${Math.round(stdDev)})에 따른 공간 분포 패턴과 밀집도를 보여줍니다.
        </div>
        
        <div class="rc-expert">
            " ${profile.expert} "
        </div>
        
        <div class="rc-footer">
            <div>Dept. of Spatial Psychology</div>
            <div>Auth: Dr. Desk Decorator</div>
        </div>
    `;
    
    state.hasAnalyzed = true;
}

resultClose.addEventListener('click', () => {
    resultOverlay.classList.remove('active');
    // Stop loading just in case closed early
    const loadingScreen = document.getElementById('analysisLoading');
    loadingScreen.classList.remove('active');
    document.getElementById('loadingText').innerHTML = '';
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
    updateMusicPlayerItemsUI();
}

function updateMusicPlayerItemsUI() {
    document.querySelectorAll('.music-player-item').forEach(el => {
        el.classList.toggle('playing', isMusicPlaying);
    });
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

    // Time-Sync 테마 적용 (localStorage보다 우선할지 여부)
    // 기본적으로 접속 시간에 맞는 테마를 강제 반영합니다.
    syncThemeToTime();

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

// ── V3 Features: 백색소음 믹서 (Ambient Mixer) ────────────────
const audioRain = document.getElementById('audioRain');
const audioFire = document.getElementById('audioFire');
const audioKey  = document.getElementById('audioKey');

const ambRainVol = document.getElementById('ambRainVol');
const ambFireVol = document.getElementById('ambFireVol');
const ambKeyVol  = document.getElementById('ambKeyVol');

function setupAmbientSlider(audioEl, sliderEl) {
    if (!audioEl || !sliderEl) return;
    sliderEl.addEventListener('input', (e) => {
        const vol = e.target.value / 100;
        audioEl.volume = vol;
        if (vol > 0 && audioEl.paused) {
            audioEl.play().catch(err => console.log('Audio Autoplay blocked:', err));
        } else if (vol === 0 && !audioEl.paused) {
            audioEl.pause();
        }
    });
}

setupAmbientSlider(audioRain, ambRainVol);
setupAmbientSlider(audioFire, ambFireVol);
setupAmbientSlider(audioKey, ambKeyVol);
// Load additional Phase 4-B state
function loadV4State() {
    const unlocked = localStorage.getItem('unlockedItems');
    if (unlocked) state.unlockedItems = JSON.parse(unlocked);
    state.lastGachaDate = saved.lastGachaDate || null;
    state.focusCoins = saved.focusCoins || 0;
    
    // UI 반영
    updateGachaStatus();
}

// ── V4 Features: 가챠 시스템 ───────────────────────
const gachaBtn = document.getElementById('gachaBtn');
const gachaStatus = document.getElementById('gachaStatus');
const gachaOverlay = document.getElementById('gachaOverlay');
const gachaConfirmBtn = document.getElementById('gachaConfirmBtn');

function updateGachaStatus() {
    focusCoinCount.textContent = state.focusCoins;
    const today = new Date().toISOString().split('T')[0];
    
    if (state.lastGachaDate !== today) {
        gachaStatus.textContent = '오늘의 무료 캡슐이 준비되었습니다! (1/1)';
        gachaBtn.style.opacity = '1';
        gachaBtn.style.pointerEvents = 'auto';
        gachaBtn.querySelector('span').textContent = 'FREE';
    } else if (state.focusCoins > 0) {
        gachaStatus.textContent = '코인을 1개 사용하여 캡슐을 열 수 있습니다.';
        gachaBtn.style.opacity = '1';
        gachaBtn.style.pointerEvents = 'auto';
        gachaBtn.querySelector('span').textContent = 'USE 🍅';
    } else {
        gachaStatus.textContent = '무료 개봉을 완료했습니다. 내일 자정이나 타이머를 통해 코인을 얻어주세요!';
        gachaBtn.style.opacity = '0.5';
        gachaBtn.style.pointerEvents = 'none';
        gachaBtn.querySelector('span').textContent = 'EMPTY';
    }
}

gachaBtn.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    
    // 조건 확인
    if (state.lastGachaDate === today) {
        if (state.focusCoins > 0) {
            state.focusCoins--;
            saveToLocal();
        } else {
            return;
        }
    } else {
        state.lastGachaDate = today;
    }

    // 가챠 뽑기 로직
    const lockable = itemsConfig.collection.filter(i => !state.unlockedItems.includes(i.id));
    if (lockable.length === 0) {
        showToast('모든 컬렉션 아이템을 수집하셨습니다! ✨', 'success');
        return;
    }

    const winIdx = Math.floor(Math.random() * lockable.length);
    const wonItem = lockable[winIdx];

    // UI 애니메이션
    gachaBtn.classList.add('spinning');
    setTimeout(() => {
        gachaBtn.classList.remove('spinning');
        showGachaResult(wonItem);
        
        // 상태 저장
        state.unlockedItems.push(wonItem.id);
        state.lastGachaDate = today;
        localStorage.setItem('unlockedItems', JSON.stringify(state.unlockedItems));
        localStorage.setItem('lastGachaDate', today);
        
        updateGachaStatus();
        if (state.currentCat === 'collection') renderCategory('collection');
    }, 1200);
});

function showGachaResult(item) {
    const unlockedItemImg = document.getElementById('gachaUnlockedItem');
    const unlockedItemName = document.getElementById('unlockedItemName');
    
    unlockedItemImg.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
    unlockedItemName.textContent = item.name;
    
    gachaOverlay.classList.add('active');
    setTimeout(() => {
        gachaOverlay.classList.add('open');
    }, 100);
}

gachaConfirmBtn.addEventListener('click', () => {
    gachaOverlay.classList.remove('open');
    setTimeout(() => {
        gachaOverlay.classList.remove('active');
    }, 500);
});

// ── PHASE 6-B: 메모 에디터 로직 ───────────────────────
function openNoteEditor(itemId) {
    const itemData = state.placedItems.find(i => i.id === itemId);
    if (!itemData) return;

    currentEditingItem = itemId;
    noteInput.value = itemData.text || '';
    noteEditorOverlay.classList.add('active');
    noteInput.focus();
}

noteSaveBtn.addEventListener('click', () => {
    if (!currentEditingItem) return;
    
    const text = noteInput.value.trim();
    const itemData = state.placedItems.find(i => i.id === currentEditingItem);
    const el = document.getElementById(currentEditingItem);

    if (itemData && el) {
        itemData.text = text;
        el.dataset.text = text; // 데이터 속성 동기화
        const textDiv = el.querySelector('.placed-item-text');
        if (textDiv) textDiv.textContent = text;
        
        saveToLocal();
        showToast('메모가 저장되었습니다! ✨', 'success');
    }

    closeNoteEditor();
});

noteCancelBtn.addEventListener('click', closeNoteEditor);

function closeNoteEditor() {
    noteEditorOverlay.classList.remove('active');
    currentEditingItem = null;
    noteInput.value = '';
}

// ── PHASE 6-D: 가상 창문 & 날씨 로직 ───────────────────────
function toggleRain() {
    state.isRainy = !state.isRainy;
    
    // UI 업데이트
    document.body.classList.toggle('is-rainy', state.isRainy);
    document.querySelectorAll('.weather-window-item').forEach(el => {
        el.classList.toggle('rainy', state.isRainy);
    });

    // 오디오 자동화
    if (state.isRainy) {
        ambRainVol.value = 60;
        audioRain.volume = 0.6;
        if (audioRain.paused) audioRain.play().catch(e => console.log('Audio restricted', e));
        showToast('비가 오기 시작하네요. 집중하기 좋은 시간이에요. 🌧️', 'info');
    } else {
        ambRainVol.value = 0;
        audioRain.volume = 0;
        showToast('비가 그쳤습니다. ☀️', 'info');
    }
}

// ── PHASE 6: 포모도로 타이머 로직 ───────────────────────
let timerInterval = null;
let timerSeconds = 25 * 60; // 25분
const TIMER_DEFAULT = 25 * 60;

timerFab.addEventListener('click', () => {
    timerPanel.classList.toggle('active');
});
timerCloseBtn.addEventListener('click', () => {
    timerPanel.classList.remove('active');
});

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timerSeconds);
    // 탭 타이틀 업데이트
    if (timerInterval) document.title = `[${formatTime(timerSeconds)}] Desk Studio`;
    else document.title = `Desk Studio 🌸 나만의 공간`;
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerPlayIcon.className = 'fas fa-play';
    timerPanel.classList.remove('running');
    updateTimerDisplay();
}

timerPlayBtn.addEventListener('click', () => {
    if (timerInterval) {
        // 일시정지
        stopTimer();
    } else {
        // 시작
        timerPlayIcon.className = 'fas fa-pause';
        timerPanel.classList.add('running');
        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();
            
            if (timerSeconds <= 0) {
                // 종료 및 보상 지급
                stopTimer();
                timerSeconds = TIMER_DEFAULT;
                updateTimerDisplay();
                
                state.focusCoins++;
                saveToLocal();
                updateGachaStatus();
                
                showToast('🎉 집중 성공! 포커스 코인 1개를 획득했습니다!', 'success');
                // 알림 효과음 (선택)
                const ding = new Audio('https://soundbible.com/mp3/Glass_Ping-Go445-1207030150.mp3');
                ding.volume = 0.5;
                ding.play().catch(e=>console.log('Audio restricted', e));
                
                // 일일 챌린지 갱신용 (강제 1 추가)
                if (state.dailyChallenge.progress < state.dailyChallenge.target) {
                    state.dailyChallenge.progress++;
                    saveDailyChallenge();
                    updateChallengeUI();
                }
            }
        }, 1000);
    }
});

timerResetBtn.addEventListener('click', () => {
    stopTimer();
    timerSeconds = TIMER_DEFAULT;
    updateTimerDisplay();
});

// 초기화
updateTimerDisplay();

// ── V4+ Features: 데스크 펫 시스템 (감정 & 먹기) ──────────────────
function initPetBehavior(el) {
    if (el.dataset.initialized) return;
    el.dataset.initialized = "true";
    state.pets.push(el);

    // 펫 데이터 찾기
    const petCfg = Object.values(itemsConfig).flat().find(i => i.image === el.dataset.content);
    if (!petCfg) return;

    // 말풍선 DOM 추가
    const bubble = document.createElement('div');
    bubble.className = 'pet-thought-bubble';
    el.appendChild(bubble);

    let currentMood = 'idle';
    let isEating = false;

    const setExpression = (mood) => {
        if (!petCfg.expressions) return;
        const img = el.querySelector('img');
        const src = petCfg.expressions[mood] || petCfg.expressions.idle || petCfg.image;
        if (img.src !== src) img.src = src;
        currentMood = mood;
    };

    const showThought = (emoji, duration = 2000) => {
        bubble.textContent = emoji;
        bubble.classList.add('active');
        setTimeout(() => bubble.classList.remove('active'), duration);
    };

    el.addEventListener('click', (e) => {
        if (state.clickPlaceMode || isEating) return;
        setExpression('happy');
        spawnPetHeart(el, e.clientX, e.clientY);
        showThought('❤️');
        setTimeout(() => setExpression('idle'), 3000);
    });

    // 자율 행동 루프
    const behaviorLoop = () => {
        if (!document.body.contains(el)) return;
        if (isEating) return; // 먹는 중엔 이동 안 함

        const rand = Math.random();

        // 1. 먹이 찾기 (주변 50px 이내)
        const food = findNearbyFood(el);
        if (food) {
            startEating(el, food);
            return;
        }

        // 2. 랜덤 행동
        if (rand < 0.6) {
            // 이동
            const rect = deskSurface.getBoundingClientRect();
            const size = parseInt(el.dataset.size || 72);
            const newX = Math.random() * (rect.width - size);
            const newY = Math.random() * (rect.height - size);
            
            const currentX = parseFloat(el.style.left);
            el.style.transform = newX < currentX ? 'scaleX(-1)' : 'scaleX(1)';
            el.style.left = `${newX}px`;
            el.style.top = `${newY}px`;
            
            setExpression('idle');
        } else if (rand < 0.8) {
            // 생각하기 / 말풍선
            const fav = petCfg.favorites[Math.floor(Math.random() * petCfg.favorites.length)];
            showThought(fav);
        } else {
            // 낮잠 자기
            setExpression('sleepy');
            el.classList.add('sleeping');
            setTimeout(() => {
                el.classList.remove('sleeping');
                setExpression('idle');
            }, 6000);
        }

        setTimeout(behaviorLoop, 4000 + Math.random() * 4000);
    };

    const startEating = (pet, food) => {
        isEating = true;
        pet.classList.add('eating');
        setExpression('happy');
        showThought('😋');
        
        // 먹이 쪽으로 위치 미세 조정
        pet.style.left = food.style.left;
        pet.style.top = food.style.top;

        food.classList.add('shrinking');
        
        setTimeout(() => {
            pet.classList.remove('eating');
            setExpression('happy');
            showThought('✨');
            
            // 먹이 삭제
            food.remove();
            
            // 전역 상태에서도 삭제
            const foodId = food.id;
            state.placedItems = state.placedItems.filter(i => i.id !== foodId);
            updateStats();
            saveToLocal();

            setTimeout(() => {
                isEating = false;
                setExpression('idle');
                behaviorLoop();
            }, 2000);
        }, 1500);
    };

    setTimeout(behaviorLoop, 2000);
}

function findNearbyFood(petEl) {
    const px = parseFloat(petEl.style.left);
    const py = parseFloat(petEl.style.top);
    const allItems = document.querySelectorAll('.placed-item:not(.is-pet)');
    
    for (const item of allItems) {
        const itemCfg = Object.values(itemsConfig).flat().find(i => i.image === item.dataset.content);
        if (itemCfg && itemCfg.isFood) {
            const ix = parseFloat(item.style.left);
            const iy = parseFloat(item.style.top);
            const dist = Math.sqrt(Math.pow(px - ix, 2) + Math.pow(py - iy, 2));
            if (dist < 100) return item; // 감지 범위 100px
        }
    }
    return null;
}

function spawnPetHeart(el, x, y) {
    const heart = document.createElement('div');
    heart.className = 'pet-heart';
    heart.textContent = '❤️';
    heart.style.left = `${x - 10}px`;
    heart.style.top = `${y - 10}px`;
    document.body.appendChild(heart);
    
    // 점프 모션
    el.style.transform += ' translateY(-15px) scale(1.1)';
    setTimeout(() => {
        const currentScale = el.style.transform.includes('scaleX(-1)') ? 'scaleX(-1)' : 'scaleX(1)';
        el.style.transform = currentScale;
    }, 300);

    setTimeout(() => heart.remove(), 1000);
}

// 기존 init 수정하여 V4 상태 로드 추가
const originalInit = window.onload;
window.onload = () => {
    if (typeof originalInit === 'function') originalInit();
    loadV4State();
    
    // 책상 위 기존 펫들 초기화
    document.querySelectorAll('.placed-item.is-pet').forEach(initPetBehavior);
};
