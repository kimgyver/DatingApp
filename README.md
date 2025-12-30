# DatingApp 프로젝트

## 개요

DatingApp은 Angular(프론트엔드)와 ASP.NET Core(백엔드)로 구성된 데모 데이팅 플랫폼입니다. 회원 가입, 프로필 관리, 매칭, 메시지, 관리자 기능 등 실제 서비스에 필요한 주요 기능을 포함합니다.

## 폴더 구조

```

DatingApp/
│
├── API/                # ASP.NET Core 백엔드 루트
│   ├── Controllers/    # [API 엔드포인트] RESTful 컨트롤러, 요청-응답 진입점. 기능별로 분리(예: Account, Admin, Users)
│   ├── Data/           # [DB/리포지토리] DbContext, 데이터 접근/저장, 시드, 마이그레이션
│   ├── DTOs/           # [데이터 전송 객체] API 입출력용 타입, Entity와 분리해 보안/유연성 확보
│   ├── Entities/       # [도메인 모델] 핵심 비즈니스 객체(예: AppUser, Photo), DB 테이블과 1:1 매핑
│   ├── Extensions/     # [서비스 확장/유틸] DI, 미들웨어, 유틸리티 함수 등 확장 메서드
│   ├── Helpers/        # [헬퍼/공통로직] 페이징, 매핑, 공통 기능(예: PagedList, AutoMapper)
│   ├── Interfaces/     # [인터페이스] 리포지토리/서비스 추상화, 테스트/확장성 용이
│   ├── Middleware/     # [미들웨어] 예외 처리, 로깅 등 파이프라인 처리
│   ├── Services/       # [비즈니스 서비스] 토큰, 사진 등 핵심 서비스 구현. Controller에서 주입받아 사용
│   ├── SignalR/        # [실시간 허브] Presence/MessageHub 등 실시간 기능(채팅, 알림)
│   └── appsettings.json 등 # 환경설정, 시크릿, DB 연결 등
│
├── client/             # Angular 프론트엔드 루트
│   ├── src/app/        # [앱 핵심] 주요 Angular 컴포넌트, 서비스, 모듈
│   │   ├── _services/  # [API/상태/유틸 서비스] Http 통신, 인증, 상태관리, 공통 로직
│   │   ├── _models/    # [프론트 데이터 모델] 타입/인터페이스, API/뷰 데이터 구조 정의
│   │   ├── members/    # [회원 기능] 회원 목록, 상세, 수정 등 도메인별 컴포넌트/라우팅
│   │   ├── admin/      # [관리자 기능] 관리자 패널, 역할 관리, 모달 등
│   │   ├── modals/     # [재사용 모달] 역할/회원정보 수정 등 공통 모달 컴포넌트
│   │   └── ...         # [기타] 기능별 폴더(메시지, 사진, 설정 등), 확장성 고려
│   ├── environments/   # [환경설정] dev/prod 환경변수, API 엔드포인트 등
│   └── ...             # [설정/테스트] Angular 설정 파일, 테스트, 에셋 등
│
├── DatingApp.sln       # [솔루션 파일] 전체 프로젝트/의존성 관리
└── README.md           # (이 문서)

```

## 실전 구조 활용 예시 & 온보딩 Q&A

### 폴더/레이어별 실전 시나리오

### 대표 코드/흐름 예시

**회원 정보 수정(프론트→백엔드 전체 흐름):**

1. `member-edit.component.ts`에서 폼 입력 후 저장 클릭
2. `members.service.ts`의 `updateMember()` 호출 → API PUT 요청
3. 백엔드 `UsersController.UpdateUser()`에서 DTO로 데이터 수신, 검증, 저장
4. 성공 시 204/200 응답, 프론트에서 UI 갱신

```typescript
// client/src/app/members/member-edit.component.ts
updateMember() {
	this.membersService.updateMember(this.editForm.value).subscribe(() => {
		// 성공 시 알림/상태 갱신
	});
}
```

```csharp
// API/Controllers/UsersController.cs
[HttpPut]
public async Task<ActionResult> UpdateUser(MemberUpdateDto dto) {
	// ...유효성 검사, 저장
	return NoContent();
}
```

### 확장/테스트/유지보수 팁

- **배포/운영**: Azure 등 클라우드 배포, 환경별(appsettings, 환경변수) 분리, CI/CD 파이프라인 구성
- **실시간 기능**: SignalR 허브/그룹/Presence, 실시간 알림/메시지/상태 동기화 구현
- **3rd Party 연동**: Cloudinary(사진), Tailwind/DaisyUI(스타일), Toastr(알림) 등 외부 서비스 통합
- **에러 처리**: API/SPA 양쪽에서 일관된 에러 처리(미들웨어, 인터셉터, 에러 페이지)
- **온보딩/문서화**: 각 폴더/기능별 README, 주요 흐름/의존성/확장 포인트 주석, Postman/Swagger로 API 문서화
- **테스트/품질**: 단위/통합 테스트, E2E 테스트, 테스트 커버리지 관리, 예외/경계 케이스 검증
- **상태 관리**: 서비스+RxJS/Signal, 전역 상태/캐싱/구독 해제 패턴, 대규모는 NgRx 등 적용
- **보안**: JWT 토큰 관리, CORS, HTTPS, 민감 정보 노출 방지, 인증/인가 정책
- **CI/CD 자동화**: GitHub Actions, Azure DevOps 등으로 빌드/테스트/배포 자동화. 예시 워크플로우:
  - `.github/workflows/dotnet-angular.yml` 등에서 백엔드/프론트엔드 빌드, 테스트, 배포 단계 정의
- **로컬/운영 환경 전환**: 환경별 설정(`appsettings.Development.json`, `.env`, 환경변수)로 개발/운영/테스트 환경 분리
- **프론트엔드 테스트**: Cypress(E2E), Jest(단위) 등으로 UI/로직 테스트. `client/src/app/**/*.spec.ts`, `cypress/e2e/` 등 위치
- **API 문서화**: Swagger(OpenAPI) 적용, `/swagger` 엔드포인트에서 API 명세 자동 제공. Postman 컬렉션(`DatingApp.postman_collection.json`) 활용
- **코드 스타일/포매팅**: Prettier, ESLint, EditorConfig 등으로 코드 일관성 유지. `.prettierrc`, `.eslintrc`, `.editorconfig` 등 설정 파일 활용

### 실무에서 자주 겪는 실수 & FAQ

- **배포 환경 변수 누락**: 클라우드 배포 시 환경별 설정(appsettings, secrets, 환경변수) 누락으로 장애 발생
- **실시간 그룹/연결 관리 미흡**: SignalR 그룹/Presence 관리 누락 시 실시간 알림/메시지 누락
- **3rd party 서비스 키/시크릿 노출**: Cloudinary 등 외부 서비스 키를 코드에 하드코딩하지 말고 환경변수로 분리
- **SPA/백엔드 CORS 미설정**: 개발/운영 환경에서 CORS 미설정으로 API 호출 실패
- **API/SPA 에러 메시지 노출**: 상세 에러 메시지/스택트레이스가 클라이언트에 노출되지 않도록 주의
- **테스트/문서화 미흡**: Postman/Swagger, E2E 테스트, 폴더별 README 등 온보딩/협업 자료 부족
- **JWT/인증 만료 처리 미흡**: 토큰 만료/갱신/로그아웃 처리 누락 시 UX/보안 문제
- **DB 마이그레이션/시드 누락**: 신규 배포/온보딩 시 DB 마이그레이션, 시드 데이터 반영 누락

### 프론트-백엔드 연동 흐름 요약

1. 프론트에서 서비스(`_services/`)를 통해 API 요청
2. 백엔드 컨트롤러에서 DTO로 데이터 수신/응답
3. DB/비즈니스 로직은 Service/Repository/Entity 계층에서 처리
4. 실시간 기능은 SignalR 허브를 통해 양방향 통신

# DatingApp 프로젝트 (실전 .NET/Angular 풀스택 웹앱)

> **이 프로젝트는 .NET 8/9, Entity Framework Core, Angular 18/20 기반의 최신 웹앱 개발 실전 예제입니다.**

## 주요 개발 내용

- Angular 어플리케이션 구조 설계 및 베스트 프랙티스 적용
- 3rd party 컴포넌트(예: Tailwind, DaisyUI, Toastr) 통합
- VS Code를 활용한 효율적 개발 워크플로우
- AutoMapper, Entity Framework Core, Repository 패턴 활용
- 사진 업로드(Cloudinary 등 외부 클라우드 연동), Drag & Drop 구현
- 실시간 채팅/알림/Presence (SignalR)
- JWT 인증, API/SPA 에러 처리, 데이터 필터/정렬/페이징
- 프론트-백엔드 연동, 실시간, 알림, 메시징, 상태관리, 테스트 등 실전 기능 구현

### 실전 설계/확장 팁:\*\*

- 각 폴더/레이어는 "단일 책임 원칙"을 지키고, 기능별/도메인별로 분리하면 유지보수와 협업이 쉬워집니다.
- API/DB/실시간 등 외부 연동은 서비스 계층에서 관리하고, 컨트롤러는 최대한 얇게 유지하세요.
- 공통/재사용 컴포넌트, 파이프, 디렉티브는 `shared/` 또는 `common/` 폴더로 분리 추천
- 각 폴더에 README.md, 주석, 예시 코드/흐름을 추가하면 팀원 온보딩과 유지보수에 큰 도움이 됩니다.
- 테스트 파일(`*.spec.ts`)은 각 기능 폴더에 포함해 실제 동작을 검증하세요.

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

```

```
