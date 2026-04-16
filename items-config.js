// 아이템 설정 — Iconify Fluent Emoji Flat 아이콘 사용
// https://icon.icssify.design/{collection}/{icon}.svg 형식
const ICONIFY_BASE = 'https://api.iconify.design/fluent-emoji-flat';

const itemsConfig = {
    study: [
        {
            id: 'laptop',
            name: '노트북',
            image: `${ICONIFY_BASE}/laptop.svg`,
            type: 'url',
            color: '#6c63ff'
        },
        {
            id: 'books',
            name: '책',
            image: `${ICONIFY_BASE}/books.svg`,
            type: 'url',
            color: '#ff6b9d'
        },
        {
            id: 'notebook',
            name: '노트',
            image: `${ICONIFY_BASE}/notebook-with-decorative-cover.svg`,
            type: 'url',
            color: '#ffa07a'
        },
        {
            id: 'pencil',
            name: '연필',
            image: `${ICONIFY_BASE}/pencil.svg`,
            type: 'url',
            color: '#ffd93d'
        },
        {
            id: 'pen',
            name: '펜',
            image: `${ICONIFY_BASE}/fountain-pen.svg`,
            type: 'url',
            color: '#4ecdc4'
        },
        {
            id: 'ruler',
            name: '자',
            image: `${ICONIFY_BASE}/straight-ruler.svg`,
            type: 'url',
            color: '#95e1d3'
        },
        {
            id: 'magnifier',
            name: '돋보기',
            image: `${ICONIFY_BASE}/magnifying-glass-tilted-left.svg`,
            type: 'url',
            color: '#a29bfe'
        },
        {
            id: 'scissors',
            name: '가위',
            image: `${ICONIFY_BASE}/scissors.svg`,
            type: 'url',
            color: '#fd79a8'
        }
    ],
    plants: [
        {
            id: 'seedling',
            name: '새싹',
            image: `${ICONIFY_BASE}/seedling.svg`,
            type: 'url',
            color: '#7bed9f'
        },
        {
            id: 'herb',
            name: '잎사귀',
            image: `${ICONIFY_BASE}/herb.svg`,
            type: 'url',
            color: '#2ed573'
        },
        {
            id: 'cactus',
            name: '선인장',
            image: `${ICONIFY_BASE}/cactus.svg`,
            type: 'url',
            color: '#26de81'
        },
        {
            id: 'cherry-blossom',
            name: '벚꽃',
            image: `${ICONIFY_BASE}/cherry-blossom.svg`,
            type: 'url',
            color: '#ff6b9d'
        },
        {
            id: 'potted-plant',
            name: '화분',
            image: `${ICONIFY_BASE}/potted-plant.svg`,
            type: 'url',
            color: '#00b894'
        },
        {
            id: 'sunflower',
            name: '해바라기',
            image: `${ICONIFY_BASE}/sunflower.svg`,
            type: 'url',
            color: '#fdcb6e'
        },
        {
            id: 'tulip',
            name: '튤립',
            image: `${ICONIFY_BASE}/tulip.svg`,
            type: 'url',
            color: '#fd79a8'
        },
        {
            id: 'four-leaf-clover',
            name: '네잎클로버',
            image: `${ICONIFY_BASE}/four-leaf-clover.svg`,
            type: 'url',
            color: '#55efc4'
        }
    ],
    deco: [
        {
            id: 'candle',
            name: '양초',
            image: `${ICONIFY_BASE}/candle.svg`,
            type: 'url',
            color: '#fdcb6e'
        },
        {
            id: 'lamp',
            name: '데스크 램프',
            image: `${ICONIFY_BASE}/light-bulb.svg`,
            type: 'url',
            color: '#ffeaa7'
        },
        {
            id: 'crystal-ball',
            name: '크리스탈볼',
            image: `${ICONIFY_BASE}/crystal-ball.svg`,
            type: 'url',
            color: '#a29bfe'
        },
        {
            id: 'teddy-bear',
            name: '테디베어',
            image: `${ICONIFY_BASE}/teddy-bear.svg`,
            type: 'url',
            color: '#d4a574'
        },
        {
            id: 'mirror',
            name: '거울',
            image: `${ICONIFY_BASE}/mirror.svg`,
            type: 'url',
            color: '#b2bec3'
        },
        {
            id: 'sparkles',
            name: '반짝이',
            image: `${ICONIFY_BASE}/sparkles.svg`,
            type: 'url',
            color: '#fdcb6e'
        },
        {
            id: 'ribbon',
            name: '리본',
            image: `${ICONIFY_BASE}/ribbon.svg`,
            type: 'url',
            color: '#fd79a8'
        },
        {
            id: 'star',
            name: '별',
            image: `${ICONIFY_BASE}/star.svg`,
            type: 'url',
            color: '#fdcb6e'
        }
    ],
    drinks: [
        {
            id: 'coffee',
            name: '커피',
            image: `${ICONIFY_BASE}/hot-beverage.svg`,
            type: 'url',
            color: '#a0522d'
        },
        {
            id: 'tea',
            name: '녹차',
            image: `${ICONIFY_BASE}/teacup-without-handle.svg`,
            type: 'url',
            color: '#7bed9f'
        },
        {
            id: 'bubble-tea',
            name: '버블티',
            image: `${ICONIFY_BASE}/bubble-tea.svg`,
            type: 'url',
            color: '#fd79a8'
        },
        {
            id: 'beverage-box',
            name: '음료',
            image: `${ICONIFY_BASE}/beverage-box.svg`,
            type: 'url',
            color: '#ff9ff3'
        },
        {
            id: 'cookie',
            name: '쿠키',
            image: `${ICONIFY_BASE}/cookie.svg`,
            type: 'url',
            color: '#d4a574'
        },
        {
            id: 'shortcake',
            name: '케이크',
            image: `${ICONIFY_BASE}/shortcake.svg`,
            type: 'url',
            color: '#ffa8b8'
        },
        {
            id: 'donut',
            name: '도넛',
            image: `${ICONIFY_BASE}/doughnut.svg`,
            type: 'url',
            color: '#ff6348'
        },
        {
            id: 'candy',
            name: '사탕',
            image: `${ICONIFY_BASE}/candy.svg`,
            type: 'url',
            color: '#ff6b9d'
        }
    ],
    hobby: [
        {
            id: 'camera',
            name: '카메라',
            image: `${ICONIFY_BASE}/camera.svg`,
            type: 'url',
            color: '#535c68'
        },
        {
            id: 'headphone',
            name: '헤드폰',
            image: `${ICONIFY_BASE}/headphone.svg`,
            type: 'url',
            color: '#9d4edd'
        },
        {
            id: 'game',
            name: '게임',
            image: `${ICONIFY_BASE}/video-game.svg`,
            type: 'url',
            color: '#6c5ce7'
        },
        {
            id: 'palette',
            name: '팔레트',
            image: `${ICONIFY_BASE}/artist-palette.svg`,
            type: 'url',
            color: '#ff6b9d'
        },
        {
            id: 'musical-note',
            name: '음악',
            image: `${ICONIFY_BASE}/musical-note.svg`,
            type: 'url',
            color: '#a29bfe'
        },
        {
            id: 'yarn',
            name: '실타래',
            image: `${ICONIFY_BASE}/yarn.svg`,
            type: 'url',
            color: '#fd79a8'
        },
        {
            id: 'film-frames',
            name: '필름',
            image: `${ICONIFY_BASE}/film-frames.svg`,
            type: 'url',
            color: '#2d3436'
        },
        {
            id: 'globe',
            name: '지구본',
            image: `${ICONIFY_BASE}/globe-showing-asia-australia.svg`,
            type: 'url',
            color: '#74b9ff'
        }
    ]
};
