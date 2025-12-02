// 게임 상태 관리
const gameState = {
    placedItems: [],
    itemCount: 0
};

// DOM 요소
const deskSurface = document.querySelector('.desk-surface');
const itemCountDisplay = document.getElementById('itemCount');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const randomBtn = document.getElementById('randomBtn');
const paletteItems = document.querySelectorAll('.item');

// 드래그 앤 드롭 이벤트 설정
let draggedElement = null;
let draggedContent = null;
let draggedType = null;
let draggedColor = null;

// 팔레트 아이템 드래그 시작
paletteItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        draggedContent = e.target.getAttribute('data-content');
        draggedType = e.target.getAttribute('data-type');
        draggedColor = e.target.getAttribute('data-color');

        e.dataTransfer.effectAllowed = 'copy';
        e.target.style.opacity = '0.5';
    });

    item.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
    });
});

// 책상 위 드롭 영역 설정
deskSurface.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

deskSurface.addEventListener('drop', (e) => {
    e.preventDefault();

    if (draggedContent) {
        const rect = deskSurface.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        placeItem(draggedContent, draggedType, draggedColor, x, y);
        draggedContent = null;
        draggedType = null;
        draggedColor = null;
    }
});

// 아이템 배치 함수
function placeItem(content, type, color, x, y) {
    const item = document.createElement('div');
    item.className = 'placed-item';
    item.style.left = `${x - 25}px`;
    item.style.top = `${y - 25}px`;

    // 타입에 따라 다르게 렌더링
    if (type === 'url') {
        // 이미지 URL인 경우
        const img = document.createElement('img');
        img.src = content;
        img.className = 'item-image';
        img.alt = 'desk item';
        item.appendChild(img);
    } else {
        // 이모지인 경우
        const span = document.createElement('span');
        span.className = 'item-content';
        span.textContent = content;
        if (color) {
            span.style.color = color;
        }
        item.appendChild(span);
    }

    // 데이터 속성 저장
    item.setAttribute('data-content', content);
    item.setAttribute('data-type', type);
    item.setAttribute('data-color', color);

    // 드래그 가능하게 설정
    item.draggable = true;

    // 배치된 아이템 드래그 이벤트
    item.addEventListener('dragstart', (e) => {
        draggedElement = item;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            item.style.opacity = '0.5';
        }, 0);
    });

    item.addEventListener('dragend', (e) => {
        item.style.opacity = '1';
        draggedElement = null;
    });

    // 더블클릭으로 삭제
    item.addEventListener('dblclick', () => {
        item.style.animation = 'placeItem 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse';
        setTimeout(() => {
            item.remove();
            updateItemCount();
        }, 300);
    });

    deskSurface.appendChild(item);
    updateItemCount();
    updateDeskHint();
}

// 배치된 아이템을 책상 위에서 이동
deskSurface.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (draggedElement) {
        e.dataTransfer.dropEffect = 'move';
    }
});

deskSurface.addEventListener('drop', (e) => {
    e.preventDefault();

    if (draggedElement) {
        const rect = deskSurface.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        draggedElement.style.left = `${x - 25}px`;
        draggedElement.style.top = `${y - 25}px`;
    }
});

// 아이템 개수 업데이트
function updateItemCount() {
    const count = deskSurface.querySelectorAll('.placed-item').length;
    itemCountDisplay.textContent = count;

    // 숫자 변경 애니메이션
    itemCountDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
        itemCountDisplay.style.transform = 'scale(1)';
    }, 200);
}

// 힌트 표시/숨김
function updateDeskHint() {
    const hasItems = deskSurface.querySelectorAll('.placed-item').length > 0;
    if (hasItems) {
        deskSurface.classList.add('has-items');
    } else {
        deskSurface.classList.remove('has-items');
    }
}

// 전체 삭제 버튼
clearBtn.addEventListener('click', () => {
    if (confirm('모든 아이템을 삭제하시겠습니까?')) {
        const items = deskSurface.querySelectorAll('.placed-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'placeItem 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse';
                setTimeout(() => {
                    item.remove();
                    updateItemCount();
                    updateDeskHint();
                }, 300);
            }, index * 50);
        });
    }
});

// 스크린샷 저장 버튼
saveBtn.addEventListener('click', async () => {
    try {
        // 힌트 임시 숨김
        const hint = document.querySelector('.desk-hint');
        const originalDisplay = hint.style.display;
        hint.style.display = 'none';

        // html2canvas 라이브러리 동적 로드
        if (typeof html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            document.head.appendChild(script);

            await new Promise((resolve) => {
                script.onload = resolve;
            });
        }

        // 스크린샷 생성
        const canvas = await html2canvas(deskSurface, {
            backgroundColor: null,
            scale: 2
        });

        // 이미지 다운로드
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = `my-desk-${timestamp}.png`;
        link.href = canvas.toDataURL();
        link.click();

        // 힌트 복원
        hint.style.display = originalDisplay;

        // 성공 피드백
        saveBtn.textContent = '✅ 저장 완료!';
        setTimeout(() => {
            saveBtn.innerHTML = '<span>📸</span>스크린샷 저장';
        }, 2000);

    } catch (error) {
        console.error('스크린샷 저장 실패:', error);
        alert('스크린샷 저장에 실패했습니다. 다시 시도해주세요.');
    }
});

// 랜덤 배치 버튼
randomBtn.addEventListener('click', () => {
    // 기존 아이템 삭제
    const existingItems = deskSurface.querySelectorAll('.placed-item');
    existingItems.forEach(item => item.remove());

    // 모든 아이템 데이터 수집
    const allItems = Array.from(paletteItems).map(item => ({
        content: item.getAttribute('data-content'),
        type: item.getAttribute('data-type'),
        color: item.getAttribute('data-color')
    }));

    // 랜덤하게 10-15개 아이템 배치
    const itemCount = Math.floor(Math.random() * 6) + 10;
    const rect = deskSurface.getBoundingClientRect();

    for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
            const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
            const x = Math.random() * (rect.width - 100) + 50;
            const y = Math.random() * (rect.height - 100) + 50;
            placeItem(randomItem.content, randomItem.type, randomItem.color, x, y);
        }, i * 100);
    }
});

// 초기화
updateDeskHint();

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S: 스크린샷 저장
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveBtn.click();
    }

    // Ctrl/Cmd + D: 전체 삭제
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        clearBtn.click();
    }

    // Ctrl/Cmd + R: 랜덤 배치
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        randomBtn.click();
    }
});

// 환영 애니메이션
window.addEventListener('load', () => {
    console.log('🌸 책상 꾸미기 게임에 오신 것을 환영합니다!');
    console.log('💡 팁: 더블클릭으로 아이템을 삭제할 수 있습니다.');
    console.log('⌨️  단축키: Ctrl/Cmd + S (저장), D (삭제), R (랜덤)');
});
