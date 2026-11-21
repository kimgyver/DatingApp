# Angular 클라이언트 구조 및 주요 개념 (상세 레퍼런스)

> DatingApp `client` 기준 **상세 설명·실전 패턴·FAQ** 문서입니다.  
> 빠른 조회는 [`ANGULAR_GUIDE.md`](./ANGULAR_GUIDE.md)를 보세요.  
> 본 프로젝트는 주로 **NgModule** 구조를 쓰지만, 예시는 **Angular 17+ 권장(standalone · 함수형 Guard/Interceptor · `@if`/`@for` · Signal)** 을 함께 적습니다. “레거시”는 기존 코드 읽기용입니다.

# 목차

- [폴더 구조](#폴더-구조-clientsrcapp)
- [1. 기본 개념](#1-angular-기본-개념---컴포넌트모듈라우팅폼)
- [2. Service & DI](#2-service--dependency-injection)
- [3. BehaviorSubject / Observable](#3-behaviorsubjectobservable)
- [4. Data Binding](#4-data-binding-데이터-바인딩)
- [5. Directive](#5-directive)
- [6. Form (Reactive)](#6-form-reactive)
- [7. Input / Output](#7-inputoutput--eventemitter)
- [8. Interceptor](#8-interceptor)
- [9. Routing & Guards](#9-routing--guards)
- [10. Lifecycle Hooks](#10-lifecycle-hooks-생명주기-훅)
- [11. RxJS 연산자](#11-rxjs-연산자)
- [12. Pipe](#12-pipe-파이프)
- [13. Testing](#13-testing-테스팅)
- [14. 고급 개념](#14-고급-angular-개념-및-실전-팁)
- [15. Performance](#15-performance-improvement-성능-최적화)
- [16. 데코레이터](#16-angular-데코레이터-개념-및-예시)
- [17. 상태 관리](#17-angular-상태-관리-서비스rxjs-vs-ngrxngxsakita)
- [18. Angular 17+ 요약](#18-angular-17-요약-체크리스트)
- [19. DatingApp 실전 패턴](#19-datingapp-실전-패턴)
- [참고 자료](#참고-자료)

## 폴더 구조 (client/src/app)

- **\_models/**: 프론트 타입/모델
- **\_services/**: API·상태·비즈니스 로직
- **\_guards/**: 라우트 가드
- **\_interceptors/**: HTTP 가로채기 (로딩, 에러, JWT)
- **\_directives/**: 커스텀 디렉티브
- **\_pipes/**: 커스텀 파이프
- **\_forms/**: TextInput, DatePicker 등
- **\_modules/**: SharedModule 등
- **members/**: 회원 목록·상세·수정
- **admin/**: 관리자
- **modals/**: 재사용 모달

## 1. Angular 기본 개념 - 컴포넌트/모듈/라우팅/폼

- **컴포넌트**: 템플릿 + TypeScript + 스타일
- **모듈 (레거시·본 프로젝트)**: `NgModule`로 컴포넌트/파이프/디렉티브 묶음  
  **권장(17+)**: Standalone + `bootstrapApplication` / `provideRouter` / `provideHttpClient`
- **라우팅**: URL → 컴포넌트. `<router-outlet>`. 중첩은 `children` + 부모 outlet (레이아웃). `CanActivate` / `CanDeactivate` 가드.
- **폼**: Reactive Forms 권장, Template-driven은 단순 입력. 재사용 입력은 **ControlValueAccessor** (`_forms/`).
- **HTTP 층**: 클라이언트 `HttpInterceptor(Fn)` ≠ API 서버 middleware (별층)
- **DatingApp 실전**: SignalR, 페이지네이션, Busy/에러 UX, localStorage 복원, 모달 → [§19](#19-datingapp-실전-패턴)

공식: [Components](https://angular.dev/guide/components) · [Router](https://angular.dev/guide/routing) · [Forms](https://angular.dev/guide/forms)

#### 1-1. Component

- **팁**: 작고 단일 책임.
- **코드**: `src/app/members/member-edit/member-edit.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-member-edit",
  templateUrl: "./member-edit.component.html",
  styleUrl: "./member-edit.component.css",
  // standalone: true,
  // imports: [ReactiveFormsModule, ...],
})
export class MemberEditComponent implements OnInit {
  ngOnInit(): void {}
}
```

#### 1-2. Module (레거시) vs Standalone (권장)

**레거시 NgModule**

- `declarations`: 이 모듈의 컴포넌트/디렉티브/파이프
- `imports`: 다른 모듈/standalone
- `providers`: 모듈 범위 서비스·토큰 (`HTTP_INTERCEPTORS` 등). 일반 서비스는 `providedIn: 'root'` 권장
- `bootstrap`: 루트 컴포넌트

```typescript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { SharedModule } from "./_modules/shared.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";

@NgModule({
  declarations: [AppComponent /* ... */],
  imports: [BrowserModule, SharedModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**권장 standalone bootstrap**

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])),
  ],
});
```

### 2. Service & Dependency Injection

- **개념**: 비즈니스 로직·공유 상태. DI로 주입.
- **팁**: root 싱글턴이면 여러 컴포넌트가 같은 상태를 봄.
- **코드**: `src/app/_services/account.service.ts`

`@Injectable({ providedIn: "root" })`이면 providers 등록 없이 앱 전역 싱글턴.

```typescript
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AccountService {
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
}

// 주입 (권장)
private accountService = inject(AccountService);
// 또는 constructor(private accountService: AccountService) {}
```

### 3. BehaviorSubject/Observable

- **Observable**: 구독으로 비동기/이벤트/상태를 스트림으로 소비. `next` 직접 발행 불가.
- **Subject / BehaviorSubject**: 발행(`next`) + 구독. BehaviorSubject는 **초기값 필수**, 구독 시 최신값 즉시 전달.
- **패턴**: 서비스 내부 = Subject, 외부 = `asObservable()`.

**팁**

- 로그인/테마/알림 등 전역 상태에 적합.
- 상태 스트림 UI는 `| async`로 최신 반영.
- HTTP처럼 1회 complete면 unsubscribe 부담 적음. `interval`/Subject/WebSocket은 `ngOnDestroy` / `takeUntilDestroyed` / `| async`로 해제.

**서비스 예시** (`account.service.ts`)

```typescript
// import { tap } from "rxjs";
login(model: unknown) {
  return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
    tap((user) => {
      // 부수효과(저장·상태 emit)는 tap. map은 값 변환용
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        this.currentUserSource.next(user);
      }
    })
  );
}
```

**템플릿**

```html
<!-- 레거시 -->
<span *ngIf="accountService.currentUser$ | async as user">{{ user.username }} 님</span>

<!-- 17+ -->
@if (accountService.currentUser$ | async; as user) {
  <span>{{ user.username }} 님</span>
}
```

**pipe에서 변환, subscribe에서 소비**

```typescript
observable
  .pipe(
    map((value) => value * 2),
    filter((value) => value > 10)
  )
  .subscribe({
    next: (result) => {
      this.value = result;
    },
  });
```

**subscribe 위치**

- 서비스는 대부분 Observable만 반환. subscribe는 호출측(컴포넌트)에서.
- 서비스 생성자 subscribe는 “즉시 내부 상태 초기화”가 필요할 때만.

### 4. Data Binding (데이터 바인딩)

#### ng-container / ng-template

- `ng-container`: DOM 노드 없이 구조 지시자·그룹화.
- `ng-template`: 당장 렌더되지 않는 템플릿 정의 (`else`, 동적 뷰 등).

```html
<ng-container *ngIf="isLoggedIn; else guestBlock">
  <span>환영합니다, {{ userName }}님!</span>
</ng-container>
<ng-template #guestBlock>
  <span>로그인 해주세요.</span>
</ng-template>

<ng-container *ngFor="let item of items">
  <div>{{ item.name }}</div>
  <div *ngIf="item.isNew">NEW!</div>
</ng-container>
```

17+ 동일 의도:

```html
@if (isLoggedIn) {
  <span>환영합니다, {{ userName }}님!</span>
} @else {
  <span>로그인 해주세요.</span>
}

@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
  @if (item.isNew) {
    <div>NEW!</div>
  }
}
```

#### 바인딩 종류

| 종류 | 문법 | 방향 |
| --- | --- | --- |
| Property | `[prop]="expr"` | 컴포넌트 → 뷰 / `@Input` |
| Event | `(event)="handler()"` | 뷰 → 컴포넌트 / `@Output` |
| Two-way | `[(ngModel)]="prop"` | 동기화 (단순 폼) |
| Interpolation | `{{ expr }}` | 텍스트 |

HTML 표준 속성·이벤트뿐 아니라 **커스텀 `@Input` / `@Output` 이름**에도 동일 문법을 씁니다.

```html
<img [src]="member.photoUrl" alt="프로필" />
<button [disabled]="!editForm?.dirty">저장</button>
<button (click)="updateMember()">Save</button>
<input [(ngModel)]="member.introduction" />
<h2>{{ member.username }}님의 프로필</h2>
```

`ngModel` → `FormsModule`(또는 standalone import). 복잡 폼 → Reactive Forms.

### 5. Directive

- 구조/속성/커스텀. 접두사 `app` 권장.
- **코드**: `src/app/_directives/has-role.directive.ts`

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({ selector: "[appHasRole]" })
export class HasRoleDirective {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appHasRole(role: string | string[]) {
    // 권한 있으면 this.viewContainer.createEmbeddedView(this.templateRef)
    // 없으면 this.viewContainer.clear()
  }
}
```

```html
<button *appHasRole="'Admin'">관리자만 보임</button>
```

### 6. Form (Reactive)

- FormGroup / FormControl / FormArray + Validators. 동적 폼·고급 검증에 유리.
- Template-driven은 단순 입력만.

**회원 수정 예시** (`member-edit`)

```typescript
import { FormBuilder, Validators, inject } from "@angular/forms";

export class MemberEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private membersService = inject(MembersService);
  editForm = this.fb.group({
    introduction: ["", [Validators.maxLength(200)]],
    isActive: [false],
    email: ["", [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.editForm.patchValue({
      introduction: this.member.introduction,
      isActive: this.member.isActive,
      email: this.member.email,
    });
  }

  updateMember() {
    if (this.editForm.invalid) return;
    this.membersService.updateMember(this.editForm.value).subscribe();
  }
}
```

```html
<form [formGroup]="editForm" (ngSubmit)="updateMember()">
  <input formControlName="introduction" />
  <input type="checkbox" formControlName="isActive" />
  <input formControlName="email" type="email" />
  @if (editForm.get("email")?.invalid && editForm.get("email")?.touched) {
    <div>이메일 형식이 올바르지 않습니다.</div>
  }
  <button type="submit" [disabled]="editForm.invalid">저장</button>
</form>
```

**FormArray** (`FormGroup` 안에 포함)

```typescript
editForm = this.fb.group({
  skills: this.fb.array<string>([]),
});
get skills() {
  return this.editForm.controls.skills;
}
addSkill() {
  this.skills.push(this.fb.control(""));
}
```

```html
<form [formGroup]="editForm">
  <div formArrayName="skills">
    @for (skill of skills.controls; track $index; let i = $index) {
      <input [formControlName]="i" />
    }
  </div>
  <button type="button" (click)="addSkill()">스킬 추가</button>
</form>
```

커스텀·비동기 Validator, `Validators.compose` 지원.

### 7. Input/Output & EventEmitter

- 부모→자식 `@Input`, 자식→부모 `@Output` + `EventEmitter`.
- 깊은 계층은 서비스로 상태 상향.
- **코드**: `member-card.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, input, output } from "@angular/core";

@Component({
  selector: "app-member-card",
  templateUrl: "./member-card.component.html",
})
export class MemberCardComponent {
  @Input({ required: true }) member!: Member;
  @Output() liked = new EventEmitter<number>();

  // 17+ 대안
  // member = input.required<Member>();
  // liked = output<number>();
}
```

### 8. Interceptor

- HTTP 공통 로직 (로딩, JWT, 에러).
- **코드**: `src/app/_interceptors/loading.interceptor.ts`

**함수형 (권장)**

```typescript
import { HttpInterceptorFn } from "@angular/common/http";

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // busy service...
  return next(req);
};

// main.ts / app.config.ts
provideHttpClient(withInterceptors([loadingInterceptor, jwtInterceptor, errorInterceptor]));
```

**클래스 (레거시 NgModule)**

```typescript
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req);
  }
}

// providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }]
```

`multi: true`로 여러 인터셉터를 순서대로 등록.

### 9. Routing & Guards

- 인증/권한, 프리패치. 와일드카드 `**`는 배열 맨 아래.
- **코드**: `app-routing.module.ts` / `routes`

#### router-outlet

레이아웃에 배치. 중첩 라우트면 **부모** 템플릿에도 `<router-outlet>` 추가 (`children`).

```html
<nav>...</nav>
<router-outlet></router-outlet>
```

#### Route config

```typescript
import { Routes } from "@angular/router";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { authGuard } from "./_guards/auth.guard";

export const routes: Routes = [
  { path: "members", component: MemberListComponent, canActivate: [authGuard] },
  {
    path: "admin",
    // 레거시: loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    loadComponent: () => import("./admin/admin.component").then((m) => m.AdminComponent),
    canActivate: [authGuard],
    // children: [{ path: '', component: AdminHomeComponent }, ...]  // 중첩 시 부모에 outlet
  },
  { path: "**", redirectTo: "" },
];
```

#### 함수형 Guard (권장)

```typescript
import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { map } from "rxjs";
import { AccountService } from "../_services/account.service";

export const authGuard: CanActivateFn = () => {
  const account = inject(AccountService);
  const router = inject(Router);
  return account.currentUser$.pipe(
    map((user) => (user ? true : router.createUrlTree(["/"])))
  );
};
```

미저장 이탈은 `CanDeactivateFn` — DatingApp: `_guards/prevent-unsaved-changes.guard.ts` ([§19-2](#19-2-candeactivate--미저장-이탈)).

#### RouterLink / Router

```html
<a routerLink="/home" routerLinkActive="active">Home</a>
<button [routerLink]="['/members', member.userName]">상세</button>
```

```typescript
private router = inject(Router);
this.router.navigateByUrl("/about");
this.router.navigate(["/members", userName]);
```

#### Resolve / 데이터 프리패치

컴포넌트 생성 전 데이터 로드. **함수형 resolve 권장**.

```typescript
import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { MembersService } from "./_services/members.service";

export const memberDetailResolver: ResolveFn<Member> = (route) => {
  return inject(MembersService).getMember(route.paramMap.get("username")!);
};

// routes
{
  path: "members/:username",
  component: MemberDetailComponent,
  resolve: { member: memberDetailResolver },
}

// component — inject()는 필드/생성자 컨텍스트에서 (메서드 안 X)
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  member!: Member;

  ngOnInit() {
    this.member = this.route.snapshot.data["member"];
  }
}
```

대안: `withComponentInputBinding()`으로 라우트 데이터를 `@Input`/`input()`에 매핑.

공식: [Router](https://angular.dev/guide/routing)

### 10. Lifecycle Hooks (생명주기 훅)

| 훅 | 언제 |
| --- | --- |
| `ngOnChanges` | `@Input` 변경 |
| `ngOnInit` | 입력 준비 후 1회 초기화 |
| `ngAfterContentInit` | Content projection 후 |
| `ngAfterViewInit` | 뷰/DOM 준비 후 |
| `ngOnDestroy` | 파괴 직전 정리 |

**구독 해제 (권장: takeUntilDestroyed)**

생성자·필드 초기화에서 `takeUntilDestroyed()`만 써도 됩니다. `ngOnInit` 등에서는 `DestroyRef`를 넘깁니다.

```typescript
import { DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export class MemberEditComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private membersService = inject(MembersService);
  member?: Member;

  ngOnInit(): void {
    this.membersService
      .getMember()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((member) => (this.member = member));
  }
}
```

**ngOnChanges / Input setter**

```typescript
export class ChildComponent implements OnChanges {
  @Input() data: unknown;
  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"]) {
      /* ... */
    }
  }
}

export class ChildComponent2 {
  private _user!: User;
  @Input() set user(value: User) {
    this._user = value;
    this.fullName = `${value.first} ${value.last}`;
  }
  fullName = "";
}
```

**DOM**

```typescript
@ViewChild("inputRef") inputRef!: ElementRef;
ngAfterViewInit() {
  this.inputRef.nativeElement.focus();
}
```

### 11. RxJS 연산자

자주 쓰는 것: `map`, `switchMap`, `mergeMap`, `concatMap`, `filter`, `take`/`takeUntil`, `catchError`, `debounceTime`, `combineLatest`.

- **switchMap**: 이전 내부 구독 취소 → 검색/라우트 param HTTP에 표준
- **mergeMap**: 병렬
- **concatMap**: 순차

import는 **`from "rxjs"`** (RxJS 7+).

```typescript
import { map, take, switchMap, filter, debounceTime, takeUntil, Subject, combineLatest } from "rxjs";

this.accountService.currentUser$
  .pipe(
    take(1),
    map((user) => user?.username)
  )
  .subscribe();

this.route.params
  .pipe(switchMap((params) => this.membersService.getMember(params["username"])))
  .subscribe((member) => (this.member = member));

this.searchControl.valueChanges
  .pipe(
    debounceTime(300),
    filter((text) => text.length > 2),
    switchMap((query) => this.searchService.search(query))
  )
  .subscribe((results) => (this.results = results));
```

`takeUntil` + `destroy$` 패턴도 유효하나, 신규 코드는 `takeUntilDestroyed` 권장.

### 12. Pipe (파이프)

- 템플릿 표시 변환. 내장 `date`, `async`, `uppercase` + 커스텀.
- **기본은 pure: true** (입력 참조가 바뀔 때만 재실행).
- **`pure: false`**: 참조는 같은데 내부 mutate를 반영해야 하는 등 **특수 케이스**. 비용 큰 변환을 false로 두면 오히려 성능 악화 → 컴포넌트/`computed`로 계산.
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
    // 생년월일 → 나이
    return 0;
  }
}
```

### 13. Testing (테스팅)

| 도구 | 용도 |
| --- | --- |
| Jasmine / Jest | 단위·통합 |
| Karma (레거시 CLI 기본) / Jest | 러너 |
| Cypress / Playwright | E2E |
| `ng test` | 단위 실행 |

`ng e2e` / Protractor는 **사실상 폐기**. E2E는 Cypress/Playwright를 직접 구성.

**컴포넌트**

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MemberEditComponent } from "./member-edit.component";

describe("MemberEditComponent", () => {
  let component: MemberEditComponent;
  let fixture: ComponentFixture<MemberEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberEditComponent], // standalone: imports: [MemberEditComponent]
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

**서비스**

```typescript
import { TestBed } from "@angular/core/testing";
import { AccountService } from "./account.service";

describe("AccountService", () => {
  let service: AccountService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountService);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
```

**Cypress E2E**

```javascript
describe("회원가입 플로우", () => {
  it("회원가입이 성공적으로 완료된다", () => {
    cy.visit("/register");
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("Test1234!");
    cy.get('button[type="submit"]').click();
    cy.contains("회원가입이 완료되었습니다").should("be.visible");
  });
});
```

### 14. 고급 Angular 개념 및 실전 팁

- **Zone-less**: zone.js 없이 Signal 등으로 갱신 → 성능 여지
- **SSR / Hydration / SSG**: [SSR 가이드](https://angular.dev/guide/ssr)
- **환경·빌드**: `environment` + `ng build --configuration production`
- **HTTP 고급**: Interceptor, Retry, 캐시, 전역 ErrorHandler

#### @ViewChild / @ContentChild

```typescript
@ViewChild("inputRef") inputRef!: ElementRef;
ngAfterViewInit() {
  this.inputRef.nativeElement.focus();
}

@ContentChild("projected") projected!: ElementRef;
ngAfterContentInit() {
  // 부모가 ng-content로 넘긴 #projected
}
```

```html
<app-card><span #projected>내용</span></app-card>
```

17+ 대안: `viewChild()`, `contentChild()`.

#### @HostBinding / @HostListener

템플릿 `(click)`이 기본. HostListener는 host/window 등 특수 케이스·디렉티브에.

```typescript
@HostBinding("class.active") isActive = true;
@HostListener("window:beforeunload", ["$event"])
unloadHandler(e: BeforeUnloadEvent) {
  /* ... */
}
```

#### ng-content

```html
<!-- 자식 -->
<div class="card"><ng-content></ng-content></div>
<!-- 부모 -->
<app-card>여기에 들어갈 내용</app-card>
```

#### Signal (17+)

로컬·동기 UI 상태·`computed`/`effect`. 비동기 스트림은 RxJS. `toSignal` / `toObservable`로 연동.  
요약·선택 기준은 [§18](#18-angular-17-요약-체크리스트) 참고.

```typescript
import { signal, computed, effect } from "@angular/core";

const count = signal(0);
const double = computed(() => count() * 2);
effect(() => console.log(count()));
count.set(1);
```

#### TypeScript getter

```typescript
get unreadCount(): number {
  return this.messages ? this.messages.filter((m) => !m.dateRead).length : 0;
}
// {{ unreadCount }} — 템플릿에서 자주 부르면 비용 주의. 파생값은 computed/시그널 고려
```

### 15. Performance Improvement (성능 최적화)

병목이 보일 때 조합: OnPush, track/`trackBy`, Lazy load, Preload, Pure Pipe, Virtual Scroll, Web Worker.

**Production build**

```bash
ng build --configuration production
```

**OnPush**

기본 CD보다 검사 범위를 줄입니다. 보통 **`@Input` 참조 변경**, 템플릿 이벤트, `| async` / Signal 갱신, 또는 `ChangeDetectorRef.markForCheck()`일 때 해당 트리를 갱신합니다.

```typescript
@Component({
  selector: "app-users",
  templateUrl: "./users.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  @Input() users: User[] = [];
}
```

**track / trackBy**

```html
<li *ngFor="let item of items; trackBy: trackById">...</li>
```

```html
@for (item of items; track item.id) {
  <li>...</li>
}
```

**Lazy + Preload**

```typescript
{
  path: "admin",
  loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule), // 레거시
}
// 또는 loadComponent: () => import("./admin/...").then(m => m.AdminComponent)

RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });
// standalone: provideRouter(routes, withPreloading(PreloadAllModules))
```

**Virtual Scroll**

```html
<cdk-virtual-scroll-viewport itemSize="50" style="height: 400px">
  <div *cdkVirtualFor="let item of items">{{ item }}</div>
</cdk-virtual-scroll-viewport>
```

**Web Worker**: 무거운 CPU 작업을 메인 스레드에서 분리 (`ng generate web-worker`).

### 16. Angular 데코레이터 개념 및 예시

메타데이터로 Angular가 클래스 역할을 인식.

| 데코레이터 | 용도 | 대안(17+) |
| --- | --- | --- |
| `@Component` | 컴포넌트 | — |
| `@Injectable` | 서비스 | — |
| `@Directive` / `@Pipe` | 디렉티브/파이프 | — |
| `@Input` / `@Output` | 입·출력 | `input()` / `output()` / `model()` |
| `@ViewChild` 등 | 쿼리 | `viewChild()` / `contentChild()` |

```typescript
@Component({
  selector: "app-member-edit",
  templateUrl: "./member-edit.component.html",
  styleUrl: "./member-edit.component.css",
})
export class MemberEditComponent {}

@Injectable({ providedIn: "root" })
export class AccountService {}

@Directive({ selector: "[appHasRole]" })
export class HasRoleDirective {}
```

### 17. Angular 상태 관리: 서비스+RxJS vs NgRx/NGXS/Akita

#### 서비스 + RxJS

```typescript
@Injectable({ providedIn: "root" })
export class AccountService {
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  setCurrentUser(user: User | null) {
    this.currentUserSource.next(user);
  }
}
```

- **장점**: 러닝커브 낮음, 중소규모에 충분  
- **단점**: 상태 증가 시 복잡도, DevTools/Time Travel 약함

#### NgRx / NGXS / Akita

단방향 흐름, DevTools, 대규모 협업에 강점. 소규모에는 오버엔지니어링.  
**Akita**는 선택·레거시 성격이 커진 편 — 신규는 NgRx 또는 서비스+Signal/RxJS를 먼저 검토.

```typescript
export const login = createAction("[Auth] Login", props<{ user: User }>());
// reducer + select + dispatch ...
```

#### 선택 가이드

- 중소·단순 → 서비스+RxJS (+ Signal for UI)
- 대규모·공유 상태·디버깅 → NgRx 등

**난이도(대략)**: 서비스+RxJS &lt; NGXS ≈ Akita &lt; NgRx

참고: [NgRx](https://ngrx.io/) · [NGXS](https://www.ngxs.io/) · [Akita](https://datorama.github.io/akita/) (선택)

### 18. Angular 17+ 요약 체크리스트

상세 예시는 §14(Signal·쿼리)·§1(standalone)·§9(함수형 라우팅)를 보세요. 여기선 **체크만**.

| 항목 | 권장 |
| --- | --- |
| Signal | 동기 UI · `computed` / `effect` · `input()`/`output()` |
| RxJS | HTTP·이벤트 스트림 · `toSignal`/`toObservable`로 연결 |
| Standalone | `bootstrapApplication` + `provideRouter` / `provideHttpClient` |
| Control flow | `@if` / `@for (item of items; track …)` — **`let` 없음** |
| 함수형 API | Guard · Interceptor · Resolve |
| 구독 | `\| async` / `takeUntilDestroyed` |
| 템플릿 이전 | 신규 `@if`/`@for`, 기존 `*ngIf` 점진 이전 |
| 성능 | 측정 후 OnPush · track · Virtualize · Lazy |
| HTTP 층 | Interceptor(클라이언트) ≠ 서버 middleware |
| 상태 | 단순 → 서비스+RxJS/Signal / 복잡 → NgRx |

```html
@if (isLoading) {
  <div>로딩 중...</div>
} @for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```

#### Signal vs RxJS (한눈에)

| 구분 | Signal | RxJS |
| --- | --- | --- |
| 동기 UI 상태 | 적합 | 가능하나 무거울 수 있음 |
| 비동기 스트림 | interop로 연결 | 적합 |
| 연산자 파이프라인 | 없음 | 풍부 |

### 19. DatingApp 실전 패턴

이 앱에서 자주 나오는 **도메인 패턴**. 치트시트 요약은 [GUIDE §17](./ANGULAR_GUIDE.md#17-datingapp-실전-짧은-매핑).

#### 19-1. SignalR (Presence / Messages)

- **경로**: `src/app/_services/presence.service.ts`, `message.service.ts`
- **연결 시점**: `account.service` `setCurrentUser` → `createHubConnection`, `logout` → `stopHubConnection`
- **설정**: `environment.hubUrl`

```typescript
// presence.service.ts (요지)
this.hubConnection = new HubConnectionBuilder()
  .withUrl(this.hubUrl + "presence", {
    accessTokenFactory: () => user.token,
  })
  .withAutomaticReconnect()
  .build();

this.hubConnection.start().catch((error) => console.log(error));
this.hubConnection.on("UserIsOnline", (userName) => {
  /* onlineUsers$ 갱신 */
});
```

채팅은 `message.service`에서 상대 유저별 Hub (`createHubConnection(user, otherUsername)`). UI 회로(Blazor Server)와 달리 **앱 실시간 Hub**다.

#### 19-2. CanDeactivate / 미저장 이탈

- **경로**: `src/app/_guards/prevent-unsaved-changes.guard.ts`
- **등록**: `app-routing.module.ts` — member edit 등에 `canDeactivate: [preventUnsavedChangesGuard]`

```typescript
import { CanDeactivateFn } from "@angular/router";
import { MemberEditComponent } from "../members/member-edit/member-edit.component";

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (
  component
) => {
  if (component.editForm?.dirty) {
    return confirm(
      "Are you sure you want to continue? Any unsaved changes will be lost"
    );
  }
  return true;
};
```

#### 19-3. ControlValueAccessor (커스텀 폼 컨트롤)

- **경로**: `src/app/_forms/text-input/`, `date-picker/`
- Reactive Forms의 `formControlName`에 커스텀 컴포넌트를 붙일 때 사용.

```typescript
// text-input.component.ts
@Component({
  selector: "app-text-input",
  templateUrl: "./text-input.component.html",
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label = "";
  @Input() type = "text";

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: unknown): void {}
  registerOnChange(fn: unknown): void {}
  registerOnTouched(fn: unknown): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
```

```html
<!-- 사용 -->
<app-text-input [formControl]="..." label="Username" />
<!-- 또는 부모 FormGroup 안에서 formControlName -->
```

#### 19-4. 페이지네이션

- **경로**: `src/app/_services/paginationHelper.ts`, `_models/pagination.ts`
- **사용처**: `members.service`, `message.service` → 리스트/메시지/즐겨찾기 컴포넌트
- API가 **본문 + `Pagination` 응답 헤더**를 내려주는 패턴.

```typescript
export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();
  params = params.append("pageNumber", pageNumber);
  params = params.append("pageSize", pageSize);
  return params;
}

export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  return http.get<T>(url, { observe: "response", params }).pipe(
    map((response) => {
      if (response.body) paginatedResult.result = response.body;
      const pagination = response.headers.get("Pagination");
      if (pagination) paginatedResult.pagination = JSON.parse(pagination);
      return paginatedResult;
    })
  );
}
```

#### 19-5. 로딩 UX (Busy + Spinner)

- **경로**: `_services/busy.service.ts`, `_interceptors/loading.interceptor.ts`
- **UI**: `app.component.html`의 `<ngx-spinner>`
- Interceptor가 요청마다 `busy()` / `finalize` → `idle()`.

```typescript
// loading.interceptor.ts (요지)
this.busyService.busy();
return next.handle(req).pipe(
  environment.production ? identity : delay(1000), // 개발 시 스피너 확인용
  finalize(() => this.busyService.idle())
);
```

```typescript
// busy.service.ts — 동시 요청 카운트
busy() {
  this.busyRequestCount++;
  this.spinnerService.show(/* ... */);
}
idle() {
  this.busyRequestCount--;
  if (this.busyRequestCount <= 0) {
    this.busyRequestCount = 0;
    this.spinnerService.hide();
  }
}
```

#### 19-6. 에러 UX (Interceptor + 에러 페이지)

- **경로**: `_interceptors/error.interceptor.ts`
- **페이지**: `errors/not-found`, `errors/server-error`, `errors/test-error`
- **토스트**: `ngx-toastr`

| HTTP | 처리 |
| --- | --- |
| 400 | validation 배열 throw 또는 toastr |
| 401 | toastr Unauthorised |
| 404 | `navigateByUrl('/not-found')` |
| 500 | `navigateByUrl('/server-error', { state: { error } })` |

```typescript
// error.interceptor.ts (요지)
return next.handle(request).pipe(
  catchError((error) => {
    switch (error.status) {
      case 404:
        this.router.navigateByUrl("/not-found");
        break;
      case 500:
        this.router.navigateByUrl("/server-error", {
          state: { error: error.error },
        });
        break;
      // 400 / 401 / default → toastr 등
    }
    throw error;
  })
);
```

#### 19-7. 앱 시작 시 유저 복원

- **경로**: `app.component.ts` → `account.service.setCurrentUser`
- 새로고침 후에도 `localStorage`의 user로 BehaviorSubject·**Presence Hub**를 다시 붙임. 만료 토큰이면 `logout`.

```typescript
// app.component.ts
ngOnInit(): void {
  this.setCurrentUser();
}
setCurrentUser() {
  const userString = localStorage.getItem("user");
  if (!userString) return;
  try {
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  } catch {
    localStorage.removeItem("user");
  }
}
```

```typescript
// account.service setCurrentUser (요지)
localStorage.setItem("user", JSON.stringify(user));
this.currentUserSource.next(user);
this.presenceService.createHubConnection(user);
```

#### 19-8. 모달 (ngx-bootstrap)

- **경로**: `modals/roles-modal`, `modals/user-edit-modal`
- **호출**: `admin/user-management/user-management.component.ts`
- `BsModalService.show` + `initialState`로 입력, 콜백으로 목록 갱신.

```typescript
openEditUserModal(user: User) {
  const config = {
    class: "modal-dialog-centered",
    initialState: {
      userName: user.userName,
      knownAs: user.knownAs,
      onUserUpdated: () => this.getUsersWithRoles(),
    },
  };
  this.bsModalRef = this.modalService.show(UserEditModalComponent, config);
}
```

모달 컴포넌트는 `BsModalRef`로 닫고, `initialState` 필드를 `@Input`처럼 사용.

---

## 참고 자료

- [Angular 문서](https://angular.dev/)
- [Signals](https://angular.dev/guide/signals)
- [Standalone / importing](https://angular.dev/guide/components/importing)
- [Control flow](https://angular.dev/guide/templates/control-flow)
- [SSR / Hydration](https://angular.dev/guide/ssr)
- [HTTP](https://angular.dev/guide/http)
- [Router](https://angular.dev/guide/routing)
- [스타일 가이드](https://angular.dev/style-guide)
- [RxJS](https://rxjs.dev/)
- [NgRx](https://ngrx.io/)
- [업데이트 가이드](https://update.angular.io/)
- [치트시트 (이 레포)](./ANGULAR_GUIDE.md)
