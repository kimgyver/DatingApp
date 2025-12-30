# DatingApp 프로젝트

## 개요

DatingApp은 Angular(프론트엔드)와 ASP.NET Core(백엔드)로 구성된 데모 데이팅 플랫폼입니다. 회원 가입, 프로필 관리, 매칭, 메시지, 관리자 기능 등 실제 서비스에 필요한 주요 기능을 포함합니다.

---

## 폴더 구조

```
DatingApp/
│
├── API/                # ASP.NET Core 백엔드
│   ├── Controllers/    # API 엔드포인트 (Account, Admin, Users 등)
│   ├── Data/           # 데이터베이스 컨텍스트, 리포지토리
│   ├── DTOs/           # 데이터 전송 객체
│   ├── Entities/       # 도메인 엔티티 (AppUser, Photo 등)
│   ├── Extensions/     # 서비스 확장, 유틸리티
│   ├── Helpers/        # 페이징, 매핑 등 헬퍼
│   ├── Interfaces/     # 리포지토리/서비스 인터페이스
│   ├── Middleware/     # 예외 처리 등 미들웨어
│   ├── Services/       # 토큰, 사진 등 서비스 구현
│   ├── SignalR/        # 실시간 Presence/Message 허브
│   └── appsettings.json 등
│
├── client/             # Angular 프론트엔드
│   ├── src/app/        # 주요 Angular 컴포넌트, 서비스, 모듈
│   │   ├── _services/  # API 통신, 인증 등 서비스
│   │   ├── _models/    # 프론트엔드 데이터 모델
│   │   ├── members/    # 회원 관련 컴포넌트
│   │   ├── admin/      # 관리자 패널, 모달 등
│   │   ├── modals/     # 재사용 모달 컴포넌트
│   │   └── ...         # 기타 기능별 폴더
│   ├── environments/   # 환경설정
│   └── ...             # Angular 설정 파일 등
│
├── DatingApp.sln       # 솔루션 파일
└── README.md           # (이 문서)
```

---

## 주요 기능

### 1. 회원 관리

- 회원 가입, 로그인, JWT 인증
- 프로필(사진, 자기소개 등) 수정
- 비밀번호/이메일 변경

### 2. 매칭/좋아요

- 회원 리스트, 상세 프로필
- 좋아요/언좋아요 기능
- 매칭된 회원 목록

### 3. 메시지

- 실시간 채팅 (SignalR)
- 메시지 목록, 읽음 처리

### 4. 관리자(Admin)

- 회원 목록 및 역할(Role) 관리
- 회원 정보(이름/비밀번호) 변경 모달
- 사진 승인/거절

### 5. 기타

- 예외 처리 미들웨어
- 페이징, 정렬, 필터링
- 전역 로딩 인디케이터

---

## 개발/실행 방법

### 백엔드(API)

1. `cd API`
2. `dotnet restore`
3. `dotnet ef database update` (DB 마이그레이션)
4. `dotnet watch run`

### 프론트엔드(client)

1. `cd client`
2. `npm install`
3. `ng serve`

---

## 기술 스택

- **프론트엔드**: Angular 16+, RxJS, ngx-bootstrap, Toastr
- **백엔드**: ASP.NET Core 7+, Entity Framework Core, SignalR
- **DB**: PostgreSQL (기본), SQLite (테스트)
- **인증**: JWT, ASP.NET Identity

---

## 커스텀/확장 포인트

- 관리자 기능(역할, 회원정보 변경)은 `AdminController`, `UserEditModalComponent` 등에서 확장 가능
- 실시간 기능은 SignalR 허브(`PresenceHub`, `MessageHub`)로 구현
- 전역 로딩/에러 핸들링은 Angular 인터셉터(`LoadingInterceptor`, `ErrorInterceptor`)로 처리

---

## Angular 클라이언트 구조 및 주요 개념

자세한 Angular 구조와 개념, 실전 팁은 [client/ANGULAR_GUIDE.md](client/ANGULAR_GUIDE.md) 파일을 참고하세요.

---
