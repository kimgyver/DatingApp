# Angular 클라이언트 가이드 (치트시트)

> DatingApp `client`용 **빠른 조회** 문서입니다.  
> 상세 설명·FAQ·심화 예시는 [`ANGULAR_GUIDE_REFERENCE.md`](./ANGULAR_GUIDE_REFERENCE.md)를 보세요.  
> 코드 예시는 프로젝트의 NgModule 구조와 **Angular 17+ 권장(standalone / 함수형 API)** 을 함께 표기합니다.

# 목차

- [폴더 구조](#폴더-구조-clientsrcapp)
- [Angular 핵심 개념](#angular-핵심-개념)
- [실전 팁](#실전-팁)
- [참고 자료](#참고-자료)
- [개념 ↔ 코드 매핑](#개념--코드-매핑)
  - [1. Component](#1-component)
  - [2. Service & DI](#2-service--di)
  - [3. BehaviorSubject / Observable](#3-behaviorsubject--observable)
  - [4. Data Binding](#4-data-binding)
  - [5. Directive](#5-directive)
  - [6. Form (Reactive)](#6-form-reactive)
  - [7. Input / Output](#7-input--output)
  - [8. Interceptor](#8-interceptor)
  - [9. Routing & Guards](#9-routing--guards)
  - [10. Lifecycle Hooks](#10-lifecycle-hooks)
  - [11. RxJS 연산자](#11-rxjs-연산자)
  - [12. Pipe](#12-pipe)
  - [13. Testing](#13-testing)
  - [14. Performance](#14-performance)
  - [15. 고급 개념](#15-고급-개념)
  - [16. 데코레이터](#16-데코레이터)
  - [17. DatingApp 실전](#17-datingapp-실전-짧은-매핑)
  - [18. 부록](#18-부록-짧은-추가-예시)
- [공식 문서 링크](#공식-문서-링크)

## 폴더 구조 (client/src/app)

- **\_models/**: 타입/모델 (interface, class)
- **\_services/**: 비즈니스 로직, 상태, API (`account.service` 등)
- **\_guards/**: 라우트 가드
- **\_interceptors/**: HTTP 가로채기 (로딩, 에러, JWT)
- **\_directives/**: 커스텀 디렉티브 (`has-role` 등)
- **\_pipes/**: 커스텀 파이프 (`age` 등)
- **\_forms/**: 재사용 폼 컨트롤 (TextInput, DatePicker)
- **\_modules/**: SharedModule 등
- **members/**: 회원 목록·상세·수정
- **admin/**: 관리자 패널
- **modals/**: 재사용 모달

## Angular 핵심 개념

- **컴포넌트**: 템플릿 + TypeScript + 스타일. UI 단위.
- **DI / 서비스**: `@Injectable({ providedIn: 'root' })` 또는 `inject()`.
- **라우팅**: `Routes` + `<router-outlet>`. 가드로 인증/권한.
- **폼**: Reactive Forms 권장. 단순 입력만 Template-driven/`ngModel`.
- **모듈 (레거시·본 프로젝트)**: `NgModule`로 묶음.  
  **권장(17+)**: Standalone 컴포넌트 + `bootstrapApplication` / `provideRouter` / `provideHttpClient`.
- **템플릿 제어**: 권장 `@if` / `@for`. 레거시 `*ngIf` / `*ngFor`.
- **반응성**: 로컬 UI → Signal (`signal`/`computed`). 비동기 스트림 → RxJS.

## 실전 팁

- **상태**: 중소규모는 서비스 + `BehaviorSubject`. 대규모·협업·DevTools 필요 시 NgRx 등.
- **구독**: 템플릿은 `| async` 또는 `toSignal`. TS 구독은 `takeUntilDestroyed()` / `ngOnDestroy`.
- **HTTP**: 1회 complete 요청은 누수 위험 낮음. Subject/`interval` 등은 해제 필수.
- **HTTP 층**: Interceptor(클라이언트) ≠ API 서버 middleware.
- **레이아웃**: `children` + 부모 `<router-outlet>`.
- **성능**: 병목일 때만 OnPush, `track`/`trackBy`, Lazy load, Virtual Scroll.

## 참고 자료

- [Angular 문서](https://angular.dev/)
- [RxJS](https://rxjs.dev/)
- [스타일 가이드](https://angular.dev/style-guide)
- [상세 레퍼런스 (이 레포)](./ANGULAR_GUIDE_REFERENCE.md)

---

## 개념 ↔ 코드 매핑

### 1. Component

- **개념**: `@Component`, 템플릿·클래스·스타일.
- **팁**: 작게, 단일 책임.
- **코드**: `src/app/members/member-edit/member-edit.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-member-edit",
  templateUrl: "./member-edit.component.html",
  styleUrl: "./member-edit.component.css",
  // standalone: true, // 17+ 권장 시 imports: [CommonModule, ...]
})
export class MemberEditComponent implements OnInit {
  ngOnInit(): void {}
}
```

### 2. Service & DI

- **개념**: 비즈니스 로직·공유 상태. DI로 주입.
- **팁**: `providedIn: 'root'`면 앱 싱글턴. 상태 공유 시 부작용 주의.
- **코드**: `src/app/_services/account.service.ts`

```typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AccountService {
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
}
```

```typescript
// 컴포넌트에서 주입 (권장)
import { inject } from "@angular/core";
private accountService = inject(AccountService);
// 또는 constructor(private accountService: AccountService) {}
```

### 3. BehaviorSubject / Observable

- **개념**: Observable = 구독 스트림. BehaviorSubject = 최신값 보관 + 발행/구독.
- **팁**: 서비스 내부에 Subject, 외부에는 `asObservable()`. UI는 `| async`.

```typescript
private currentUserSource = new BehaviorSubject<User | null>(null);
currentUser$ = this.currentUserSource.asObservable();
this.currentUserSource.next(user);
```

```html
<!-- 레거시 -->
<span *ngIf="accountService.currentUser$ | async as user">{{ user.username }}</span>
```

```typescript
// 17+ 권장: Observable → Signal 후 템플릿에서 읽기
import { toSignal } from "@angular/core/rxjs-interop";
user = toSignal(this.accountService.currentUser$, { initialValue: null });
```

```html
@if (user(); as u) {
  <span>{{ u.username }}</span>
}
```

### 4. Data Binding

- **개념**: Property `[x]`, Event `(x)`, 양방향 `[(ngModel)]`, 보간 `{{ }}`.
- **팁**: 복잡 폼은 Reactive Forms. `ngModel`은 `FormsModule` 필요.
- `@Input`/`@Output`에도 동일 문법 사용 가능 (HTML 표준만 되는 것 아님).

```html
<img [src]="user.photoUrl" />
<button (click)="logout()">Logout</button>
<input [(ngModel)]="user.name" />
<h1>{{ user.name }}</h1>
```

### 5. Directive

- **개념**: 구조/속성/커스텀. 접두사 `app` 권장.
- **코드**: `src/app/_directives/has-role.directive.ts`

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({ selector: "[appHasRole]" })
export class HasRoleDirective {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private vcr: ViewContainerRef
  ) {}
  // @Input() set appHasRole(...) { 권한에 따라 createEmbeddedView / clear }
}
```

```html
<button *appHasRole="'Admin'">관리자만 보임</button>
```

### 6. Form (Reactive)

- **개념**: `FormGroup` / `FormControl` / `FormArray` + Validators.
- **팁**: 동적·검증 많은 폼에 적합.

```typescript
import { FormBuilder, Validators } from "@angular/forms";

private fb = inject(FormBuilder);
editForm = this.fb.group({
  name: ["", Validators.required],
  email: ["", [Validators.required, Validators.email]],
});
```

```html
<form [formGroup]="editForm" (ngSubmit)="save()">
  <input formControlName="email" />
  <button [disabled]="editForm.invalid">저장</button>
</form>
```

### 7. Input / Output

- **개념**: 부모→자식 데이터, 자식→부모 이벤트. 깊은 트리는 서비스로 상태 상향.
- **코드**: `src/app/members/member-card/member-card.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, input, output } from "@angular/core";

@Component({ selector: "app-member-card", templateUrl: "./member-card.component.html" })
export class MemberCardComponent {
  @Input({ required: true }) member!: Member;
  @Output() liked = new EventEmitter<number>();

  // 17+ 대안
  // member = input.required<Member>();
  // liked = output<number>();
}
```

### 8. Interceptor

- **개념**: HTTP 요청/응답 공통 처리 (JWT, 로딩, 에러).
- **등록**:  
  - **레거시(NgModule)**: `HTTP_INTERCEPTORS` + `multi: true`  
  - **권장**: `provideHttpClient(withInterceptors([loadingInterceptor]))`
- **코드**: `src/app/_interceptors/loading.interceptor.ts`

```typescript
// 함수형 (권장)
import { HttpInterceptorFn } from "@angular/common/http";
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // show loader...
  return next(req);
};

// 클래스 (레거시)
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req);
  }
}
```

### 9. Routing & Guards

- **개념**: path → component. `CanActivateFn` 인증/권한, `CanDeactivateFn` 미저장 이탈. `**`는 맨 아래.
- **코드**: `src/app/app-routing.module.ts` · `src/app/_guards/`

```typescript
import { Routes } from "@angular/router";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { authGuard } from "./_guards/auth.guard"; // CanActivateFn 권장

export const routes: Routes = [
  { path: "members", component: MemberListComponent, canActivate: [authGuard] },
  // loadComponent: () => import('./admin/...').then(m => m.AdminComponent),
];
```

```typescript
// auth.guard.ts (함수형)
import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AccountService } from "../_services/account.service";
import { map } from "rxjs";

export const authGuard: CanActivateFn = () => {
  const account = inject(AccountService);
  const router = inject(Router);
  return account.currentUser$.pipe(
    map((user) => (user ? true : router.createUrlTree(["/"])))
  );
};
```

```html
<a routerLink="/home" routerLinkActive="active">Home</a>
<router-outlet></router-outlet>
```

### 10. Lifecycle Hooks

- **개념**: `ngOnInit` 초기화, `ngOnChanges` Input 변경, `ngAfterViewInit` DOM, `ngOnDestroy` 정리.
- **팁**: 구독·타이머는 destroy에서 해제. 또는 `takeUntilDestroyed()`.

```typescript
import { DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export class MemberEditComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  // 필드/생성자에서는 takeUntilDestroyed()만으로도 가능

  ngOnInit() {
    this.membersService
      .getMember()
      .pipe(takeUntilDestroyed(this.destroyRef)) // ngOnInit 등에선 DestroyRef 전달
      .subscribe((m) => (this.member = m));
  }
}
```

### 11. RxJS 연산자

- **개념**: `map`, `filter`, `switchMap`, `debounceTime`, `takeUntil`, `catchError`…
- **팁**: import는 `from "rxjs"`. HTTP/검색에는 `switchMap`(이전 요청 취소).

```typescript
import { map, take, switchMap, filter, debounceTime } from "rxjs";

this.accountService.currentUser$
  .pipe(
    take(1),
    map((user) => user?.username)
  )
  .subscribe();

this.route.params
  .pipe(switchMap((p) => this.memberService.getMember(p["username"])))
  .subscribe((member) => (this.member = member));
```

### 12. Pipe

- **개념**: 템플릿 표시용 변환. 내장 `date`, `async`, `uppercase` + 커스텀.
- **팁**: 기본은 **pure**. `pure: false`는 참조가 안 바뀌는데 내부 mutate를 감지해야 할 때 등 특수 케이스. 무거운 로직은 컴포넌트/`computed`로.
- **코드**: `src/app/_pipes/age.pipe.ts`

```html
<span>{{ member.created | date: "yyyy-MM-dd" }}</span>
<span>{{ member.birthDate | age }}</span>
```

```typescript
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "age", pure: true })
export class AgePipe implements PipeTransform {
  transform(value: string | Date): number {
    /* 생년월일 → 나이 */
    return 0;
  }
}
```

### 13. Testing

- **팁**: `*.spec.ts`, TestBed. E2E는 Cypress/Playwright (`ng e2e`/Protractor는 사실상 폐기).

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MemberEditComponent } from "./member-edit.component";

describe("MemberEditComponent", () => {
  let component: MemberEditComponent;
  let fixture: ComponentFixture<MemberEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberEditComponent], // standalone이면 imports: [MemberEditComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(MemberEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
```

### 14. Performance

- **기법**: OnPush, `trackBy` / `@for`의 `track`, Lazy loading, Virtual Scroll, Pure Pipe, Preloading.
- **팁**: 병목이 보일 때 적용. 전부 기본 적용은 비추.

```typescript
// OnPush: Input 참조 변경, 템플릿 이벤트, async/Signal, markForCheck 때 갱신
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class FastComponent {}
```

```html
<!-- 레거시 -->
<li *ngFor="let item of items; trackBy: trackById">...</li>
<!-- 17+ -->
@for (item of items; track item.id) {
  <li>...</li>
}
```

```typescript
// Lazy: 모듈(레거시)
{ path: "admin", loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule) }
// Lazy: standalone
{ path: "admin", loadComponent: () => import("./admin/admin.component").then((m) => m.AdminComponent) }
```

```html
<cdk-virtual-scroll-viewport itemSize="50" style="height: 400px">
  <div *cdkVirtualFor="let item of items">{{ item }}</div>
</cdk-virtual-scroll-viewport>
```

### 15. 고급 개념

```typescript
@ViewChild("inputRef") inputRef!: ElementRef;
ngAfterViewInit() {
  this.inputRef.nativeElement.focus();
}

@ContentChild("projected") projected!: ElementRef;

@HostBinding("class.active") isActive = true;
@HostListener("window:beforeunload", ["$event"])
onUnload(e: BeforeUnloadEvent) {
  /* ... */
}
```

```html
<!-- Content projection -->
<div class="card"><ng-content></ng-content></div>
<app-card>내용</app-card>
```

```typescript
import { signal, computed, effect } from "@angular/core";
const count = signal(0);
const double = computed(() => count() * 2);
effect(() => console.log(count()));
count.set(1);
```

- **상태**: 소규모 → 서비스+RxJS/Signal. 대규모 → NgRx 등.  
- Signal = 동기 UI 상태, RxJS = 비동기 스트림.

### 16. 데코레이터

| 데코레이터 | 용도 |
| --- | --- |
| `@Component` | 컴포넌트 |
| `@Injectable` | 서비스 DI |
| `@Directive` / `@Pipe` | 디렉티브 / 파이프 |
| `@Input` / `@Output` | 입·출력 (대안: `input()` / `output()`) |
| `@ViewChild` / `@ContentChild` | 뷰·프로젝션 쿼리 (대안: `viewChild()`) |

```typescript
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {}
```

---

## 17. DatingApp 실전 (짧은 매핑)

상세·경로·예시는 [REFERENCE §19](./ANGULAR_GUIDE_REFERENCE.md#19-datingapp-실전-패턴).

| 주제 | 한 줄 | 주요 경로 |
| --- | --- | --- |
| **SignalR** | `HubConnection`으로 presence/메시지 실시간. 로그인 시 연결·로그아웃 시 해제 | `_services/presence.service.ts`, `message.service.ts` |
| **CanDeactivate** | 폼 `dirty`면 이탈 confirm. `canDeactivate: [preventUnsavedChangesGuard]` | `_guards/prevent-unsaved-changes.guard.ts` |
| **CVA 커스텀 폼** | `ControlValueAccessor` + `NgControl`로 `formControlName`에 붙는 입력 | `_forms/text-input`, `date-picker` |
| **페이지네이션** | 응답 헤더 `Pagination` + `getPaginatedResult` / `getPaginationHeaders` | `_services/paginationHelper.ts` |
| **로딩 UX** | Interceptor → `BusyService` → `ngx-spinner` | `_interceptors/loading.interceptor.ts`, `busy.service.ts` |
| **에러 UX** | Interceptor에서 상태별 toastr / `/not-found` / `/server-error` | `_interceptors/error.interceptor.ts`, `errors/` |
| **유저 복원** | 앱 시작 시 `localStorage` → `setCurrentUser` (+ Hub 재연결) | `app.component.ts`, `account.service.ts` |
| **모달** | `BsModalService.show` + `initialState` / 콜백 | `modals/`, `admin/user-management` |

```typescript
// CanDeactivate (요지)
export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (c) =>
  !c.editForm?.dirty || confirm("Unsaved changes will be lost");

// SignalR (요지)
HubConnectionBuilder().withUrl(hubUrl + "presence", { accessTokenFactory: () => token }).build();

// CVA (요지)
constructor(@Self() public ngControl: NgControl) {
  this.ngControl.valueAccessor = this;
}
```

---

## 18. 부록 (짧은 추가 예시)

상세·변형은 [REFERENCE](./ANGULAR_GUIDE_REFERENCE.md) §6 FormArray, §11 RxJS, §13 Testing.

```typescript
// FormArray (FormGroup 안)
editForm = this.fb.group({ emails: this.fb.array([this.fb.control("")]) });
(this.editForm.controls.emails as FormArray).push(this.fb.control(""));

// 검색 debounce
this.searchInput.valueChanges
  .pipe(filter((t) => t.length > 2), debounceTime(300), switchMap((q) => this.search(q)))
  .subscribe();
```

```javascript
// Cypress — 셀렉터는 앱 실제 name에 맞게 조정
cy.visit("/login");
cy.get("input[name=email]").type("test@test.com");
cy.get("button[type=submit]").click();
```

---

## 공식 문서 링크

| 주제 | 링크 |
| --- | --- |
| Components | https://angular.dev/guide/components |
| DI | https://angular.dev/guide/di |
| Binding | https://angular.dev/guide/templates/binding |
| Directives | https://angular.dev/guide/directives |
| Reactive forms | https://angular.dev/guide/forms/reactive-forms |
| HTTP / Interceptors | https://angular.dev/guide/http |
| Router | https://angular.dev/guide/routing |
| Lifecycle | https://angular.dev/guide/components/lifecycle |
| Pipes | https://angular.dev/guide/templates/pipes |
| Testing | https://angular.dev/guide/testing |
| Signals | https://angular.dev/guide/signals |
| Standalone | https://angular.dev/guide/components/importing |
| Control flow | https://angular.dev/guide/templates/control-flow |
| RxJS | https://rxjs.dev/ |
| NgRx | https://ngrx.io/ |
