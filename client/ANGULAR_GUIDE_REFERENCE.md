# 목차 (Table of Contents)

- [폴더 구조](#폴더-구조-clientsrcapp)
- [Angular 핵심 개념](#angular-핵심-개념)
- [실전 팁](#실전-팁)
- [참고 자료](#참고-자료)
- [각 섹션별 실전 시나리오 & 공식 문서 링크](#각-섹션별-실전-시나리오--공식-문서-링크)
- [RxJS/폼/테스트의 추가 예시](#rxjs폼테스트의-추가-예시)
- [Angular 주요 개념 ↔️ 실제 코드 예시 매핑](#angular-주요-개념-️-실제-코드-예시-매핑)
  - [1. Component (컴포넌트)](#1-component-컴포넌트)
  - [1-1. Module (모듈)](#1-1-module-모듈)
  - [2. Service & Dependency Injection](#2-service--dependency-injection)
  - [3. BehaviorSubject/Observable](#3-behaviorsubjectobservable)
  - [4. Data Binding (데이터 바인딩)](#4-data-binding-데이터-바인딩)
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

# Angular 클라이언트 구조 및 주요 개념

> **이 문서는 Angular 17+ 기준의 최신 실전/실무 지식과 예시, 공식 스타일 가이드, 최신 API(예: Signal, Content Projection 등)까지 반영합니다.**
> 최신 Angular 공식 문서, 스타일 가이드, 실전 시나리오, 고급 기능(성능 최적화, RxJS, 테스트, 데코레이터 등)까지 모두 포함되어 있습니다.

## 폴더 구조 (client/src/app)

- **\_models/**: 프론트엔드 데이터 타입/모델 정의 (TypeScript interface/class)
- **members/**: 회원 목록, 상세, 수정 등 회원 관련 컴포넌트
- **admin/**: 관리자 패널, 역할/회원정보 관리, 모달 등
- **modals/**: 재사용 가능한 모달 컴포넌트 (예: 역할/회원정보 수정)
- **\_forms/**: 커스텀 폼 컴포넌트 (예: TextInput, DatePicker)
- **\_interceptors/**: HTTP 요청/응답 가로채기(로딩, 에러, JWT 등)

## Angular 핵심 개념

> **최신 Angular(17+) 기준의 개념과 실전 팁을 반영합니다.**

- **컴포넌트(Component)**: UI의 기본 단위. 템플릿(HTML) + 로직(TypeScript) + 스타일(CSS)로 구성
- **모듈(Module)**: 관련 컴포넌트/서비스/디렉티브/파이프를 묶는 단위. 루트 모듈(AppModule)과 기능별 모듈

  - [Angular 공식 모듈 가이드](https://angular.kr/guide/ngmodules)

- **라우팅(Routing)**: URL 경로에 따라 컴포넌트 전환. `app-routing.module.ts`에서 정의

  - [Angular 공식 라우팅 가이드](https://angular.kr/guide/router)

- **폼(Form)**: Reactive Forms(주로 사용)과 Template-driven Forms. FormGroup, FormControl, Validator 등 활용

  - [Angular 공식 폼 가이드](https://angular.kr/guide/forms-overview)

## 실전 팁

> **Angular 17+ 실무에서 자주 쓰는 최신 실전 팁과 패턴을 정리했습니다.**

- **상태 관리**: 간단한 앱은 서비스+RxJS로 충분, 대규모는 NgRx 등 사용 고려

  - [최신 상태 관리: Signal, NgRx, RxJS 공식 문서](https://angular.dev/reference/signals), [NgRx](https://ngrx.io/)

- **API 통신**: HttpClient + Observable 패턴, 구독(unsubscribe) 관리 주의

  - [Angular 공식 HttpClient 가이드](https://angular.kr/guide/http)

- **컴포넌트 간 통신**: @Input/@Output, 서비스 공유, RxJS Subject 등

  - [최신 컴포넌트 통신 공식 가이드](https://angular.kr/guide/component-interaction)

- **폼 유효성 검사**: 커스텀 Validator, 실시간 체크, 에러 메시지 표시

  - [Reactive Forms 공식 가이드](https://angular.kr/guide/reactive-forms)

- **전역 에러/로딩 처리**: 인터셉터로 일괄 처리

  - [Http Interceptor 공식 가이드](https://angular.kr/guide/http-interceptors)

- **모듈화/재사용**: 공통 컴포넌트, 모듈, 서비스로 분리

  - [Angular 스타일 가이드](https://angular.io/guide/styleguide)

## 참고 자료

- [Angular 공식 문서](https://angular.kr/)
- [RxJS 공식 문서](https://rxjs.dev/)
- [Angular 스타일 가이드](https://angular.io/guide/styleguide)
- [Tour of Heroes 튜토리얼](https://angular.kr/tutorial)

## Angular 주요 개념 ↔️ 실제 코드 예시 매핑

> **아래 예시들은 모두 Angular 17+ 기준의 최신 문법, 실전 패턴, 공식 스타일 가이드에 맞춰 작성되었습니다.**

### 1. Component (컴포넌트)

- **개념**: UI의 기본 단위, @Component 데코레이터, 클래스+템플릿+스타일
- **실전 팁**: 컴포넌트는 최대한 작고 단일 책임 원칙에 맞게 분리하면 유지보수와 테스트가 쉬워집니다.
- **실제 코드**:  
  `src/app/members/member-edit/member-edit.component.ts`
  - **시나리오**: "회원 정보 수정" 화면에서 사용자의 프로필 정보를 보여주고 수정할 수 있는 UI를 구현할 때 사용합니다.
  ```typescript
  import { Component, OnInit } from "@angular/core";
  @Component({
    selector: "app-member-edit",
    templateUrl: "./member-edit.component.html",
    styleUrl: "./member-edit.component.css",
  })
  export class MemberEditComponent implements OnInit {
  ```

### 1-1. Module (모듈)

> **Angular 17+ 기준의 모듈 구조, Lazy Loading, Standalone Component 등 최신 트렌드 반영**

- **개념**: 관련 컴포넌트, 서비스, 디렉티브, 파이프를 하나의 단위로 묶어 관리하는 Angular의 핵심 구조입니다. 루트 모듈(AppModule)과 기능별 모듈(Feature Module)로 나뉩니다.
- **실전 팁**: 기능별로 모듈을 분리하면 코드 관리와 Lazy Loading이 쉬워집니다. 공통 모듈(CommonModule), 공유 모듈(SharedModule) 패턴을 활용하세요.
- **실제 코드**:  
  `src/app/app.module.ts`
  ```typescript
  import { NgModule } from "@angular/core";
  import { BrowserModule } from "@angular/platform-browser";
  import { AppComponent } from "./app.component";
  import { MemberListComponent } from "./members/member-list/member-list.component";
  @NgModule({
    declarations: [AppComponent, MemberListComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent],
  })
  export class AppModule {}
  ```

### 2. Service & Dependency Injection

- **개념**: 비즈니스 로직/상태 관리, DI로 주입
- **실전 팁**: 서비스는 싱글턴으로 동작하므로, 상태를 저장할 때는 여러 컴포넌트에서 동시에 접근할 수 있음을 유의하세요.
- **실제 코드**:  
  `src/app/_services/account.service.ts`

  - **시나리오**: 로그인/로그아웃, 회원가입 등 인증 상태를 전역에서 관리할 때 AccountService를 DI로 주입해 사용합니다.

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

  import { AccountService } from './\_services/account.service';
  constructor(private accountService: AccountService) {}

  ```

  ```

### 3. BehaviorSubject/Observable

- **개념**:

  - **Observable**은 Angular에서 비동기 데이터(HTTP 응답, 이벤트, 상태 등)를 스트림 형태로 다루는 핵심 개념입니다. RxJS의 Observable은 구독(subscribe) 방식으로 데이터를 전달하며, 여러 연산자(map, filter, switchMap 등)로 데이터 흐름을 조작할 수 있습니다.
  - **BehaviorSubject**는 RxJS의 Subject 중 하나로, 구독 시 항상 최신 값을 즉시 전달(초기값 필수)하며, 여러 컴포넌트/서비스 간 상태 공유에 자주 사용됩니다. next()로 값을 변경하고, asObservable()로 외부에 읽기 전용 스트림을 제공합니다.

- **실전 팁**: BehaviorSubject는 항상 마지막 값을 기억하므로, 초기값이 꼭 필요합니다. 구독 해제(takeUntil, async 파이프 등)를 신경써야 메모리 누수를 막을 수 있습니다.

- **실전 활용 예시**:

  - **전역 사용자 상태 관리**
    `src/app/_services/account.service.ts`

    - **시나리오**: 로그인 상태, 테마, 알림 등 여러 컴포넌트에서 동시에 참조해야 하는 전역 상태를 관리할 때 사용합니다.

    ```typescript
    import { BehaviorSubject } from 'rxjs';
    private currentUserSource = new BehaviorSubject<User | null>(null); // 상태 저장소
    currentUser$ = this.currentUserSource.asObservable(); // 외부에 읽기 전용으로 노출

    // 로그인 시 상태 변경
    login(model: any) {
      return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
        map((response: User) => {
          const user = response;
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user); // 상태 emit
          }
        })
      );
    }
    ```

  - **컴포넌트에서 구독 및 활용**
    `src/app/nav/nav.component.ts`

    - **시나리오**: 네비게이션 바에서 로그인한 사용자의 정보를 실시간으로 표시할 때 사용합니다.

    ```typescript
    import { Observable } from 'rxjs';
    // 예: 로그아웃 시 상태 초기화
    currentUser$: Observable<User | null>;

    constructor(public accountService: AccountService) {
      this.currentUser$ = this.accountService.currentUser$; // async 파이프로 구독
    }
    ```

    `src/app/nav/nav.component.html`

    ```html
    <span *ngIf="(currentUser$ | async) as user">{{ user.username }} 님</span>
    ```

  - **다른 예: 상태 기반 UI 제어**
    ```typescript
    // 서비스에서 상태 변경
    this.currentUserSource.next(null); // 로그아웃 시
    // 컴포넌트에서 구독하여 UI 반영
    this.accountService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
    ```

- **팁**:
  - BehaviorSubject는 항상 최신값을 보장하므로, 로그인/로그아웃, 테마, 알림 등 전역 상태 관리에 적합합니다.
  - 메모리 누수 방지를 위해 컴포넌트에서 구독 시 take(1), takeUntil, async 파이프 등을 활용하세요.

### 4. Data Binding (데이터 바인딩)

> **최신 Angular에서는 Standalone Component, Signal 기반 바인딩 등도 지원합니다.**

- **개념**: Angular는 템플릿과 컴포넌트 간 데이터를 주고받는 다양한 바인딩 방식을 제공합니다.

  - **Property Binding**: `[property]="expression"` → 컴포넌트 → 뷰
  - **Event Binding**: `(event)="handler()"` → 뷰 → 컴포넌트
  - **양방향 바인딩**: `[(ngModel)]="property"` → 양방향(뷰와 모델 동기화)
  - **String Interpolation**: `{{ expression }}` → 텍스트 삽입

- **실전 팁**: [(ngModel)] 양방향 바인딩은 단순 폼에만 사용하고, 복잡한 폼은 Reactive Forms를 권장합니다.

- **실제 코드 예시**:

  - **Property Binding**
    ```html
    <!-- 시나리오: 프로필 사진, 버튼 활성화 등 UI 요소를 동적으로 제어할 때 사용 -->
    <img [src]="member.photoUrl" alt="프로필" /> <button [disabled]="!editForm?.dirty">저장</button>
    ```
  - **Event Binding**
    ```html
    <!-- 시나리오: 버튼 클릭, 입력값 변경 등 사용자 이벤트를 처리할 때 사용 -->
    <button (click)="updateMember()">Save</button> <input (input)="onInputChange($event)" />
    ```
  - **양방향 바인딩 (ngModel)**
    ```html
    <!-- 시나리오: 폼 입력값과 모델을 양방향으로 동기화할 때 사용 -->
    <input type="text" [(ngModel)]="member.introduction" /> <input type="checkbox" [(ngModel)]="member.isActive" />
    ```
    ```typescript
    // 컴포넌트에서
    member = { introduction: "", isActive: false };
    ```
  - **String Interpolation**
    ```html
    <!-- 시나리오: 사용자 이름, 상태 메시지 등 텍스트 데이터를 화면에 표시할 때 사용 -->
    <h2>{{ member.username }}님의 프로필</h2>
    <span *ngIf="editForm?.pristine">수정사항 없음</span>
    ```

- **팁**:
  - ngModel을 사용하려면 FormsModule을 import해야 합니다.
  - 복잡한 폼은 Reactive Forms(FormGroup, FormControl)와 함께 바인딩을 활용하세요.

### 5. Directive

- **개념**: 구조/속성/커스텀 디렉티브
- **실전 팁**: 커스텀 디렉티브는 재사용성이 높은 UI 로직(권한, 포커스 등)에 적합합니다. 네이밍은 'app' 접두사를 붙여 충돌을 방지하세요.
- **실제 코드**:  
  `src/app/_directives/has-role.directive.ts`
  ```typescript
  import { Directive } from '@angular/core';
  @Directive({
    selector: '[appHasRole]'
  })
  export class HasRoleDirective { ... }
  ```
  - **시나리오**: 관리자 권한이 있는 사용자만 특정 버튼을 볼 수 있게 할 때 등, DOM을 동적으로 제어할 때 사용합니다.
    사용 예시:
  ```html
  <button *appHasRole="'Admin'">관리자만 보임</button>
  ```

### 6. Form (Reactive)

> **Angular 17+ 기준의 Reactive Forms, FormArray, 커스텀 Validator, 비동기 Validator 등 최신 폼 패턴을 반영합니다.**

- **개념**:

  - Reactive Form은 Angular에서 가장 많이 쓰이는 폼 구현 방식입니다. FormGroup, FormControl, FormArray, Validator 등을 코드에서 명시적으로 생성/관리하며, 복잡한 폼 구조, 동적 폼, 고급 유효성 검사, 상태 추적 등에 매우 강력합니다.
  - Template-driven Form보다 테스트, 유지보수, 동적 폼 생성에 유리하며, 대규모/복잡한 폼에 권장됩니다.

- **실전 팁**: 실무에서는 Reactive Forms가 검증, 동적 폼, 복잡한 UI에 더 적합합니다. Template-driven은 간단한 입력에만 사용하세요.

- **실전 활용 예시**:

  - **회원 정보 수정 Reactive Form**
    `src/app/members/member-edit/member-edit.component.ts`

    - **시나리오**: 회원 정보 수정, 회원가입, 로그인 등 복잡한 폼 유효성 검사와 동적 폼 구조가 필요한 화면에서 사용합니다.

    ```typescript
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';

    export class MemberEditComponent implements OnInit {
      editForm: FormGroup;

      constructor(private fb: FormBuilder, private membersService: MembersService) {}

      ngOnInit() {
        this.editForm = this.fb.group({
          introduction: ['', [Validators.maxLength(200)]],
          isActive: [false],
          email: ['', [Validators.required, Validators.email]]
        });
        // 기존 데이터로 초기화
        this.editForm.patchValue({
          introduction: this.member.introduction,
          isActive: this.member.isActive,
          email: this.member.email
        });
      }

      updateMember() {
        if (this.editForm.invalid) return;
        this.membersService.updateMember(this.editForm.value).subscribe(...);
      }
    }
    ```

    `src/app/members/member-edit/member-edit.component.html`

    - **시나리오**: 사용자가 입력한 정보를 서버로 전송하기 전, 폼 유효성 검사를 수행하고, 에러 메시지를 실시간으로 보여줄 때 사용합니다.

    ```html
    <form [formGroup]="editForm" (ngSubmit)="updateMember()">
      <input formControlName="introduction" placeholder="소개" />
      <input type="checkbox" formControlName="isActive" />
      <input formControlName="email" type="email" />
      <div *ngIf="editForm.get('email')?.invalid && editForm.get('email')?.touched">이메일 형식이 올바르지 않습니다.</div>
      <button type="submit" [disabled]="editForm.invalid">저장</button>
    </form>
    ```

  - **동적 폼/배열 예시**
    ```typescript
    import { FormArray } from '@angular/forms';
    // 예: 사용자가 여러 개의 스킬을 동적으로 추가/삭제할 수 있는 폼 구현
    skills: FormArray = this.fb.array([]);
    addSkill() {
      this.skills.push(this.fb.control(''));
    }
    ```
    ```html
    <div formArrayName="skills">
      <div *ngFor="let skill of skills.controls; let i = index">
        <input [formControlName]="i" />
      </div>
      <button (click)="addSkill()">스킬 추가</button>
    </div>
    ```

- **팁**:
  - Reactive Form은 대규모/복잡한 폼, 동적 폼, 고급 유효성 검사, 상태 추적이 필요한 경우에 적극 추천됩니다.
  - Validators.compose, 커스텀 Validator, 비동기 Validator 등 다양한 유효성 검사 패턴을 지원합니다.
  - FormBuilder를 사용하면 폼 생성이 간결해집니다.
  - Template-driven Form(ngModel 기반)은 단순한 폼에만 사용하세요.

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
  import { Injectable } from '@angular/core';
  import { HttpInterceptor } from '@angular/common/http';
  @Injectable()
  export class LoadingInterceptor implements HttpInterceptor { ... }
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

- **개념**:

  - Angular 컴포넌트/디렉티브는 생성 → 렌더링 → 변경 → 파괴의 일련의 생명주기를 가집니다. 각 단계마다 특정 메서드(훅)를 오버라이드하여 원하는 동작을 삽입할 수 있습니다.
  - 대표 훅:
    - `ngOnInit`: 컴포넌트 초기화(입력값 준비 후, 1회 호출)
    - `ngOnDestroy`: 컴포넌트 파괴 직전(구독 해제, 리소스 정리)
    - `ngOnChanges`: @Input 값 변경 시마다
    - `ngAfterViewInit`: 뷰(자식 컴포넌트/DOM) 렌더링 완료 후

- **실전 팁**: ngOnDestroy에서 구독 해제/타이머 정리 등 리소스 관리를 철저히 해야 메모리 누수를 막을 수 있습니다. ngOnInit은 데이터 초기화, ngAfterViewInit은 뷰 접근에 활용하세요.

  - `ngAfterContentInit`: Content Projection 완료 후

- **언제, 왜 쓰나?**

  - 외부 데이터/서비스 초기화, @Input 값 반영, 구독/타이머/이벤트 리스너 해제, DOM 접근 등 컴포넌트의 수명에 맞춰 리소스 관리가 필요할 때 꼭 사용합니다.
  - 예시 상황:
    - API 데이터 최초 로딩 (ngOnInit)
    - 부모로부터 받은 @Input 값 변화 감지 (ngOnChanges)
    - setTimeout/setInterval, RxJS 구독 해제 (ngOnDestroy)
    - ViewChild/ElementRef로 DOM 접근 (ngAfterViewInit)

- **실제 코드 예시**:

  - **API 데이터 로딩 및 구독 해제**

    ```typescript
    // 시나리오: 컴포넌트가 생성될 때 API에서 데이터를 불러오고, 파괴될 때 구독을 해제하여 메모리 누수를 방지
    export class MemberEditComponent implements OnInit, OnDestroy {
      private subscription: Subscription;

      ngOnInit(): void {
        this.subscription = this.membersService.getMember().subscribe((member) => {
          this.member = member;
        });
      }

      ngOnDestroy(): void {
        this.subscription.unsubscribe(); // 메모리 누수 방지
      }
    }
    ```

  - **@Input 값 변화 감지**
    ```typescript
    // 시나리오: 부모 컴포넌트에서 전달받은 @Input 값이 변경될 때마다 특정 로직을 실행
    export class ChildComponent implements OnChanges {
      @Input() data: any;
      ngOnChanges(changes: SimpleChanges) {
        if (changes["data"]) {
          // 부모 데이터 변경 시 처리
        }
      }
    }
    ```
  - **DOM 접근**
    ```typescript
    // 시나리오: 뷰가 렌더링된 후 특정 DOM 요소에 포커스를 주거나, 외부 라이브러리와 연동할 때 사용
    export class ExampleComponent implements AfterViewInit {
      @ViewChild("inputRef") inputRef: ElementRef;
      ngAfterViewInit() {
        this.inputRef.nativeElement.focus();
      }
    }
    ```

- **팁**:
  - RxJS 구독, 타이머, 커스텀 이벤트 등은 반드시 ngOnDestroy에서 해제해야 메모리 누수를 막을 수 있습니다.
  - 단순 초기화는 ngOnInit, 외부 변화 감지는 ngOnChanges, DOM 조작은 ngAfterViewInit을 사용하세요.

### 11. RxJS 연산자

> **RxJS 7.x 최신 연산자, Angular 17+ Signal과의 연계 활용 등 최신 패턴을 포함합니다.**

- **개념**:

  - RxJS 연산자는 Observable 스트림의 데이터 흐름을 변환, 필터링, 결합, 제어하는 함수형 도구입니다. Angular에서 비동기 데이터 처리, 상태 관리, 이벤트 처리 등에 필수적으로 사용됩니다.
  - 자주 쓰는 연산자:
    - `map`: 값 변환
    - `switchMap`: 내부 Observable로 전환(주로 HTTP 요청 체인)
    - `filter`: 조건에 맞는 값만 통과
    - `take`, `takeUntil`: 구독 횟수/해제 제어
    - `catchError`: 에러 처리
    - `debounceTime`: 입력 지연(검색 등)
    - `combineLatest`, `withLatestFrom`: 여러 스트림 결합

- **실전 팁**: 연산자는 반드시 import { map, switchMap, ... } from 'rxjs/operators' 또는 'rxjs'에서 개별적으로 import해야 합니다. takeUntil로 구독 해제를 습관화하세요.

- **실전 활용 예시**:

  - **map, take**: 값 변환 및 1회 구독
    ```typescript
    import { map, take } from "rxjs";
    // 시나리오: 로그인한 사용자의 이름만 추출해 1회만 구독할 때 사용
    this.accountService.currentUser$
      .pipe(
        take(1),
        map((user) => user?.username)
      )
      .subscribe((username) => {
        /* ... */
      });
    ```
  - **switchMap**: HTTP 요청 체인
    ```typescript
    import { switchMap } from "rxjs";
    // 시나리오: URL 파라미터가 바뀔 때마다 해당 회원 정보를 API로 불러올 때 사용
    this.route.params.pipe(switchMap((params) => this.membersService.getMember(params["username"]))).subscribe((member) => (this.member = member));
    ```
  - **filter, debounceTime**: 실시간 검색
    ```typescript
    import { filter, debounceTime, switchMap } from "rxjs";
    // 시나리오: 검색창에 입력할 때마다 API 호출을 debounce하고, 2글자 이상일 때만 검색
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        filter((text) => text.length > 2),
        switchMap((query) => this.searchService.search(query))
      )
      .subscribe((results) => (this.results = results));
    ```
  - **takeUntil**: 컴포넌트 파괴 시 구독 해제
    ```typescript
    // 시나리오: 컴포넌트가 파괴될 때 자동으로 구독을 해제하여 메모리 누수 방지
    private destroy$ = new Subject<void>();
    ngOnInit() {
      this.accountService.currentUser$
        .pipe(takeUntil(this.destroy$))
        .subscribe(user => { /* ... */ });
    }
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
    ```
  - **combineLatest**: 여러 상태 동기화
    ```typescript
    // 시나리오: 여러 상태(예: 사용자 정보, 테마 설정 등)를 동시에 구독해 동기화할 때 사용
    combineLatest([this.accountService.currentUser$, this.settingsService.theme$]).subscribe(([user, theme]) => {
      // user와 theme 동시 활용
    });
    ```

- **팁**:
  - 연산자를 조합하면 복잡한 비동기 흐름도 선언적으로 처리할 수 있습니다.
  - switchMap은 이전 요청을 자동 취소하므로, 입력 기반 API 호출에 적합합니다.
  - takeUntil, async 파이프 등으로 구독 해제를 신경써야 메모리 누수를 막을 수 있습니다.

### 12. Pipe (파이프)

- **개념**: 데이터를 템플릿에서 보기 좋게 변환(포맷팅)하는 기능입니다. Angular 내장 파이프(date, async 등)와 직접 만드는 커스텀 파이프가 있습니다.
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
        // ...생년월일로 나이 계산 로직...
        return 0;
      }
    }
    ```
    ```html
    <span>{{ member.birthDate | age }}</span>
    ```

### 13. Testing (테스팅)

- **왜 중요한가?**

  - Angular는 규모가 커질수록 컴포넌트, 서비스, 파이프, 디렉티브 등 다양한 단위의 테스트가 필수입니다.
  - 테스트는 리팩터링, 버그 방지, 코드 품질 유지, CI/CD 자동화에 매우 중요합니다.

- **실전 팁**: 테스트 파일은 \*.spec.ts로 작성하며, 서비스/컴포넌트별로 폴더 구조를 맞추면 유지보수가 쉽습니다. TestBed로 DI/모듈 환경을 세팅하세요.

- **테스트 종류**

  - **Unit Test(단위 테스트)**: 컴포넌트/서비스/파이프 등 개별 단위의 동작 검증
  - **Integration Test(통합 테스트)**: 여러 단위가 함께 동작하는 흐름 검증
  - **E2E Test(엔드투엔드 테스트)**: 실제 브라우저 환경에서 전체 플로우 검증 (Cypress, Playwright 등)

- **Angular 테스트 도구**

  - **Jasmine**: 기본 테스트 프레임워크 (describe, it, expect)
  - **Karma**: 테스트 러너 (브라우저에서 테스트 실행)
  - **Jest**: 빠른 실행, 스냅샷 지원 (대체 가능)
  - **TestBed**: Angular 테스트 환경 구성 도구

- **실제 코드 예시**

  - **컴포넌트 테스트**

    - **시나리오**: 회원 정보 수정 화면의 컴포넌트가 정상적으로 생성되는지, 입력값에 따라 동작이 올바른지 검증
      `src/app/members/member-edit/member-edit.component.spec.ts`

    ```typescript
    import { ComponentFixture, TestBed } from "@angular/core/testing";
    import { MemberEditComponent } from "./member-edit.component";
    import { ComponentFixture, TestBed } from "@angular/core/testing";
    import { MemberEditComponent } from "./member-edit.component";

    describe("MemberEditComponent", () => {
      let component: MemberEditComponent;
      let fixture: ComponentFixture<MemberEditComponent>;

      beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [MemberEditComponent],
        }).compileComponents();
      });

      beforeEach(() => {
        fixture = TestBed.createComponent(MemberEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
    ```

  - **서비스 테스트**

    - **시나리오**: 인증 서비스가 정상적으로 생성되고, 로그인/로그아웃 등 메서드가 올바르게 동작하는지 검증

  - **E2E 테스트 (Cypress 예시)**

    - **시나리오**: 실제 브라우저 환경에서 회원가입 플로우가 정상 동작하는지 검증
      `cypress/e2e/register.cy.ts`

    ```javascript
    describe("회원가입 플로우", () => {
      it("회원가입이 성공적으로 완료된다", () => {
        cy.visit("/register");
        cy.get('input[name="username"]').type("testuser");
        cy.get('input[name="password"]').type("Test1234!");
        cy.get('input[name="confirmPassword"]').type("Test1234!");
        cy.get('button[type="submit"]').click();
        cy.contains("회원가입이 완료되었습니다").should("be.visible");
      });
    });
    ```

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

- **팁**:
  - Angular CLI로 `ng test` 실행 (Jest 사용 시 `npm run test`)
  - 테스트 커버리지를 높이면 리팩터링/배포가 훨씬 안전해집니다.
  - E2E 테스트는 별도 프레임워크(Cypress 등)로 관리

### 14. 고급 Angular 개념 및 실전 팁

> **Angular 17+의 Signal, Content Projection, Standalone Component, 최신 DI/데코레이터, 고급 성능 최적화 등 최신 고급 기능을 모두 다룹니다.**

#### @ViewChild, @ContentChild

- `@ViewChild`: 자식 컴포넌트, DOM 요소, 디렉티브 인스턴스에 직접 접근할 때 사용
  ```typescript
  @ViewChild('inputRef') inputRef: ElementRef;
  ngAfterViewInit() {
    this.inputRef.nativeElement.focus();
  }
  ```
- `@ContentChild`: 부모가 <ng-content>로 넘긴 projected content에 접근할 때 사용
  ```typescript
  @ContentChild('projected') projected: ElementRef;
  ngAfterContentInit() {
    // projected.nativeElement ...
  }
  ```

#### @HostBinding, @HostListener

- `@HostBinding`: 호스트 요소의 속성/클래스/스타일을 바인딩
  ```typescript
  @HostBinding('class.active') isActive = true;
  @HostBinding('style.color') color = 'red';
  ```
- `@HostListener`: 호스트 요소의 이벤트를 리스닝
  ```typescript
  @HostListener('click') onClick() {
    // 클릭 시 동작
  }
  ```

#### ng-content (Content Projection)

- 부모 컴포넌트가 자식의 특정 위치에 템플릿을 삽입할 수 있게 함

  ```html
  <!-- 자식 컴포넌트 -->
  <div class="card">
    <ng-content></ng-content>
  </div>
  <!-- 부모에서 사용 -->
  <app-card>여기에 들어갈 내용</app-card>
  ```

#### Signal (Angular 17+ 신개념)

- **버전**: Angular 17 이상에서 공식 지원

  - Signal은 Reactivity(반응성) 상태 관리를 위한 새로운 API로, RxJS Observable보다 더 직관적이고 간단하게 상태 변화를 추적할 수 있음
  - **시나리오**: 간단한 카운터, 실시간 상태 표시, 컴포넌트 간 데이터 전달 등에서 사용

  ```typescript
  import { signal, computed, effect } from "@angular/core";
  const count = signal(0);
  const double = computed(() => count() * 2);
  effect(() => console.log(count()));
  count.set(1);
  ```

  - Signal은 아직 RxJS와 혼용되는 과도기적 단계이므로, 공식 문서와 마이그레이션 가이드 참고

- **State Management (상태 관리)**

  - 소규모 앱: 서비스 + BehaviorSubject/Observable로 충분
  - 대규모/복잡한 앱: NgRx, NGXS, Akita 등 상태 관리 라이브러리 사용 고려
  - Signal 기반 상태 관리도 점차 확산 중

### 15. Performance Improvement (성능 최적화)

> **Angular 17+ 기준의 최신 성능 최적화 기법(Standalone Component, Signal, OnPush, Virtual Scrolling, Web Worker 등)과 공식 가이드 반영**

- **개념**: Angular 앱의 렌더링, 데이터 처리, 네트워크 등 전반적인 성능을 높이기 위한 다양한 전략입니다.
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
  - **Pure Pipe**
    ```typescript
    @Pipe({ name: 'myPipe', pure: true })
    export class MyPipe implements PipeTransform { ... }
    ```
  - **Virtual Scrolling** (cdk-virtual-scroll-viewport)
    ```html
    <cdk-virtual-scroll-viewport itemSize="50" style="height: 400px">
      <div *cdkVirtualFor="let item of items">{{ item }}</div>
    </cdk-virtual-scroll-viewport>
    ```
  - **Web Worker**
    ```typescript
    // main.ts
    if (window.Worker) {
      const myWorker = new Worker("./app.worker", { type: "module" });
      myWorker.postMessage("start");
    }
    ```

- **참고**:
  - 공식 문서: [ViewChild](https://angular.kr/api/core/ViewChild), [HostBinding/HostListener](https://angular.kr/api/core/HostBinding), [Signal](https://angular.dev/reference/signals), [NgRx](https://ngrx.io/)

---

### 16. Angular 데코레이터 개념 및 예시

> **최신 Angular 데코레이터(@Component, @Injectable, @Input, @Output, @Directive 등)와 메타프로그래밍 활용법, 공식 문서 링크를 포함합니다.**

- **개념**: 데코레이터는 클래스, 속성, 메서드, 파라미터 등에 메타데이터를 추가하는 TypeScript의 특수 문법입니다. Angular에서는 컴포넌트(@Component), 서비스(@Injectable), 디렉티브(@Directive), 입력/출력(@Input/@Output) 등 다양한 곳에 데코레이터를 사용하여 Angular 런타임이 해당 클래스를 어떻게 처리할지 정의합니다.

- **주요 데코레이터 종류 및 예시**:

  - `@Component`: 컴포넌트 정의
    ```typescript
    @Component({
      selector: "app-member-edit",
      templateUrl: "./member-edit.component.html",
      styleUrls: ["./member-edit.component.css"],
    })
    export class MemberEditComponent {}
    ```
  - `@Injectable`: 서비스/인터셉터 등에서 의존성 주입 가능하게 함
    ```typescript
    @Injectable({ providedIn: "root" })
    export class AccountService {}
    ```
  - `@Input`, `@Output`: 부모-자식 컴포넌트 간 데이터/이벤트 전달
    ```typescript
    @Input() member: Member;
    @Output() liked = new EventEmitter<number>();
    ```
  - `@Directive`: 커스텀 디렉티브 정의
    ```typescript
    @Directive({ selector: "[appHasRole]" })
    export class HasRoleDirective {}
    ```

- **참고**: 데코레이터는 Angular의 DI(의존성 주입), 컴포넌트/서비스/디렉티브/파이프의 정의 등 Angular의 핵심 구조를 구성하는 필수 요소입니다.
