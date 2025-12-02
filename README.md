# 🌸 나만의 책상 꾸미기 게임

일본 시티팝 감성의 감성적인 책상 꾸미기 게임입니다.

## 🎮 플레이하기

**👉 [지금 바로 플레이하기!](https://juhee77.github.io/desk-decorator/)**

[![Desk Decorator](https://img.shields.io/badge/Play-Desk%20Decorator-FF69B4?style=for-the-badge&logo=github)](https://juhee77.github.io/desk-decorator/)

---

## ✨ 기능

- 드래그 앤 드롭으로 아이템 배치
- 랜덤 배치 기능
- 스크린샷 저장
- 키보드 단축키 지원

## 🎨 고퀄리티 이미지로 교체하는 방법

현재는 이모지를 사용하고 있지만, 실제 고퀄리티 PNG 이미지로 쉽게 교체할 수 있습니다.

### 1단계: 이미지 준비

`/images` 폴더를 만들고 아래 이름으로 PNG 이미지를 저장하세요:

**학용품 (study)**
- `laptop.png` - 노트북
- `book.png` - 책
- `notebook.png` - 노트
- `pencil.png` - 연필
- `pen.png` - 펜
- `ruler.png` - 자

**식물 & 장식 (plants)**
- `plant1.png` - 새싹
- `plant2.png` - 잎사귀
- `cactus.png` - 선인장
- `flower.png` - 꽃
- `lamp.png` - 램프
- `candle.png` - 양초

**음료 & 간식 (drinks)**
- `coffee.png` - 커피
- `tea.png` - 차
- `juice.png` - 주스
- `cookie.png` - 쿠키
- `cake.png` - 케이크
- `donut.png` - 도넛

**취미 & 기타 (hobby)**
- `camera.png` - 카메라
- `headphone.png` - 헤드폰
- `game.png` - 게임
- `art.png` - 미술
- `clock.png` - 시계
- `photo.png` - 사진

### 2단계: items-config.js 수정

`items-config.js` 파일에서 각 아이템의 설정을 변경하세요:

```javascript
{
    id: 'laptop',
    name: '노트북',
    image: './images/laptop.png',  // 이미지 경로로 변경
    type: 'url'  // 'emoji'에서 'url'로 변경
}
```

### 추천 이미지 소스

1. **Flaticon** (https://www.flaticon.com)
   - 무료 PNG 아이콘
   - 시티팝/파스텔 스타일 검색

2. **Freepik** (https://www.freepik.com)
   - 고퀄리티 일러스트
   - "kawaii", "pastel", "city pop" 검색

3. **Canva** (https://www.canva.com)
   - 직접 디자인 가능
   - 파스텔 톤 템플릿

### 이미지 권장 사양

- **크기**: 512x512px 또는 1024x1024px
- **포맷**: PNG (투명 배경)
- **스타일**: 파스텔 톤, 시티팝 감성
- **배경**: 투명 또는 흰색

## 🎮 사용법

1. 왼쪽 팔레트에서 아이템을 드래그
2. 책상 위에 드롭하여 배치
3. 배치된 아이템을 드래그하여 위치 조정
4. 더블클릭으로 개별 아이템 삭제

## ⌨️ 키보드 단축키

- `Cmd/Ctrl + S`: 스크린샷 저장
- `Cmd/Ctrl + D`: 전체 삭제
- `Cmd/Ctrl + R`: 랜덤 배치

## 🎨 커스터마이징

`style.css`의 `:root` 섹션에서 색상을 변경할 수 있습니다:

```css
:root {
    --accent-pink: #FFB7D5;
    --accent-purple: #C9A0DC;
    --accent-blue: #A8D8EA;
    /* ... */
}
```
