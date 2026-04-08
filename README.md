# 카페 메뉴북 제작소

카페 사장님이 메뉴 사진·설명을 입력하면 **실제 인쇄 가능한 메뉴북**을 자동 생성해주는 서비스.  
Sweetbook Book Print API를 활용해 제작부터 배송 주문까지 한 번에 처리합니다.

## 서비스 소개

| 항목 | 내용 |
|------|------|
| **서비스** | 메뉴 사진과 정보를 입력하면 인쇄 가능한 메뉴북을 만들어주는 웹 서비스 |
| **대상** | 메뉴판을 직접 만들고 싶은 카페 사장님 |
| **특징** | 디자인 툴 없이도 누구나 쓸 수 있게 단계별로 구성 |

### 주요 기능

- 카페 정보(이름, 슬로건, 로고) 입력
- 카테고리별 메뉴 등록 (사진, 이름, 설명, 가격)
- 샘플 메뉴 더미 데이터 즉시 불러오기
- 북 스펙(크기·제본) 선택
- Sweetbook API로 메뉴북 자동 생성 (표지 + 내지)
- 인쇄 수량·배송지 입력 후 주문
- 주문 내역 조회 및 취소

---

## 실행 방법

### 사전 준비

- Node.js 18 이상
- [api.sweetbook.com](https://api.sweetbook.com) 가입 후 Sandbox API Key 발급

### 설치

```bash
# 프로젝트 루트에서
cd server && npm install
cd ../client && npm install
```

### 환경변수 설정

```bash
# 프로젝트 루트에서
cp .env.example server/.env
```

`.env` 파일을 열어 API Key 입력:

```env
SWEETBOOK_API_KEY=SB_your_sandbox_api_key_here
SWEETBOOK_ENV=sandbox
PORT=4000
CLIENT_URL=http://localhost:5173
```

### 실행

터미널 두 개를 열어 각각 실행:

```bash
# 터미널 1 — 백엔드 서버 (포트 4000)
cd server
npm run dev

# 터미널 2 — 프론트엔드 (포트 5173)
cd client
npm run dev
```

브라우저에서 http://localhost:5173 접속

---

## Sandbox 기본 템플릿 (공개 템플릿)

| templateUid | 종류 | bookSpec | 설명 |
|-------------|------|----------|------|
| `75HruEK3EnG5` | cover | PHOTOBOOK_A4_SC | 표지 (A4) |
| `6u05eEoZWuTa` | cover | PHOTOBOOK_A4_SC | 표지 (A4) |
| `40nimglmWLSh` | cover | PHOTOBOOK_A5_SC | 표지 (A5) |
| `5ADDkCtrodEJ` | content | PHOTOBOOK_A4_SC | 내지_photo (A4) - 메뉴 이미지 1장 |
| `6YuhM8awvNsQ` | content | PHOTOBOOK_A4_SC | 내지 (A4) |

> 앱은 기본값으로 `PHOTOBOOK_A4_SC` + `75HruEK3EnG5` (표지) + `5ADDkCtrodEJ` (내지) 를 사용합니다.

---

## 사용한 API 목록

| API | 메서드 | 용도 |
|-----|--------|------|
| `/Books` | POST | 새 북 생성 |
| `/Books` | GET | 북 목록 조회 |
| `/Books/{bookUid}/cover` | POST | 표지 생성 (templateUid + FormData) |
| `/Books/{bookUid}/contents` | POST | 내지 페이지 추가 (templateUid + FormData) |
| `/Books/{bookUid}/finalization` | POST | 북 최종화 |
| `/books/{bookUid}` | DELETE | 북 삭제 |
| `/orders/estimate` | POST | 가격 견적 조회 |
| `/orders` | POST | 주문 생성 |
| `/orders` | GET | 주문 목록 |
| `/orders/{orderUid}` | GET | 주문 상세 |
| `/orders/{orderUid}/cancel` | POST | 주문 취소 |
| `/book-specs` | GET | 북 스펙 목록 |
| `/templates` | GET | 템플릿 목록 |
| `/template-categories` | GET | 템플릿 카테고리 |
| `/credits` | GET | 충전금 잔액 조회 |
| `/credits/sandbox/charge` | POST | Sandbox 테스트 충전 |

---

## AI 도구 사용 내역

| AI 도구 | 활용 내용 |
|---------|-----------|
| Claude Code | 초기 프로젝트 구조 설계 및 보일러플레이트 생성 |
| Claude Code | 더미 데이터(카페 노아 메뉴 18종) 생성 및 Tailwind CSS 스타일링 보조 |

API 요청 포맷(FormData 구성, items 배열, shipping 필드 구조)은 SDK 소스와 실제 응답을 직접 확인하며 수정했습니다. AI가 생성한 코드는 동작 여부를 매번 검증하고 필요한 부분은 직접 수정하는 방식으로 진행했습니다.

---

## 설계 의도

### 왜 카페 메뉴북인가?

카페에서 일하다 보면 개인 카페 사장님들이 메뉴판 하나 제대로 만드는 것도 생각보다 쉽지 않습니다. 전문 디자이너에게 맡기면 비용이 만만치 않고, 직접 만들려면 포토샵이나 일러스트레이터 같은 툴을 다룰 줄 알아야 합니다.

반면 다른 카페에 손님으로 가면 메뉴판이나 공간 디테일이 예쁜 곳은 괜히 더 오래 있고 싶고, 또 오고 싶다는 느낌을 받는 경우가 많습니다. 그런데 정작 개인 카페들은 그런 부분에 신경 쓸 여유가 없어서 아쉬운 경우를 자주 봐왔고, 그게 이 서비스를 만들게 된 직접적인 이유였습니다.

사진과 가격만 입력하면 인쇄 주문까지 한 번에 되는 서비스라면, 디자인을 몰라도 예쁜 메뉴북을 가질 수 있다고 생각했습니다. Book Print API가 인쇄·배송을 다 처리해줘서, UI와 사용자 경험 설계에 집중할 수 있었습니다.

### 구조 설계 의도

입력 → 미리보기 → 제작 → 주문까지의 과정을 단계별로 분리해 사용자가 현재 진행 상태를 직관적으로 이해할 수 있도록 설계했습니다.

Book Print API 호출 과정이 북 생성 → 표지 추가 → 내지 추가 → 최종화 순서를 반드시 지켜야 하는 의존성이 있었기 때문에, 프론트엔드에서는 단순 입력만 담당하고 백엔드에서 이 비동기 흐름을 일괄 처리하도록 분리했습니다.

### 비즈니스 가능성

- 메뉴가 바뀔 때마다 새로 주문할 수 있어서 반복 사용이 자연스럽게 생깁니다
- 카페 외에도 레스토랑, 분식집 등 메뉴판이 필요한 곳이라면 모두 활용 가능합니다
- 인쇄비에 소정의 마진을 붙이는 구조로 수익화가 가능합니다

### 더 하고 싶었던 것들

- 로그인 기능 — 내 메뉴북 이력 관리
- 메뉴 입력하면서 실시간으로 레이아웃 미리보기
- URL 말고 이미지 파일 직접 업로드
- 완성된 메뉴북을 QR코드로도 볼 수 있게

---

## 프로젝트 구조

```
SweetBook/
├── client/                    # React 프론트엔드 (Vite + Tailwind)
│   ├── src/
│   │   ├── api/index.js       # 백엔드 API 호출
│   │   ├── components/        # UI 컴포넌트 (Step별)
│   │   └── pages/             # 홈, 메뉴북 생성, 주문 내역
│   └── package.json
├── server/                    # Express 백엔드
│   ├── sdk/                   # Sweetbook Node.js SDK
│   ├── routes/                # books, orders, catalog
│   ├── services/api.js        # SDK 래퍼
│   └── app.js
├── dummy-data/
│   └── cafe-menu.json         # 카페 노아 샘플 메뉴 18종
├── .env.example
├── .gitignore
└── README.md
```
