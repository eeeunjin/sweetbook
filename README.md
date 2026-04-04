# 카페 메뉴북 제작소

카페 사장님이 메뉴 사진·설명을 입력하면 **실제 인쇄 가능한 메뉴북**을 자동 생성해주는 서비스.  
Sweetbook Book Print API를 활용해 제작부터 배송 주문까지 한 번에 처리합니다.

## 서비스 소개

| 항목 | 내용 |
|------|------|
| **서비스** | 카페 사장님이 메뉴 정보를 입력하면 고품질 인쇄 메뉴북을 제작해주는 B2B 웹 서비스 |
| **타겟** | 독립 카페 사장님, 소규모 F&B 사업자 |
| **핵심 가치** | 디자인 없이도 3분 만에 전문적인 메뉴북 제작 가능 |

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
# 서버 디렉토리에서
cp ../.env.example server/.env
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
| Claude Code | 전체 프로젝트 설계 및 코드 구현 (백엔드 서버, React 프론트엔드, SDK 연동) |
| Claude Code | SDK 소스 분석 후 실제 API 포맷(FormData, items 배열, shipping 필드)에 맞게 수정 |
| Claude Code | 더미 데이터(달빛 카페 메뉴 12종) 생성 및 Tailwind CSS 디자인 적용 |

---

## 설계 의도

### 왜 카페 메뉴북인가?

카페 사장님들은 메뉴판이 필요하지만 대부분 디자이너를 고용하거나 복잡한 도구(포토샵, 피그마)를 사용해야 합니다. "3분 안에 사진과 텍스트만 입력하면 인쇄 가능한 메뉴북이 만들어진다"는 경험은 실제 고통 포인트를 해결합니다.

Book Print API를 단순 기술 연동이 아니라 **실제 B2B SaaS 서비스**로 포지셔닝하면 카페 1,000곳 × 연 1~2회 메뉴 업데이트 = 반복 수익 모델이 됩니다.

### 비즈니스 가능성

- **타겟 시장**: 국내 카페 10만+ 개소, 소규모 F&B 사업자
- **수익 모델**: 메뉴북 제작·인쇄비 마진 + 구독형 메뉴 관리 서비스
- **확장**: 레스토랑, 호텔 룸서비스 메뉴, 웨딩 테이블 메뉴 등

### 더 시간이 있었다면 추가했을 기능

- **사용자 인증**: 카페 계정 생성 및 내 메뉴북 관리
- **라이브 미리보기**: 메뉴 입력 시 실시간 북 레이아웃 미리보기
- **이미지 직접 업로드**: URL이 아닌 파일 업로드 (Sweetbook Photos API 활용)
- **QR 메뉴판**: 인쇄 없이 QR 코드로 디지털 메뉴 제공
- **다국어 메뉴**: 관광지 카페를 위한 한/영/중/일 자동 번역

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
│   └── cafe-menu.json         # 달빛 카페 샘플 메뉴 12종
├── .env.example
├── .gitignore
└── README.md
```
