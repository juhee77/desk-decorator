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
            id: 'window',
            name: '가상 창문',
            image: `./assets/svg/items/window.svg`,
            type: 'url',
            color: '#afb8d0',
            isWeatherWindow: true
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
            image: `./assets/svg/items/coffee.svg`,
            type: 'url',
            color: '#a0522d',
            isFood: true
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
            color: '#ff9ff3',
            isFood: true
        },
        {
            id: 'cookie',
            name: '쿠키',
            image: `${ICONIFY_BASE}/cookie.svg`,
            type: 'url',
            color: '#d4a574',
            isFood: true
        },
        {
            id: 'shortcake',
            name: '케이크',
            image: `${ICONIFY_BASE}/shortcake.svg`,
            type: 'url',
            color: '#ffa8b8',
            isFood: true
        },
        {
            id: 'donut',
            name: '도넛',
            image: `./assets/svg/items/donut.svg`,
            type: 'url',
            color: '#ff6348',
            isFood: true
        },
        {
            id: 'candy',
            name: '사탕',
            image: `${ICONIFY_BASE}/candy.svg`,
            type: 'url',
            color: '#ff6b9d',
            isFood: true
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
            id: 'cassette',
            name: '빈티지 카세트',
            image: `./assets/svg/items/cassette.svg`,
            type: 'url',
            color: '#4a3a5e',
            isMusicPlayer: true
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
    ],
    pets: [
        {
            id: 'cat',
            name: '치즈 고양이',
            image: `./assets/svg/pets/cat-idle.svg`,
            type: 'url',
            color: '#ffa07a',
            isPet: true,
            favorites: ['🧶', '🐟', '🐾', '🥤'],
            expressions: {
                idle: `./assets/svg/pets/cat-idle.svg`,
                happy: `./assets/svg/pets/cat-happy.svg`,
                sleepy: `./assets/svg/pets/cat-sleepy.svg`
            }
        },
        {
            id: 'dog',
            name: '퍼피',
            image: `./assets/svg/pets/dog-idle.svg`,
            type: 'url',
            color: '#d4a574',
            isPet: true,
            favorites: ['🦴', '🎾', '🏃', '🚿'],
            expressions: {
                idle: `./assets/svg/pets/dog-idle.svg`,
                happy: `./assets/svg/pets/dog-idle.svg`,
                sleepy: `./assets/svg/pets/dog-idle.svg`
            }
        },
        {
            id: 'rabbit',
            name: '토끼',
            image: `./assets/svg/pets/rabbit-idle.svg`,
            type: 'url',
            color: '#f8c291',
            isPet: true,
            favorites: ['🥕', '🥬', '✨'],
            expressions: {
                idle: `./assets/svg/pets/rabbit-idle.svg`,
                happy: `./assets/svg/pets/rabbit-idle.svg`,
                sleepy: `./assets/svg/pets/rabbit-idle.svg`
            }
        },
        {
            id: 'parrot',
            name: '앵무새',
            image: `./assets/svg/pets/parrot-idle.svg`,
            type: 'url',
            color: '#4ecdc4',
            isPet: true,
            favorites: ['🥜', '🌈', '🎶'],
            expressions: {
                idle: `./assets/svg/pets/parrot-idle.svg`,
                happy: `./assets/svg/pets/parrot-idle.svg`,
                sleepy: `./assets/svg/pets/parrot-idle.svg`
            }
        },
        {
            id: 'bear',
            name: '곰돌이',
            image: `./assets/svg/pets/bear-idle.svg`,
            type: 'url',
            color: '#a0522d',
            isPet: true,
            favorites: ['🍯', '🍎', '🐟'],
            expressions: {
                idle: `./assets/svg/pets/bear-idle.svg`,
                happy: `./assets/svg/pets/bear-idle.svg`,
                sleepy: `./assets/svg/pets/bear-idle.svg`
            }
        },
        {
            id: 'penguin',
            name: '펭귄',
            image: `./assets/svg/pets/penguin-idle.svg`,
            type: 'url',
            color: '#74b9ff',
            isPet: true,
            favorites: ['🐟', '❄️', '🦑'],
            expressions: {
                idle: `./assets/svg/pets/penguin-idle.svg`,
                happy: `./assets/svg/pets/penguin-idle.svg`,
                sleepy: `./assets/svg/pets/penguin-idle.svg`
            }
        }
    ],
    memo: [
        {
            id: 'note-yellow',
            name: '노랑 포스트잇',
            image: './assets/svg/items/note-yellow.svg',
            type: 'url',
            color: '#fff9c4',
            isNote: true
        },
        {
            id: 'note-pink',
            name: '핑크 포스트잇',
            image: './assets/svg/items/note-pink.svg',
            type: 'url',
            color: '#f8bbd0',
            isNote: true
        },
        {
            id: 'note-green',
            name: '연두 포스트잇',
            image: './assets/svg/items/note-green.svg',
            type: 'url',
            color: '#c8e6c9',
            isNote: true
        }
    ],
    collection: [
        {
            id: 'diamond',
            name: '다이아몬드',
            image: `${ICONIFY_BASE}/gem-stone.svg`,
            type: 'url',
            color: '#74b9ff',
            isLocked: true
        },
        {
            id: 'trophy',
            name: '황금 트로피',
            image: `${ICONIFY_BASE}/trophy.svg`,
            type: 'url',
            color: '#ffd93d',
            isLocked: true
        },
        {
            id: 'crown',
            name: '왕관',
            image: `${ICONIFY_BASE}/crown.svg`,
            type: 'url',
            color: '#ffd93d',
            isLocked: true
        },
        {
            id: 'magic-wand',
            name: '마법 지팡이',
            image: `${ICONIFY_BASE}/magic-wand.svg`,
            type: 'url',
            color: '#9d4edd',
            isLocked: true
        },
        {
            id: 'rocket',
            name: '우주선',
            image: `${ICONIFY_BASE}/rocket.svg`,
            type: 'url',
            color: '#ff6b6b',
            isLocked: true
        },
        {
            id: 'unicorn',
            name: '유니콘',
            image: `${ICONIFY_BASE}/unicorn.svg`,
            type: 'url',
            color: '#ff9ff3',
            isLocked: true
        }
    ]
};
