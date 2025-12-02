// 아이템 설정 - 여기서 이미지 URL을 쉽게 변경할 수 있습니다
const itemsConfig = {
    study: [
        {
            id: 'laptop',
            name: '노트북',
            // 임시로 이모지 사용, 나중에 실제 이미지 URL로 교체 가능
            image: '💻',
            type: 'emoji' // 'emoji' 또는 'url'
        },
        {
            id: 'book',
            name: '책',
            image: '📚',
            type: 'emoji'
        },
        {
            id: 'notebook',
            name: '노트',
            image: '📓',
            type: 'emoji'
        },
        {
            id: 'pencil',
            name: '연필',
            image: '✏️',
            type: 'emoji'
        },
        {
            id: 'pen',
            name: '펜',
            image: '🖊️',
            type: 'emoji'
        },
        {
            id: 'ruler',
            name: '자',
            image: '📏',
            type: 'emoji'
        }
    ],
    plants: [
        {
            id: 'plant1',
            name: '새싹',
            image: '🌱',
            type: 'emoji'
        },
        {
            id: 'plant2',
            name: '잎사귀',
            image: '🌿',
            type: 'emoji'
        },
        {
            id: 'cactus',
            name: '선인장',
            image: '🌵',
            type: 'emoji'
        },
        {
            id: 'flower',
            name: '꽃',
            image: '🌸',
            type: 'emoji'
        },
        {
            id: 'lamp',
            name: '램프',
            image: '💡',
            type: 'emoji'
        },
        {
            id: 'candle',
            name: '양초',
            image: '🕯️',
            type: 'emoji'
        }
    ],
    drinks: [
        {
            id: 'coffee',
            name: '커피',
            image: '☕',
            type: 'emoji'
        },
        {
            id: 'tea',
            name: '차',
            image: '🍵',
            type: 'emoji'
        },
        {
            id: 'juice',
            name: '주스',
            image: '🧃',
            type: 'emoji'
        },
        {
            id: 'cookie',
            name: '쿠키',
            image: '🍪',
            type: 'emoji'
        },
        {
            id: 'cake',
            name: '케이크',
            image: '🍰',
            type: 'emoji'
        },
        {
            id: 'donut',
            name: '도넛',
            image: '🍩',
            type: 'emoji'
        }
    ],
    hobby: [
        {
            id: 'camera',
            name: '카메라',
            image: '📷',
            type: 'emoji'
        },
        {
            id: 'headphone',
            name: '헤드폰',
            image: '🎧',
            type: 'emoji'
        },
        {
            id: 'game',
            name: '게임',
            image: '🎮',
            type: 'emoji'
        },
        {
            id: 'art',
            name: '미술',
            image: '🎨',
            type: 'emoji'
        },
        {
            id: 'clock',
            name: '시계',
            image: '⏰',
            type: 'emoji'
        },
        {
            id: 'photo',
            name: '사진',
            image: '🖼️',
            type: 'emoji'
        }
    ]
};

// 이미지 URL 예시 (나중에 실제 이미지로 교체)
// {
//     id: 'laptop',
//     name: '노트북',
//     image: 'https://example.com/images/laptop.png',
//     type: 'url'
// }
