# 목차 (Table of Contents)

- [폴더 구조](#폴더-구조-clientsrcapp)
- [Angular 핵심 개념](#angular-핵심-개념)
- [실전 팁](#실전-팁)
- [참고 자료](#참고-자료)
- [Angular 주요 개념 ↔️ 실제 코드 예시 매핑](#angular-주요-개념-️-실제-코드-예시-매핑)
  - [1. Component (컴포넌트)](#1-component-컴포넌트)
  - [2. Service & Dependency Injection](#2-service--dependency-injection)
  - [3. BehaviorSubject/Observable](#3-behaviorsubjectobservable)
  - [4. Data Binding (데이터-바인딩)](#4-data-binding-데이터-바인딩)
  - [5. Directive](#5-directive)
  - [6. Form (Reactive)](#6-form-reactive)
  - [7. Input/Output & EventEmitter](#7-inputoutput--eventemitter)
  - [8. Interceptor](#8-interceptor)
  - [9. Routing & Guards](#9-routing--guards)
  - [10. Lifecycle Hooks (생명주기 훅)](#10-lifecycle-hooks-생명주기-훅)
  - [11. RxJS 연산자](#11-rxjs-연산자)
  - [12. Pipe (파이프)](#12-pipe-파이프)
  - [13. Testing (테스팅)](#13-testing-테스팅)
  - [14. Performance Improvement (성능-최적화)](#14-performance-improvement-성능-최적화)
  - [15. 고급 Angular 개념 및 실전 팁](#15-고급-angular-개념-및-실전-팁)
  - [16. Angular 데코레이터 개념 및 예시](#16-angular-데코레이터-개념-및-예시)
  - [17. RxJS/폼/테스트의 추가 예시](#17-rxjs폼테스트의-추가-예시)
  - [각 섹션별 실전 시나리오 & 공식 문서 링크](#각-섹션별-실전-시나리오--공식-문서-링크)

## 폴더 구조 (client/src/app)

- **\_models/**: 프론트엔드 데이터 타입/모델 정의 (TypeScript interface/class)
- **members/**: 회원 목록, 상세, 수정 등 회원 관련 컴포넌트
- **admin/**: 관리자 패널, 역할/회원정보 관리, 모달 등
- **modals/**: 재사용 가능한 모달 컴포넌트 (예: 역할/회원정보 수정)
- **\_forms/**: 커스텀 폼 컴포넌트 (예: TextInput, DatePicker)
- **\_interceptors/**: HTTP 요청/응답 가로채기(로딩, 에러, JWT 등)

## Angular 핵심 개념

- **컴포넌트(Component)**: UI의 기본 단위. 템플릿(HTML) + 로직(TypeScript) + 스타일(CSS)로 구성
- **모듈(Module)**: 관련 컴포넌트/서비스/디렉티브/파이프를 묶는 단위. 루트 모듈(AppModule)과 기능별 모듈
- **라우팅(Routing)**: URL 경로에 따라 컴포넌트 전환. `app-routing.module.ts`에서 정의
- **폼(Form)**: Reactive Forms(주로 사용)과 Template-driven Forms. FormGroup, FormControl, Validator 등 활용

## 실전 팁

- **상태 관리**: 간단한 앱은 서비스+RxJS로 충분, 대규모는 NgRx 등 사용 고려
- **API 통신**: HttpClient + Observable 패턴, 구독(unsubscribe) 관리 주의
- **컴포넌트 간 통신**: @Input/@Output, 서비스 공유, RxJS Subject 등
- **폼 유효성 검사**: 커스텀 Validator, 실시간 체크, 에러 메시지 표시
- **전역 에러/로딩 처리**: 인터셉터로 일괄 처리
- **모듈화/재사용**: 공통 컴포넌트, 모듈, 서비스로 분리

## 참고 자료

- [Angular 공식 문서](https://angular.kr/)
- [RxJS 공식 문서](https://rxjs.dev/)
- [Angular 스타일 가이드](https://angular.io/guide/styleguide)
- [Tour of Heroes 튜토리얼](https://angular.kr/tutorial)

---

## Angular 주요 개념 ↔️ 실제 코드 예시 매핑

### 1. Component (컴포넌트)

- **개념**: UI의 기본 단위, @Component 데코레이터, 클래스+템플릿+스타일
- **실전 팁**: 컴포넌트는 최대한 작고 단일 책임 원칙에 맞게 분리하면 유지보수와 테스트가 쉬워집니다.
- **실제 코드**:  
  `src/app/members/member-edit/member-edit.component.ts`
  ```typescript
  import { Component, OnInit } from "@angular/core";
  @Component({
    selector: "app-member-edit",
    templateUrl: "./member-edit.component.html",
    styleUrl: "./member-edit.component.css",
  })
  export class MemberEditComponent implements OnInit {
    // ...
  }
  ```

### 2. Service & Dependency Injection

- **개념**: 비즈니스 로직/상태 관리, DI로 주입
- **실전 팁**: 서비스는 싱글턴으로 동작하므로, 상태를 저장할 때는 여러 컴포넌트에서 동시에 접근할 수 있음을 유의하세요.
- **실제 코드**:  
  `src/app/_services/account.service.ts`
  ```typescript
  import { Injectable } from "@angular/core";
  import { BehaviorSubject } from "rxjs";
  @Injectable({ providedIn: "root" })
  export class AccountService {
    private currentUserSource = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSource.asObservable();
    // ...
  }
  ```

### 3. BehaviorSubject/Observable

- **개념**: Observable은 비동기 데이터 스트림, BehaviorSubject는 항상 최신값을 보장하며 상태 공유에 적합
- **실전 팁**: BehaviorSubject는 항상 마지막 값을 기억하므로, 초기값이 꼭 필요합니다. 구독 해제(takeUntil, async 파이프 등)를 신경써야 메모리 누수를 막을 수 있습니다.
- **실전 활용 예시**:
  - **전역 사용자 상태 관리**
    ```typescript
    import { BehaviorSubject } from 'rxjs';
    private currentUserSource = new BehaviorSubject<User | null>(null); // 상태 저장소
    currentUser$ = this.currentUserSource.asObservable(); // 외부에 읽기 전용으로 노출
    ```

### 4. Data Binding (데이터 바인딩)

- **개념**: 템플릿과 컴포넌트 간 데이터를 주고받는 다양한 바인딩 방식 (Property, Event, 양방향, Interpolation)
- **실전 팁**: [(ngModel)] 양방향 바인딩은 단순 폼에만 사용하고, 복잡한 폼은 Reactive Forms를 권장합니다.
- **실제 코드 예시**:
  - **Property Binding**
    ```html
    <img [src]="user.photoUrl" />
    ```
  - **Event Binding**
    ```html
    <button (click)="logout()">Logout</button>
    ```
  - **양방향 바인딩 (ngModel)**
    ```html
    <input [(ngModel)]="user.name" />
    ```
  - **String Interpolation**
    ```html
    <h1>{{ user.name }}</h1>
    ```

### 5. Directive

- **개념**: 구조/속성/커스텀 디렉티브
- **실전 팁**: 커스텀 디렉티브는 재사용성이 높은 UI 로직(권한, 포커스 등)에 적합합니다. 네이밍은 'app' 접두사를 붙여 충돌을 방지하세요.
- **실제 코드**:  
  `src/app/_directives/has-role.directive.ts`
  ```typescript
  import { Directive } from "@angular/core";
  @Directive({
    selector: "[appHasRole]",
  })
  export class HasRoleDirective {
    /* ... */
  }
  ```
  - **사용 예시**:
    ```html
    <button *appHasRole="'Admin'">관리자만 보임</button>
    ```

### 6. Form (Reactive)

- **개념**: FormGroup, FormControl, Validator 등 코드 기반 폼 구현. 복잡한 폼, 동적 폼, 고급 유효성 검사에 적합
- **실전 팁**: 실무에서는 Reactive Forms가 검증, 동적 폼, 복잡한 UI에 더 적합합니다. Template-driven은 간단한 입력에만 사용하세요.
- **실제 코드 예시**:
  ```typescript
  import { FormGroup, FormControl, Validators } from "@angular/forms";
  this.editForm = new FormGroup({
    name: new FormControl(this.user.name, Validators.required),
    email: new FormControl(this.user.email, [Validators.required, Validators.email]),
  });
  ```

### 7. Input/Output & EventEmitter

- **개념**: 부모→자식 데이터 전달, 자식→부모 이벤트 전달
- **실전 팁**: @Input/@Output은 단방향 데이터 흐름을 보장합니다. 복잡한 계층 구조에서는 서비스로 상태를 올려 관리하세요.
- **실제 코드**:  
  `src/app/members/member-card/member-card.component.ts`
  ```typescript
  import { Component, Input, Output, EventEmitter } from '@angular/core';
  @Input() member: Member;
  @Output() liked = new EventEmitter<number>();
  ```

### 8. Interceptor

- **개념**: HTTP 요청/응답 가로채기
- **실전 팁**: 모든 HTTP 요청에 공통 동작(로딩, 토큰, 에러 처리 등)을 적용할 때 Interceptor를 활용하세요. Interceptor는 providers 배열에 반드시 등록해야 동작합니다.
- **실제 코드**:  
  `src/app/_interceptors/loading.interceptor.ts`
  ```typescript
  import { Injectable } from "@angular/core";
  import { HttpInterceptor } from "@angular/common/http";
  @Injectable()
  export class LoadingInterceptor implements HttpInterceptor {
    /* ... */
  }
  ```

### 9. Routing & Guards

- **개념**: 라우팅, canActivate 등
- **실전 팁**: 라우트 가드는 인증/권한 체크, 데이터 프리패치 등에 활용합니다. 라우트 순서와 와일드카드 경로(\*\*) 위치에 주의하세요.
- **실제 코드**:  
  `src/app/app-routing.module.ts`
  ```typescript
  import { Routes } from "@angular/router";
  import { MemberListComponent } from "./members/member-list/member-list.component";
  import { AuthGuard } from "./_guards/auth.guard";
  const routes: Routes = [
    { path: "members", component: MemberListComponent, canActivate: [AuthGuard] },
    // ...
  ];
  ```

### 10. Lifecycle Hooks (생명주기 훅)

- **개념**: Angular 컴포넌트/디렉티브의 생성→렌더링→변경→파괴의 생명주기 단계별로 특정 메서드(ngOnInit, ngOnDestroy 등)를 오버라이드하여 동작 삽입
- **실전 팁**: ngOnDestroy에서 구독 해제/타이머 정리 등 리소스 관리를 철저히 해야 메모리 누수를 막을 수 있습니다. ngOnInit은 데이터 초기화, ngAfterViewInit은 뷰 접근에 활용하세요.
- **실제 코드 예시**:
  ```typescript
  ngOnInit() {
    // 데이터 초기화
  }
  ngOnDestroy() {
    // 구독 해제, 타이머 정리
  }
  ```

### 11. RxJS 연산자

- **개념**: Observable 스트림의 데이터 흐름을 변환, 필터링, 결합, 제어하는 함수형 도구 (map, filter, switchMap, takeUntil 등)
- **실전 팁**: 연산자는 반드시 import { map, switchMap, ... } from 'rxjs/operators' 또는 'rxjs'에서 개별적으로 import해야 합니다. takeUntil로 구독 해제를 습관화하세요.
- **실전 활용 예시**:
  - **map, take**: 값 변환 및 1회 구독
    ```typescript
    this.user$ = this.accountService.currentUser$.pipe(
      map((user) => user?.name),
      take(1)
    );
    ```
  - **switchMap**: HTTP 요청 체인
    ```typescript
    this.route.params.pipe(switchMap((params) => this.memberService.getMember(params["username"]))).subscribe((member) => (this.member = member));
    ```

### 12. Pipe (파이프)

- **개념**: 데이터를 템플릿에서 보기 좋게 변환(포맷팅)하는 기능. 내장 파이프(date, async 등)와 커스텀 파이프
- **실전 팁**: 커스텀 파이프는 순수 함수로 작성하고, 변환 비용이 큰 경우 pure: false 옵션을 고려하세요. 내장 파이프는 최대한 활용하고, 복잡한 로직은 컴포넌트에서 처리하세요.
- **실제 코드**:
  - **내장 파이프**
    ```html
    <span>{{ member.created | date:'yyyy-MM-dd' }}</span> <span>{{ member.name | uppercase }}</span>
    ```
  - **커스텀 파이프**: `src/app/_pipes/age.pipe.ts`
    ```typescript
    import { Pipe, PipeTransform } from "@angular/core";
    @Pipe({ name: "age" })
    export class AgePipe implements PipeTransform {
      transform(value: string | Date): number {
        /* ... */
      }
    }
    ```
    ```html
    <span>{{ member.birthDate | age }}</span>
    ```

### 13. Testing (테스팅)

- **왜 중요한가?**: Angular는 규모가 커질수록 컴포넌트, 서비스, 파이프, 디렉티브 등 다양한 단위의 테스트가 필수
- **실전 팁**: 테스트 파일은 \*.spec.ts로 작성하며, 서비스/컴포넌트별로 폴더 구조를 맞추면 유지보수가 쉽습니다. TestBed로 DI/모듈 환경을 세팅하세요.
- **테스트 종류**: Unit Test, Integration Test, E2E Test
- **실제 코드 예시**:
  - **컴포넌트 테스트**
    ```typescript
    import { ComponentFixture, TestBed } from "@angular/core/testing";
    import { MemberEditComponent } from "./member-edit.component";
    describe("MemberEditComponent", () => {
      let component: MemberEditComponent;
      let fixture: ComponentFixture<MemberEditComponent>;
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [MemberEditComponent],
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

### 14. Performance Improvement (성능 최적화)

- **개념**: Angular 앱의 렌더링, 데이터 처리, 네트워크 등 전반적인 성능을 높이기 위한 다양한 전략
- **실전 팁**: ChangeDetectionStrategy.OnPush, trackBy, Lazy Loading, Virtual Scrolling, Pure Pipe, Memoization, Web Worker, Preloading 등 다양한 기법을 상황에 맞게 조합하세요.
- **실제 코드**:
  - **ChangeDetectionStrategy.OnPush**
    ```typescript
    import { ChangeDetectionStrategy, Component } from '@angular/core';
    @Component({
      ...,
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class FastComponent {}
    ```
  - **trackBy**
    ```html
    <li *ngFor="let item of items; trackBy: trackById">...</li>
    ```
    ```typescript
    trackById(index: number, item: Item) { return item.id; }
    ```
  - **Lazy Loading**
    ```typescript
    const routes: Routes = [{ path: "admin", loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule) }];
    ```
  - **Virtual Scrolling**
    ```html
    <cdk-virtual-scroll-viewport itemSize="50" style="height: 400px">
      <div *cdkVirtualFor="let item of items">{{ item }}</div>
    </cdk-virtual-scroll-viewport>
    ```

### 15. 고급 Angular 개념 및 실전 팁

- **@ViewChild, @ContentChild**: 자식/프로젝션된 요소 접근
  ```typescript
  @ViewChild('inputRef') inputRef: ElementRef;
  ngAfterViewInit() {
    this.inputRef.nativeElement.focus();
  }
  @ContentChild('projected') projected: ElementRef;
  ngAfterContentInit() {
    // projected.nativeElement ...
  }
  ```
- **@HostBinding, @HostListener**: 호스트 요소 속성/이벤트 바인딩
  ```typescript
  @HostBinding('class.active') isActive = true;
  @HostListener('click') onClick() { /* ... */ }
  ```
- **ng-content (Content Projection)**
  ```html
  <div class="card">
    <ng-content></ng-content>
  </div>
  <app-card>여기에 들어갈 내용</app-card>
  ```
- **Signal (Angular 17+)**
  ```typescript
  import { signal, computed, effect } from "@angular/core";
  const count = signal(0);
  const double = computed(() => count() * 2);
  effect(() => console.log(count()));
  count.set(1);
  ```
- **State Management**: 소규모 앱은 서비스+BehaviorSubject/Observable, 대규모는 NgRx 등, Signal 기반도 확산 중
- **Performance Improvement**: OnPush, trackBy, Lazy Loading, Virtual Scrolling, Memoization, Web Worker 등
- **참고**: [ViewChild](https://angular.kr/api/core/ViewChild), [HostBinding/HostListener](https://angular.kr/api/core/HostBinding), [Signal](https://angular.dev/reference/signals), [NgRx](https://ngrx.io/)

### 16. Angular 데코레이터 개념 및 예시

- **개념**: 데코레이터는 클래스, 속성, 메서드, 파라미터 등에 메타데이터를 추가하는 TypeScript의 특수 문법입니다. Angular에서는 컴포넌트(@Component), 서비스(@Injectable), 디렉티브(@Directive), 입력/출력(@Input/@Output) 등 다양한 곳에 데코레이터를 사용하여 Angular 런타임이 해당 클래스를 어떻게 처리할지 정의합니다.

- **주요 데코레이터 종류 및 예시**:
  - `@Component`: 컴포넌트 정의
    ```typescript
    @Component({
      selector: "app-root",
      templateUrl: "./app.component.html",
      styleUrls: ["./app.component.css"],
    })
    export class AppComponent {}
    ```
  - `@Injectable`: 서비스/인터셉터 등에서 의존성 주입 가능하게 함
    ```typescript
    @Injectable({ providedIn: "root" })
    export class DataService {}
    ```
  - `@Input`, `@Output`: 부모-자식 컴포넌트 간 데이터/이벤트 전달
    ```typescript
    @Input() user: User;
    @Output() changed = new EventEmitter<string>();
    ```
  - `@Directive`: 커스텀 디렉티브 정의
    ```typescript
    @Directive({ selector: "[appHighlight]" })
    export class HighlightDirective {}
    ```

---

## 17. RxJS/폼/테스트의 추가 예시

### RxJS 연산자 추가 예시

- **combineLatest**: 여러 상태 동기화
  ```typescript
  combineLatest([this.userService.user$, this.settingsService.settings$]).subscribe(([user, settings]) => {
    // user와 settings 동기화 처리
  });
  ```
- **filter, debounceTime**: 실시간 검색
  ```typescript
  this.searchInput.valueChanges
    .pipe(
      filter((text) => text.length > 2),
      debounceTime(300)
    )
    .subscribe((search) => this.doSearch(search));
  ```

### Form (Reactive) 추가 예시

- **동적 폼/배열**
  ```typescript
  this.form = this.fb.group({
    emails: this.fb.array([
      this.fb.control('')
    ])
  });
  addEmail() {
    (this.form.get('emails') as FormArray).push(this.fb.control(''));
  }
  ```

### Testing 추가 예시

- **서비스 테스트**
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
- **E2E 테스트 (Cypress 예시)**
  ```javascript
  describe("Login flow", () => {
    it("should log in successfully", () => {
      cy.visit("/login");
      cy.get("input[name=email]").type("test@test.com");
      cy.get("input[name=password]").type("password");
      cy.get("button[type=submit]").click();
      cy.url().should("include", "/dashboard");
    });
  });
  ```

---

## 각 섹션별 실전 시나리오 & 공식 문서 링크

각 주요 개념별로 실전 활용 시나리오와 공식 문서 링크를 함께 제공합니다.

### Component

- **실전 시나리오**: 회원 정보 수정, 리스트 렌더링, 상세 페이지 등 UI 단위별로 컴포넌트 분리
- [공식 문서](https://angular.kr/guide/component-overview)

### Service & Dependency Injection

- **실전 시나리오**: 인증, 데이터 관리, API 통신, 상태 관리 등 비즈니스 로직 분리
- [공식 문서](https://angular.kr/guide/dependency-injection)

### BehaviorSubject/Observable

- **실전 시나리오**: 로그인 상태, 테마, 알림 등 전역 상태 관리, 실시간 데이터 스트림 처리
- [RxJS 공식 문서](https://rxjs.dev/guide/subject)

### Data Binding

- **실전 시나리오**: 폼 입력값 바인딩, 버튼 클릭 이벤트 처리, 실시간 UI 반영
- [공식 문서](https://angular.kr/guide/binding-syntax)

### Directive

- **실전 시나리오**: 권한 제어, 포커스, 스타일 동적 적용 등 재사용 UI 로직 구현
- [공식 문서](https://angular.kr/guide/attribute-directives)

### Form (Reactive)

- **실전 시나리오**: 회원가입, 정보 수정, 동적 폼 생성, 고급 유효성 검사
- [공식 문서](https://angular.kr/guide/reactive-forms)

### Input/Output & EventEmitter

- **실전 시나리오**: 부모→자식 데이터 전달, 자식→부모 이벤트 전달, 카드/리스트/모달 등 컴포넌트 통신
- [공식 문서](https://angular.kr/guide/component-interaction)

### Interceptor

- **실전 시나리오**: 모든 HTTP 요청에 토큰/로딩/에러 처리 적용, API 통신 일괄 관리
- [공식 문서](https://angular.kr/guide/http-interceptors)

### Routing & Guards

- **실전 시나리오**: 인증/권한 체크, 데이터 프리패치, 라우트별 접근 제어
- [공식 문서](https://angular.kr/guide/router)

### Lifecycle Hooks

- **실전 시나리오**: 데이터 초기화, 구독/타이머 해제, DOM 접근, 외부 변화 감지
- [공식 문서](https://angular.kr/guide/lifecycle-hooks)

### RxJS 연산자

- **실전 시나리오**: API 응답 처리, 실시간 검색, 상태 동기화, 이벤트 스트림 제어
- [RxJS 연산자 문서](https://rxjs.dev/guide/operators)

### Pipe

- **실전 시나리오**: 날짜/텍스트 포맷팅, 커스텀 변환 로직, 리스트/상세 데이터 표시
- [공식 문서](https://angular.kr/guide/pipes)

### Testing

- **실전 시나리오**: 컴포넌트/서비스/파이프/디렉티브 단위 테스트, E2E 테스트, 자동화 배포
- [공식 문서](https://angular.kr/guide/testing)

### Performance Improvement

- **실전 시나리오**: 대용량 리스트, 실시간 데이터, 모바일 최적화, 렌더링/네트워크 성능 개선
- [공식 문서](https://angular.kr/guide/performance)

### 고급 Angular 개념 및 실전 팁

- [ViewChild](https://angular.kr/api/core/ViewChild), [HostBinding/HostListener](https://angular.kr/api/core/HostBinding), [Signal](https://angular.dev/reference/signals), [NgRx](https://ngrx.io/)

---
