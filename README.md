# 🌸 Desk Studio (나만의 데스크 & 집중 공간)

Desk Studio는 단순히 책상을 꾸미는 게임을 넘어, **자신만의 감성적인 아날로그 책상을 세팅해 두고 잔잔한 로파이(Lo-Fi)와 앰비언트(백색소음) 사운드를 들으며 학업이나 업무에 집중할 수 있도록 돕는 '집중 파트너 플랫폼'**입니다. 완성된 나만의 완벽한 워크스페이스를 다른 사람들과 공유해 보세요!

## 🎧 핵심 기능 (Core Features)

1. **감성적인 데스크테리어 (Deskterior)**
   - 다양한 파스텔, 시티팝 감성의 오브제, 플랫 디자인 벡터 에셋(SVG)을 활용한 자유로운 배치
   - 나만의 책상을 완성한 뒤 캡처하여 친구들이나 SNS에 공유
2. **포커스 믹서 (Ambient Sound Mixer)**
   - 빗소리, 모닥불 타는 소리, 타자기 소리, 로파이 배경 음악 등 환경음 볼륨을 개별로 조절해 나만의 집중용 '백색소음 기기'로 사용
3. **인터랙티브 데스크 펫 (Interactive Pets)**
   - 단순한 장식이 아닌, 사용자의 작업을 응원해 주고 함께 노는 펫(고양이, 강아지, 토끼 등)
   - 먹이를 주거나 쓰다듬어 주며 소소한 리프레쉬 제공
4. **시간 연동 오토 테마 (Time-Synced Theme)**
   - 현실 시간과 연동되어 아침(바다), 저녁(노을), 밤(은하수)에 맞춰 책상 배경이 자동으로 변환
5. **데일리 힐링 가챠 (Daily Gacha)**
   - 매일 출석해 오늘의 캡슐을 열고 새로운 데스크 장식을 모아가는 재미 (포모도로 보상으로 활용 가능)

## 🎮 플레이 및 체험하기

**👉 [지금 바로 집중 모드 켜기!](https://juhee77.github.io/desk-decorator/)**

[![Desk Decorator](https://img.shields.io/badge/Play-Desk%20Studio-A29BFE?style=for-the-badge&logo=github)](https://juhee77.github.io/desk-decorator/)

---

## ⌨️ 키보드 단축키 및 컨트롤

- **아이템 더블클릭:** 배치된 아이템을 삭제합니다.
- **아이템 드래그 & 클릭 배치:** 상단 팔레트에서 아이템을 책상 위로 끌고와 원하는 위치에 배치하세요.
- **`Cmd/Ctrl + S`:** 책상 스크린샷 저장 (친구들과 공유해 보세요!)
- **`Cmd/Ctrl + D`:** 전체 지우기 (책상을 새롭게 정리합니다.)

## 🛠 기능 확장 및 커스터마이징 (개발)

본 프로젝트는 고품질의 플랫 SVG 및 Iconify 에셋을 적극 사용 중입니다. 새로운 펫이나, 자신이 좋아하는 간식을 `assets/svg/` 폴더 내에 Vector 그래픽으로 작성해 언제든 덧붙일 수 있습니다.

```javascript
/* items-config.js 에서 쉽게 아이템 추가하기 */
{
    id: 'my-favorite-item',
    name: '내 최애 텀블러',
    image: './assets/svg/items/tumbler.svg',
    type: 'url'
}
```

## 📜 라이선스 및 에셋 출처
- 백색소음 및 배경 음악 출처: [SoundBible](https://soundbible.com) 등 무료 에셋
- 프로젝트 내 SVG 에셋은 자체 제작 및 가공된 소스입니다.
