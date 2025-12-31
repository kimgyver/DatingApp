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
  - [17. Angular 상태 관리: 서비스+RxJS vs NgRx/NGXS/Akita](#17-angular-상태-관리-서비스rxjs-vs-ngrxngxsakita)

# Angular 클라이언트 구조 및 주요 개념

## Angular 17+ 최신 기능 요약

- **Signal**: 간단한 상태 관리, computed/effect 지원, RxJS보다 직관적
- **Standalone Component**: 모듈 없이 컴포넌트만으로 앱 구성 가능
- **Control Flow**: @for, @if 등 템플릿 제어문 공식 지원
- **Zone-less**: zone.js 없이도 동작, 성능 개선
- **SSR/SSG/Hydration**: 서버 사이드 렌더링, 정적 사이트 생성, Hydration 지원 강화
- **빌드 최적화**: ng build --configuration production, 환경변수 관리

> **예시: Control Flow**

```html
@if (isLoading) {
<div>로딩 중...</div>
} @for (let item of items; track item.id) {
<div>{{ item.name }}</div>
}
```

> **예시: Standalone Component**

```typescript
import { Component } from "@angular/core";
@Component({
  standalone: true,
  selector: "app-hello",
  template: "<h1>Hello Standalone!</h1>",
})
export class HelloComponent {}
```

---

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

### Signal vs RxJS 비교

| 구분             | Signal | RxJS Observable |
| ---------------- | ------ | --------------- |
| 상태 추적        | O      | O               |
| 비동기 스트림    | X      | O               |
| 간단한 상태      | O      | △               |
| 고급 연산자      | X      | O               |
| Angular 17+ 공식 | O      | O(계속 지원)    |

> **언제 Signal, 언제 RxJS?**
>
> - Signal: 단순/동기 상태, UI 반응성, computed/effect 활용
> - RxJS: 비동기, 이벤트 스트림, 복잡한 상태/연산자 필요 시

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

* [Angular 17+ 공식 Signal 문서](https://angular.dev/reference/signals)
* [Angular Standalone Component 공식](https://angular.dev/reference/standalone-components)
* [Angular Control Flow 공식](https://angular.dev/reference/templates/control-flow)
* [Angular SSR/Hydration 공식](https://angular.dev/guide/ssr)

- [Angular 공식 문서](https://angular.kr/)
- [RxJS 공식 문서](https://rxjs.dev/)
- [Angular 스타일 가이드](https://angular.io/guide/styleguide)
- [Tour of Heroes 튜토리얼](https://angular.kr/tutorial)

## Angular 주요 개념 ↔️ 실제 코드 예시 매핑

---

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
- **주요 속성 용도**:

  - `declarations`: 이 모듈에서 선언(등록)하는 컴포넌트, 디렉티브, 파이프 목록입니다. (이 모듈에서만 사용 가능)
  - `imports`: 이 모듈에서 사용할 외부 모듈(공통 모듈, 라우팅 모듈 등) 목록입니다.
  - `providers`: 이 모듈에서 사용할 서비스(의존성 주입) 목록입니다. (여기에 등록하면 이 모듈 범위에서 싱글턴)
    - 일반 서비스는 대부분 `@Injectable({ providedIn: 'root' })`로 자동 등록되지만,
    - **특별한 DI 토큰(예: HTTP_INTERCEPTORS)이나 여러 구현체를 등록할 때는 providers에 직접 추가해야 합니다.**
    - 예시: HTTP 요청/응답을 가로채는 인터셉터 등록
      ```typescript
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
      ];
      ```
    - 여기서 `multi: true`는 여러 인터셉터를 배열로 등록할 수 있게 해줍니다(순서대로 실행).
    - 인터셉터는 Angular가 HTTP 요청/응답을 가로채서 공통 로직(에러 처리, 토큰 추가, 로딩 표시 등)을 실행할 수 있게 해줍니다.
  - `bootstrap`: 앱 시작 시 부트스트랩(최상위)할 컴포넌트(일반적으로 AppComponent)

- **실제 코드**:  
  `src/app/app.module.ts`
  ```typescript
  import { NgModule } from "@angular/core";
  import { BrowserModule } from "@angular/platform-browser";
  import { AppComponent } from "./app.component";
  import { MemberListComponent } from "./members/member-list/member-list.component";
  import { SharedModule } from "./_modules/shared.module";
  @NgModule({
    declarations: [AppComponent, MemberListComponent], // 이 모듈에서 사용하는 직접 만든(혹은 선언한) 모든 컴포넌트/디렉티브/파이프 등록
    imports: [BrowserModule, SharedModule], // 외부 모듈(공통, 라우팅 등) 등록
    providers: [], // 서비스(의존성 주입) 등록
    bootstrap: [AppComponent], // 앱 시작 시 부트스트랩할 컴포넌트
  })
  export class AppModule {}
  ```

### 2. Service & Dependency Injection

- **개념**: 비즈니스 로직/상태 관리, DI로 주입
- **실전 팁**: 서비스는 싱글턴으로 동작하므로, 상태를 저장할 때는 여러 컴포넌트에서 동시에 접근할 수 있음을 유의하세요.
- **실제 코드**:  
  `src/app/_services/account.service.ts`

  - **시나리오**: 로그인/로그아웃, 회원가입 등 인증 상태를 전역에서 관리할 때 AccountService를 DI로 주입해 사용합니다.

> **참고:**
> 서비스 클래스에 `@Injectable({ providedIn: 'root' })`를 붙이면, 별도 providers 등록 없이 앱 전체에서 자동으로 싱글턴으로 관리됩니다. 대부분의 서비스는 이 방식으로 등록하며, 특별한 경우에만 providers에 직접 명시합니다.

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

```typescript
import { AccountService } from './_services/account.service';
constructor(private accountService: AccountService) {}
```

### 3. BehaviorSubject/Observable

- **개념**:

  - **Observable**: Angular에서 비동기 데이터(HTTP 응답, 이벤트, 상태 등)를 스트림 형태로 다루는 핵심 개념입니다. RxJS의 Observable은 구독(subscribe) 방식으로 데이터를 전달하며, 여러 연산자(map, filter, switchMap 등)로 데이터 흐름을 조작할 수 있습니다.
  - **Subject / BehaviorSubject**: RxJS의 Subject 계열은 "보내기(next())"와 "구독(subscribe())" 모두 가능한 멀티캐스트 스트림입니다. BehaviorSubject는 항상 최신 값을 기억(초기값 필수)하며, 구독 시 즉시 최신값을 전달합니다.
  - **실전 구분**:
    - **Subject / BehaviorSubject**: "보내기(next())"와 "구독(subscribe())" 모두 가능 (즉, 발행자와 구독자 역할 모두)
    - **Observable**: 오직 "구독(subscribe())"만 가능 (next 등 직접 발행 불가)
    - **실무에서는**: Subject/BehaviorSubject는 내부에서 상태 변경(보내기) 전용, Observable은 외부에 읽기(구독) 전용으로 노출하는 패턴이 가장 안전하고 유지보수에 유리합니다.

- **실전 팁**: BehaviorSubject는 항상 마지막 값을 기억하므로, 로그인/로그아웃, 테마, 알림 등 전역 상태 관리에 적합합니다. 구독 해제(takeUntil, async 파이프 등)를 신경써야 메모리 누수를 막을 수 있습니다.

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

  - **참고:**

    - 로그인 상태 등 여러 번 값이 바뀌는 상태 스트림(BehaviorSubject, Subject 등)은 템플릿에서 `| async` 파이프를 꼭 사용해야 UI가 항상 최신 상태로 자동 반영됩니다.
    - 단순 HTTP 요청처럼 한 번만 응답이 오는 경우에는 한 번만 값을 받아도 되지만,
    - 로그인/로그아웃 등 상태가 바뀔 때마다 값이 여러 번 emit되는 경우에는 `| async`가 없으면 UI가 자동으로 갱신되지 않습니다.
    - 즉, "상태 스트림은 항상 | async 파이프와 함께!"라고 기억하면 좋습니다.

  - **실전 메모리 누수 주의:**
    - HTTP 요청(예: this.http.get<...>())처럼 "한 번만 응답이 오는 Observable"은 subscribe() 후 자동으로 complete(종료)되어 메모리 누수 걱정이 거의 없습니다.
    - 하지만 interval, timer, WebSocket, Subject 등 "계속 값이 나오는(무한 스트림) Observable"을 subscribe()로 구독할 때는 반드시 ngOnDestroy에서 unsubscribe()를 해줘야 메모리 누수를 막을 수 있습니다.
    - 템플릿에서 `| async` 파이프를 사용하면 Angular가 자동으로 구독/해제를 관리해주므로, 메모리 누수 걱정 없이 안전하게 사용할 수 있습니다.
    - 정리: "한 번만 응답이 오는 HTTP 요청"은 unsubscribe() 생략 가능, "계속 살아있는 스트림"은 반드시 직접 해제!

**실전 pipe/map vs subscribe(next) 패턴**

- 복잡한 데이터 가공/변환은 pipe(map(...)) 등 연산자에서 처리하고,
- subscribe의 next에서는 "최종 소비(상태 저장, UI 반영 등)"만 담당하는 것이 가장 깔끔한 패턴입니다.
- 이렇게 하면 데이터 흐름이 명확해지고, 코드 유지보수성이 높아집니다.

> 예시:
>
> ```typescript
> observable
>   .pipe(
>     map((value) => value * 2), // 여기서 변환
>     filter((value) => value > 10)
>   )
>   .subscribe({
>     next: (result) => {
>       // 여기서는 이미 가공된 값만 받아서 사용
>       this.value = result;
>     },
>   });
> ```

**실전 subscribe() 위치/책임 패턴**

- 서비스 내부에서 subscribe()는 "내부 상태를 즉시 초기화해야 할 때"만 사용합니다. (예: 생성자에서 현재 사용자 정보 등)
- 대부분의 경우 서비스 메서드는 Observable만 반환하고, 실제 subscribe()는 컴포넌트 등 "호출하는 쪽"에서 트리거합니다.
- 이렇게 하면 구독/해제, 에러 처리, UI 상태 관리 등을 컴포넌트에서 명확히 제어할 수 있습니다.
- 서비스(service)에서는 Observable만 반환(return)하고, 실제 subscribe()는 컴포넌트(component)에서 호출하는 것이 Angular/RxJS의 대표적인 패턴입니다.

> 예시: MembersService 생성자에서는 user 상태 초기화를 위해 subscribe()를 직접 사용하지만,
> getMembers 등 데이터 제공 메서드는 Observable만 반환하고 subscribe()는 컴포넌트에서 수행합니다.

### 4. Data Binding (데이터 바인딩)

### ng-container (구조적 템플릿 컨테이너)

- **개념**: `ng-container`는 실제 DOM 요소를 생성하지 않고, Angular의 구조적 지시자(`*ngIf`, `*ngFor` 등)나 여러 조건/반복을 그룹화할 때 사용하는 가상 컨테이너입니다. 렌더링 결과에 불필요한 div/span 등 추가 DOM이 생기지 않아, 레이아웃에 영향을 주지 않고 템플릿 논리를 깔끔하게 구성할 수 있습니다.

- **주요 용도**:

  - 여러 구조적 지시자를 한 곳에 적용해야 할 때
  - 조건부 렌더링, 반복, 템플릿 분기 등에서 불필요한 DOM 트리 생성을 방지할 때

- **실전 예시**:

  ```html
  <ng-container *ngIf="isLoggedIn; else guestBlock">
    <span>환영합니다, {{ userName }}님!</span>
  </ng-container>
  <ng-template #guestBlock>
    <span>로그인 해주세요.</span>
  </ng-template>

  <!-- 여러 조건/반복을 그룹화할 때 -->
  <ng-container *ngFor="let item of items">
    <div>{{ item.name }}</div>
    <div *ngIf="item.isNew">NEW!</div>
  </ng-container>
  ```

- **팁**:
  - `ng-container`는 렌더링 결과에 아무런 DOM 요소도 남기지 않습니다(개발자 도구에서 확인 가능).
  - 구조적 지시자(`*ngIf`, `*ngFor` 등)와 함께 템플릿 논리를 깔끔하게 분리할 때 적극 활용하세요.

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
    <!--
      [속성명]에는 HTML 표준 속성(src, disabled, value 등)만 사용할 수 있습니다.
      (커스텀 컴포넌트의 @Input()도 가능)
    -->
    ```
  - **Event Binding**
    ```html
    <!-- 시나리오: 버튼 클릭, 입력값 변경 등 사용자 이벤트를 처리할 때 사용 -->
    <button (click)="updateMember()">Save</button> <input (input)="onInputChange($event)" />
    <!--
      (이벤트명)에는 HTML 표준 DOM 이벤트(click, input, submit 등)만 사용할 수 있습니다.
      (커스텀 컴포넌트의 @Output()으로 정의한 이벤트명도 사용 가능)
      즉, 표준 DOM 이벤트는 미리 정해진 이름만 사용 가능하고,
      커스텀 이벤트는 컴포넌트에서 @Output()으로 직접 이름을 지정할 수 있습니다.
    -->
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

#### <router-outlet>란?

- **개념**: `<router-outlet>`은 Angular 라우팅 시스템의 핵심 지시자(Directive)로, 현재 URL에 따라 해당하는 컴포넌트의 뷰가 동적으로 삽입되는 "자리 표시자(placeholder)" 역할을 합니다.
- **실전 팁**:

  - 앱의 메인 레이아웃(예: `app.component.html`)에 `<router-outlet>`을 1회 이상 배치하면, 라우터가 URL에 따라 해당 컴포넌트를 동적으로 렌더링합니다.
  - 중첩 라우팅(자식 라우트)에서는 부모 컴포넌트 템플릿에도 `<router-outlet>`을 추가해 자식 컴포넌트가 그 위치에 렌더링되도록 할 수 있습니다.
  - `<router-outlet>`이 없는 곳에는 라우트 컴포넌트가 표시되지 않습니다.

- **실제 코드 예시**:

  - `src/app/app.component.html`
    ```html
    <nav>...네비게이션...</nav>
    <router-outlet></router-outlet>
    <footer>...푸터...</footer>
    ```
  - 중첩 라우팅 예시:
    ```html
    <!-- 부모 컴포넌트 템플릿 -->
    <h2>회원 관리</h2>
    <router-outlet></router-outlet>
    <!-- 자식 라우트가 이 위치에 렌더링됨 -->
    ```

- **팁**:
  - `<router-outlet>`은 여러 번(중첩) 사용할 수 있습니다. 각 라우트의 children 배열에 자식 라우트를 정의하면, 부모 컴포넌트의 `<router-outlet>` 위치에 자식 컴포넌트가 동적으로 삽입됩니다.
  - 라우팅이 정상 동작하지 않거나 화면이 비어 있다면, `<router-outlet>`이 올바른 위치에 있는지 확인하세요.

> **정리:**
>
> - `<router-outlet>`은 "라우트에 따라 컴포넌트를 동적으로 표시하는 자리 표시자"입니다.
> - 앱의 메인 템플릿과 중첩 라우트가 필요한 부모 컴포넌트에 반드시 포함되어야 합니다.
> - 라우팅 구조를 설계할 때, 각 레벨별로 `<router-outlet>`의 위치와 역할을 명확히 이해하면 복잡한 화면도 쉽게 구현할 수 있습니다.

#### Route Configuration

- 라우트는 `app-routing.module.ts`에서 path, component 등으로 배열 형태로 정의합니다.
  ```typescript
  import { Routes } from "@angular/router";
  import { MemberListComponent } from "./members/member-list/member-list.component";
  import { AuthGuard } from "./_guards/auth.guard";
  const routes: Routes = [
    { path: "members", component: MemberListComponent, canActivate: [AuthGuard] },
    // ...
  ];
  ```

#### RouterLink Directive

- 템플릿에서 `<a>` 또는 `<button>` 등에 `routerLink` 디렉티브를 사용해 네비게이션 링크를 만듭니다.
  ```html
  <a routerLink="/home" routerLinkActive="active-class">Home</a> <button [routerLink]="['/members', member.userName]">상세</button>
  ```

#### Router Service (프로그래밍 방식 네비게이션)

- 컴포넌트/서비스에서 조건부로 라우팅이 필요할 때 `Router` 서비스의 `navigate()` 또는 `navigateByUrl()` 메서드를 사용합니다.
  ```typescript
  import { Router } from '@angular/router';
  constructor(private router: Router) {}
  // ...
  this.router.navigateByUrl('/about');
  this.router.navigate(['/members', userName]);
  ```
  - 주로 로그인/로그아웃, 폼 제출, 특정 조건에서 이동할 때 활용합니다.

#### Route Resolver (데이터 프리패치)

- **개념**: Route Resolver는 라우팅 시 컴포넌트가 로드되기 전에 필요한 데이터를 미리 비동기로 받아오는 기능입니다. 컴포넌트가 생성되기 전에 데이터를 준비해, 로딩 스피너/깜빡임 없이 UI를 그릴 수 있습니다.
- **실전 팁**: 상세 페이지, 수정 화면 등 진입 시 반드시 데이터가 준비되어야 하는 경우에 Resolver를 활용하면 UX가 크게 향상됩니다. 에러/로딩 처리도 Resolver에서 일괄 관리할 수 있습니다.
- **코드 예시**:
  - **1. Resolver 클래스 작성**
    ```typescript
    import { Injectable } from "@angular/core";
    import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
    import { MembersService } from "./_services/members.service";
    import { Observable } from "rxjs";
    @Injectable({ providedIn: "root" })
    export class MemberDetailResolver implements Resolve<Member> {
      constructor(private membersService: MembersService) {}
      resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        return this.membersService.getMember(route.paramMap.get("username")!);
      }
    }
    ```
  - **2. 라우트에 등록**
    ```typescript
    const routes: Routes = [
      {
        path: "members/:username",
        component: MemberDetailComponent,
        resolve: { member: MemberDetailResolver },
      },
    ];
    ```
  - **3. 컴포넌트에서 데이터 사용**
    ```typescript
    import { ActivatedRoute } from "@angular/router";
    export class MemberDetailComponent implements OnInit {
      member: Member;
      constructor(private route: ActivatedRoute) {}
      ngOnInit() {
        this.member = this.route.snapshot.data["member"];
      }
    }
    ```
- **참고**: [Angular 공식 Resolver 가이드](https://angular.kr/guide/router#resolve-guard)

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

#### 주요 테스트 도구/명령 비교

| 도구/명령  | 용도        | 특징                                |
| ---------- | ----------- | ----------------------------------- |
| Jasmine    | 단위/통합   | 기본 프레임워크, describe/it/expect |
| Karma      | 실행/러너   | 브라우저 기반, Angular CLI 기본     |
| Jest       | 단위/스냅샷 | 빠름, 스냅샷, Angular/Jest 호환     |
| Cypress    | E2E         | 실제 브라우저, UI 플로우 검증       |
| Playwright | E2E         | 멀티 브라우저, 고급 E2E             |
| ng test    | 단위/통합   | Angular CLI 테스트 명령             |
| ng e2e     | E2E         | Angular CLI E2E 명령                |

> **실전 팁**: Jest/Cypress/Playwright 등 최신 도구도 적극 활용, 커버리지 측정(`--coverage`), Mock Service Worker, TestBed 환경설정 등 실무 패턴 추가

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

#### 최신 실전 패턴/팁

- **Zone-less**: zone.js 없이 동작, 성능 개선
- **Hydration/SSR/SSG**: 서버 사이드 렌더링, 정적 사이트 생성, Hydration 지원 강화
- **환경변수 관리**: `environment.ts` 활용, 빌드 시 자동 치환
- **빌드 최적화**: `ng build --configuration production`으로 최적화 빌드
- **API 통신 고급 패턴**: HttpInterceptor, ErrorHandler, Retry, 캐싱 등

#### 공식 문서/실전 블로그 링크

- [Angular 17+ 마이그레이션 가이드](https://update.angular.io/)
- [Angular 공식 Signal 문서](https://angular.dev/reference/signals)
- [Angular Standalone Component 공식](https://angular.dev/reference/standalone-components)
- [Angular Control Flow 공식](https://angular.dev/reference/templates/control-flow)
- [Angular SSR/Hydration 공식](https://angular.dev/guide/ssr)

> **Angular 17+의 Signal, Content Projection, Standalone Component, 최신 DI/데코레이터, 고급 성능 최적화 등 최신 고급 기능을 모두 다룹니다.**

#### @ViewChild, @ContentChild

- `@ViewChild`: 자식 컴포넌트, DOM 요소, 디렉티브 인스턴스에 직접 접근할 때 사용
  ```typescript
  @ViewChild('inputRef') inputRef: ElementRef;
  ngAfterViewInit() {
    this.inputRef.nativeElement.focus();
  }
  ```
- `@ContentChild`: 부모가 `<ng-content>` 슬롯에 넘긴 DOM/컴포넌트/템플릿(=projected content)을 자식 컴포넌트에서 직접 참조/제어할 때 사용합니다.
  - 예시: 부모가 `<app-card><span #projected>내용</span></app-card>`처럼 `<ng-content>` 영역에 넘긴 요소를, 자식 컴포넌트에서 `@ContentChild('projected')`로 참조할 수 있습니다.
  ```typescript
  // 자식 컴포넌트
  @ContentChild('projected') projected: ElementRef;
  ngAfterContentInit() {
    // 부모가 넘긴 <span #projected>...</span>에 접근 가능
    this.projected.nativeElement.textContent = '변경됨';
  }
  ```
  ```html
  <!-- 부모에서 사용 -->
  <app-card><span #projected>내용</span></app-card>
  ```
  - 즉, 부모가 `<ng-content>`로 넘긴 실제 DOM/컴포넌트/템플릿을 자식에서 직접 조작할 수 있게 해주는 기능입니다.

#### @HostBinding, @HostListener

- `@HostBinding`: 호스트 요소의 속성/클래스/스타일을 바인딩

  ```typescript
  @HostBinding('class.active') isActive = true;
  @HostBinding('style.color') color = 'red';
  ```

- `@HostListener`: 호스트 요소(또는 window/document 등)의 이벤트를 리스닝합니다. 일반적인 버튼 클릭, 입력 등은 템플릿에서 `(click)`, `(input)` 등으로 직접 바인딩하는 것이 표준입니다. 하지만 컴포넌트 외부(예: window:beforeunload, window:resize, host element 등) 이벤트를 감지해야 할 때, 또는 커스텀 디렉티브에서 호스트 DOM 이벤트를 다룰 때 `@HostListener`를 사용합니다.
  ```typescript
  // 1. 호스트 요소(디렉티브/컴포넌트)의 이벤트
  @HostListener('click') onClick() {
    // 클릭 시 동작
  }
  // 2. window/document 등 글로벌 이벤트
  @HostListener('window:beforeunload', ['$event']) unloadHandler($event: any) {
    // 창 닫힘/새로고침 시 동작
  }
  ```

> **정리:**
>
> - 템플릿에서 발생하는 이벤트(버튼 클릭, 입력 등)는 `(click)`, `(input)` 등 템플릿 바인딩을 사용하세요.
> - `@HostListener`는 컴포넌트 외부(윈도우, 호스트 등) 이벤트나 커스텀 디렉티브에서 특별한 경우에만 사용합니다.

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

#### 주요 성능 최적화 기법과 설명

- **Enable Production Mode**:

  - 프로덕션 빌드(`ng build --configuration production`) 시 Angular의 개발자용 검사/오류 메시지를 비활성화하고, 번들 크기를 최소화합니다. 실제 서비스 배포 시 필수로 적용해야 하며, 트리 쉐이킹·최적화·압축 등으로 JS 번들 사이즈가 크게 줄어듭니다.

  ```bash
  ng build --configuration production
  ```

  - Angular 17+는 기본적으로 프로덕션 빌드 시 자동으로 production mode가 활성화됩니다.

- **ChangeDetectionStrategy.OnPush**:

  - 컴포넌트의 변경 감지 범위를 "입력(Input) 변경 또는 Observable emit 시"로 한정해 불필요한 렌더링을 줄입니다. 데이터가 자주 바뀌지 않는 UI, 대량 리스트, 성능이 중요한 화면에 필수.

  ```typescript
  import { ChangeDetectionStrategy, Component } from '@angular/core';
  @Component({
    ...,
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class FastComponent {}
  ```

- **trackBy**:

  - \*ngFor 반복 시, 각 아이템의 고유 식별자를 지정해 Angular가 DOM을 효율적으로 재사용하도록 합니다. 대량 리스트에서 렌더링 성능이 크게 향상됩니다.

  ```html
  <li *ngFor="let item of items; trackBy: trackById">...</li>
  ```

  ```typescript
  trackById(index: number, item: Item) { return item.id; }
  ```

- **Lazy Loading**:

  - 라우트별로 코드를 분할해(코드 스플리팅) 실제로 필요한 시점(=해당 라우트로 이동할 때)에만 모듈을 로드합니다. 즉, 사용자가 특정 경로로 처음 진입할 때 그때서야 관련 코드가 네트워크로 로드됩니다. 초기 로딩 속도 개선, 대규모 앱에서 필수.

- **Preloading**:

  - Lazy Loading의 단점(처음 진입 시 약간의 지연)을 보완하기 위해, 앱 초기 로딩 후 백그라운드에서 미리 라우트 모듈을 로드하는 전략입니다. 자주 방문하는 페이지, 모바일 환경 등에서 UX를 개선할 수 있습니다.
  - Angular의 `PreloadAllModules` 전략 예시:

  ```typescript
  import { PreloadAllModules, RouterModule } from "@angular/router";
  @NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  })
  export class AppRoutingModule {}
  ```

  - 필요에 따라 커스텀 preloading 전략도 구현할 수 있습니다.

  ```typescript
  const routes: Routes = [{ path: "admin", loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule) }];
  ```

- **Pure Pipe**:

  - 입력값이 바뀔 때만 파이프가 재실행되어, 불필요한 연산을 방지합니다. 계산량이 많은 변환 로직에 효과적.

  ```typescript
  @Pipe({ name: 'myPipe', pure: true })
  export class MyPipe implements PipeTransform { ... }
  ```

- **Virtual Scrolling** (cdk-virtual-scroll-viewport):

  - 화면에 보이는 데이터만 DOM에 렌더링해, 수천~수만 개의 리스트도 부드럽게 처리합니다. Angular CDK의 Virtual Scrolling 모듈 활용.

  ```html
  <cdk-virtual-scroll-viewport itemSize="50" style="height: 400px">
    <div *cdkVirtualFor="let item of items">{{ item }}</div>
  </cdk-virtual-scroll-viewport>
  ```

- **Web Worker**:

  - 무거운 연산(예: 이미지 처리, 대량 데이터 파싱 등)을 메인 스레드와 분리해 UI가 멈추지 않게 합니다. Angular CLI로 worker 생성 가능.

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

### 17. Angular 상태 관리: 서비스+RxJS vs NgRx/NGXS/Akita

> **Angular에서의 상태 관리(State Management)는 앱의 규모, 복잡성, 협업 환경에 따라 다양한 전략이 존재합니다. 이 섹션에서는 실무에서 가장 많이 쓰는 서비스+RxJS 패턴과 대표적인 상태 관리 라이브러리(NgRx, NGXS, Akita)의 도입 기준, 실전 예시, 장단점을 비교합니다.**

#### 1. 서비스+RxJS 패턴

- **개념**: Angular의 DI(의존성 주입)와 RxJS(Observable/Subject/BehaviorSubject 등)를 활용해 서비스에서 상태를 관리하고, 여러 컴포넌트가 구독/변경할 수 있도록 하는 방식입니다.
- **실전 예시**:
  ```typescript
  // account.service.ts
  @Injectable({ providedIn: 'root' })
  export class AccountService {
    private currentUserSource = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSource.asObservable();
    setCurrentUser(user: User | null) {
      this.currentUserSource.next(user);
    }
  }
  // 컴포넌트에서 구독
  this.accountService.currentUser$.subscribe(user => ...);
  ```
- **장점**:
  - 러닝커브가 낮고, Angular/RxJS 기본만으로 구현 가능
  - 작은/중간 규모 앱, 단순 상태, 빠른 개발에 적합
  - 커스텀 로직, 비동기 흐름, 서비스 간 의존성 처리에 유연
- **단점**:
  - 상태가 많아질수록 서비스/컴포넌트 간 의존성, 코드 복잡도 증가
  - DevTools, Time Travel, Undo/Redo 등 고급 기능 부족
  - 대규모 협업/테스트/예측 가능성 측면에서 한계

#### 2. NgRx/NGXS/Akita 등 상태 관리 라이브러리

- **개념**: Redux 패턴(단방향 데이터 흐름, Action-Reducer-Store 등)을 Angular에 맞게 확장한 라이브러리로, 전역 상태를 일관성 있게 관리하고, DevTools, 미들웨어, 효과적인 테스트, 예측 가능한 상태 전이 등을 지원합니다.
- **실전 예시 (NgRx 기준)**:
  ```typescript
  // actions.ts
  export const login = createAction('[Auth] Login', props<{ user: User }>());
  // reducer.ts
  const authReducer = createReducer(
    initialState,
    on(login, (state, { user }) => ({ ...state, user }))
  );
  // selector.ts
  export const selectUser = (state: AppState) => state.auth.user;
  // 컴포넌트에서
  this.store.select(selectUser).subscribe(user => ...);
  this.store.dispatch(login({ user }));
  ```
- **장점**:
  - 대규모/복잡한 앱에서 상태 일관성, 예측 가능성, 테스트 용이성 극대화
  - DevTools, Time Travel, Undo/Redo, 미들웨어, 효과적인 디버깅 지원
  - 명확한 구조(액션-리듀서-이펙트-셀렉터 등)로 협업/유지보수에 강점
- **단점**:
  - 러닝커브가 높고, 보일러플레이트 코드가 많음
  - 작은/단순 앱에는 오버엔지니어링이 될 수 있음
  - 초기 설계/구조화에 시간 소요

#### 3. 도입 기준/실전 선택 가이드

- **서비스+RxJS 추천**:
  - 작은~중간 규모, 단순 상태, 빠른 개발, 커스텀 로직이 많은 경우
  - 상태가 서비스 단위로 명확히 분리될 수 있는 경우
- **NgRx/NGXS/Akita 추천**:
  - 대규모/복잡한 앱, 협업, 상태 추적/디버깅/Undo/Redo/DevTools가 중요한 경우
  - 상태가 여러 도메인/기능에 걸쳐 공유·변경되고, 예측 가능성이 중요한 경우

#### 4. 참고 자료
-
---
#### NgRx / NGXS / Akita 간단 비교 및 실무 팁 (Angular 관점)

- **NgRx**: Redux 패턴을 Angular에 맞게 확장. 액션, 리듀서, 이펙트, 셀렉터 등 구조가 명확. DevTools, 미들웨어, Time Travel 지원. 난이도는 Redux와 비슷하거나 약간 더 높음(타입, 이펙트, 보일러플레이트 등).
- **NGXS**: NgRx보다 문법이 간결하고, 러닝커브가 낮음. 데코레이터 기반, 코드량 적음.
- **Akita**: 실용적이고 유연한 상태 관리. 러닝커브는 NgRx < Akita < NGXS 순.

**정리**
- 서비스+RxJS: 간단/중소규모에 적합
- NgRx/NGXS/Akita: 대규모/복잡/협업, 예측 가능성, DevTools 필요 시 적합
- 난이도: 서비스+RxJS < NGXS/Akita < NgRx

**실무 팁**
- 작은 앱/단순 상태: 서비스+RxJS, NGXS, Akita
- 대규모/복잡/협업: NgRx (구조화, 예측 가능성, DevTools)

- [Angular 공식 상태 관리 가이드](https://angular.kr/guide/state-management)
- [NgRx 공식 문서](https://ngrx.io/)
- [NGXS 공식 문서](https://www.ngxs.io/)
- [Akita 공식 문서](https://datorama.github.io/akita/)

# 목차 (Table of Contents)
