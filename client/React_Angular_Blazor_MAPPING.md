# React ↔ Angular ↔ Blazor 주요 개념/코드 1:1 매핑

---

## Fragment/Template/비동기 & 고급/최적화/특수 패턴 비교

### (1) Fragment/Template/비동기

| 개념/패턴              | React 예시                                         | Angular 예시                                                | Blazor 예시                                                                                                                                                                              |
| ---------------------- | -------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fragment/Template**  | `<></>` (Fragment, no extra DOM) <br/>`<Fragment>` | `<ng-container>`, `<ng-template>` (구조적, DOM 미추가)      | `@key`, `@attributes`, `RenderFragment` (구조적/동적 렌더링)<br/>`<ChildContent>@context.Name</ChildContent>`<br/>`Parent.razor: <ChildComponent ChildContent="@(() => <h1>Hi</h1>)" />` |
| **비동기/데이터 흐름** | Promise → `.then()`, `await`, Suspense(비동기 UI)  | Observable → `subscribe()`, async pipe, Signal → `effect()` | `Task`, `async/await`, `EventCallback`, `StateHasChanged()`, `await foreach`                                                                                                             |

> **비동기 UI 처리 요약**: React는 Suspense/Promise, Angular는 async pipe/Observable, Blazor는 await/Task/EventCallback 등으로 비동기 데이터와 UI를 연결합니다.

### (2) 고급/최적화/특수 패턴 비교

| 개념/패턴               | React 예시                                                       | Angular 예시                                              | Blazor 예시                                    |
| ----------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| **상태/불변성**         | useState, map/filter/spread, 직접 변경 금지                      | 서비스+RxJS, (상대적으로 자유)                            | StateContainer, (상대적으로 자유)              |
| **전역 상태관리**       | Redux, Context API, prop drilling→Context                        | NgRx, 서비스+RxJS, DI                                     | Fluxor, 서비스, CascadingParameter             |
| **라이프사이클/훅**     | useEffect, useMemo, useCallback, useRef, useContext, Custom Hook | ngOnInit, ngOnDestroy, ngAfterViewInit 등                 | OnInitialized, OnParametersSetAsync, Dispose   |
| **커스텀 훅/파이프**    | Custom Hook (재사용 로직, DOM 제어는 제한적)                     | Pipe (`@Pipe`)                                            | ValueConverter, Custom Method                  |
| **폼/입력/유효성검사**  | Controlled/Uncontrolled, Formik, Yup, useForm                    | ngModel, Reactive Forms, Validators                       | bind-Value, EditForm, DataAnnotationsValidator |
| **DOM 참조/Ref**        | useRef, ref                                                      | @ViewChild, ElementRef                                    | @ref, ElementReference                         |
| **조건/반복/렌더링**    | {cond && <div/>}, arr.map(), Fragment, Virtual DOM               | *ngIf, *ngFor, <ng-container>, ChangeDetection            | @if, @foreach, @key, Virtualize                |
| **라이프사이클/최적화** | React.memo, useMemo, useCallback (실제 병목일 때만), StrictMode  | OnPush, trackBy, Virtual Scroll, Pure Pipe, Strict DI/AOT | ShouldRender, Virtualize, Hot Reload           |
| **테스트/테스팅**       | Jest, React Testing Library, Cypress                             | Jasmine, Karma, Protractor                                | xUnit, bUnit, Playwright                       |

---

## 실전 팁/전환 주의점 (통합)

- **테스트/테스팅**: React(Jest, React Testing Library, Cypress), Angular(Jasmine, Karma, Protractor, Jest), Blazor(xUnit, bUnit, Playwright, e2e) 등 각 프레임워크별 테스트 도구/전략을 숙지하세요.
- **StrictMode/개발 도구**: React(StrictMode), Angular(Strict DI/AOT), Blazor(Hot Reload 등)로 개발 생산성과 안정성을 높일 수 있습니다.
- **서버 상태 관리**: React Query/SWR, Angular HttpClient+RxJS, Blazor HttpClient/서비스로 서버 데이터 동기화/캐싱 최적화. (아래 FAQ 참고)
- **보안/인증**: React(BFF, XSS/CSRF, JWT, [BFF 패턴 예시](https://martinfowler.com/articles/bff.html)), Angular(HttpOnly, DI, [보안 가이드](https://angular.io/guide/security)), Blazor(ASP.NET Core Identity, 인증/인가, DI, [Blazor 인증](https://learn.microsoft.com/aspnet/core/blazor/security/)) 실전 예시/링크 참고.
- **불변성(immutability)**: React는 state를 직접 변경하지 않고 map/filter/spread 등으로 새 객체를 만들어야 함. Angular/Blazor는 상대적으로 자유.
- **Prop drilling**: React는 Context API로, Angular/Blazor는 DI/서비스로 깊은 props 전달 문제 해결.
- **useMemo/useCallback/React.memo**: 실제 연산 비용이 크거나 렌더링 병목일 때만 사용. 남용 시 가독성/성능 저하.
- **dangerouslySetInnerHTML**: XSS 위험. 꼭 필요한 경우만 사용, 외부 데이터는 sanitize 필수. Angular는 DomSanitizer, Blazor는 MarkupString.
- **Blazor 실행/렌더링 모델**: Blazor는 SSR/Server/WebAssembly/Hybrid/MAUI 등 다양한 실행/렌더링 방식을 지원. React/Angular는 주로 CSR/SSR. Blazor SSR은 서버에서 HTML만 렌더, Server/WasM은 SignalR/브라우저에서 상호작용.
- **폼/쿼리 파라미터 바인딩**: Blazor의 [SupplyParameterFromForm], [SupplyParameterFromQuery]는 Angular의 ActivatedRoute, React의 useSearchParams와 유사. 폼/쿼리 파라미터를 직접 바인딩할 수 있음.
- **Arbitrary Attributes**: Blazor의 @attributes, [Parameter(CaptureUnmatchedValues)]는 React의 ...rest, Angular의 [attr.xxx]와 유사. 임의 속성 전달에 활용.
- **Virtualize, @key**: Blazor의 <Virtualize>, @key는 Angular의 \*cdkVirtualFor, React의 react-window, key prop과 유사. 대량 리스트/가상화 필수.
- **DynamicComponent**: Blazor의 DynamicComponent는 React의 createElement/lazy, Angular의 ViewContainerRef.createComponent와 유사. 런타임 동적 컴포넌트 렌더링.
- **EditForm/유효성검사**: Blazor의 EditForm+DataAnnotationsValidator는 Angular의 Reactive Forms, React의 Formik/Yup과 유사. C# 모델 기반 검증.
- **JS Interop**: Blazor의 JS Interop은 React의 useEffect+window, Angular의 ElementRef/Renderer2와 유사. JS 모듈/함수 호출 가능.
- **NavigationLock/ErrorBoundary**: Blazor의 NavigationLock, ErrorBoundary는 React의 usePrompt/ErrorBoundary, Angular의 CanDeactivate/ErrorHandler와 유사. 페이지 이탈 방지/에러 처리.
- **페이지 메타데이터**: Blazor의 PageTitleService는 React의 react-helmet, Angular의 Title과 유사. 동적 타이틀/메타데이터 관리.

> **실무 팁**: 각 프레임워크의 “컴포넌트-상태-이벤트-라우팅-폼-서비스” 흐름을 매핑하면, 전환/비교/학습이 훨씬 쉬워집니다. Blazor는 C# 기반 Razor 문법, Angular는 데코레이터+타입스크립트, React는 함수형+JSX가 기본입니다. 각 셀의 코드는 실제 프로젝트에서 바로 쓸 수 있는 최소 예시 위주로 작성했습니다.
> **Q. React Query/SWR vs Angular/Blazor 서버 상태 관리 실전 예시?**
> A. React Query/SWR는 useQuery/useMutation으로 서버 데이터 fetch/caching/동기화/낙관적 업데이트를 지원합니다. Angular는 HttpClient+RxJS(Observable), Blazor는 HttpClient/서비스 패턴을 사용합니다.

```js
// React 예시
import { useQuery } from "react-query";
const { data, isLoading } = useQuery(["users"], () => fetch("/api/users").then((res) => res.json()));
```

```typescript
// Angular 예시
this.http.get<User[]>('/api/users').subscribe(users => ...);
```

```csharp
// Blazor 예시 (서비스 DI)
@inject HttpClient Http
var users = await Http.GetFromJsonAsync<List<User>>("/api/users");
```

\*\*\* End Patch

## 기본 개념

| 개념/패턴                | React 예시                                           | Angular 예시                                  | Blazor 예시                                                                                                             |
| ------------------------ | ---------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **컴포넌트 선언**        | `function MyComp() {}`<br/>`export default MyComp;`  | `@Component ...`<br/>`export class MyComp {}` | `MyComp.razor`<br/>`@code { ... }`                                                                                      |
| **상태(State)**          | `const [cnt, setCnt] = useState(0)`<br/>`this.state` | `@Input()`, 서비스+RxJS                       | `@code { int cnt = 0; }`                                                                                                |
| **Props/Input**          | `props`                                              | `@Input()`                                    | `[Parameter]`                                                                                                           |
| **이벤트 바인딩**        | `<button onClick={fn}>`                              | `<button (click)="fn()">`                     | `<button @onclick="fn">`                                                                                                |
| **양방향 바인딩**        | 없음(수동 처리)<br/>`value/onChange`                 | `[(ngModel)]`                                 | `bind-Value`                                                                                                            |
| **라우팅**               | `<Route path=... />`<br/>`react-router`              | `@angular/router`<br/>`<router-outlet>`       | `<NavLink>`, `Router`                                                                                                   |
| **DI/서비스**            | Context API, custom hooks<br/>`useContext()`         | 서비스+DI<br/>`@Injectable()`                 | 서비스+DI, `[Inject] MyService MyService { get; set; }`                                                                 |
| **라이프사이클**         | `useEffect`, `componentDidMount`                     | `ngOnInit`, `ngOnDestroy`                     | `OnInitialized`, `Dispose`                                                                                              |
| **조건부 렌더링**        | `{cond && <div/>}`                                   | `*ngIf`                                       | `@if (cond) { ... }`                                                                                                    |
| **반복 렌더링**          | `{arr.map()}`                                        | `*ngFor`                                      | `@foreach`                                                                                                              |
| **스타일/클래스 바인딩** | `className`, `style`                                 | `[ngClass]`, `[ngStyle]`                      | `class=...`, `style=...`                                                                                                |
| **폼/입력**              | `onChange`, `value`                                  | `ngModel`, Reactive Forms                     | `bind-Value`, `EditForm`                                                                                                |
| **커스텀 훅/파이프**     | Custom Hook (재사용 로직)                            | Pipe (데이터 변환)                            | ValueConverter (데이터 변환)                                                                                            |
| **전역 상태관리**        | Redux, Context                                       | NgRx, 서비스+RxJS                             | Fluxor, 서비스, CascadingParameter, StateContainer<br/>`public class StateContainer { public int Value { get; set; } }` |
| **DOM 참조/Ref**         | `useRef()`, `ref`                                    | `@ViewChild`, `ElementRef`                    | `@ref`, `ElementReference`                                                                                              |

---

## 고급/최적화/특수 패턴 비교

### (1) 기본/상태/라이프사이클

| 개념/패턴               | React 예시                                                       | Angular 예시                                              | Blazor 예시                                    |
| ----------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| **상태/불변성**         | useState, map/filter/spread, 직접 변경 금지                      | 서비스+RxJS, (상대적으로 자유)                            | StateContainer, (상대적으로 자유)              |
| **전역 상태관리**       | Redux, Context API, prop drilling→Context                        | NgRx, 서비스+RxJS, DI                                     | Fluxor, 서비스, CascadingParameter             |
| **라이프사이클/훅**     | useEffect, useMemo, useCallback, useRef, useContext, Custom Hook | ngOnInit, ngOnDestroy, ngAfterViewInit 등                 | OnInitialized, OnParametersSetAsync, Dispose   |
| **커스텀 훅/파이프**    | Custom Hook (재사용 로직, DOM 제어는 제한적)                     | Pipe (`@Pipe`)                                            | ValueConverter, Custom Method                  |
| **폼/입력/유효성검사**  | Controlled/Uncontrolled, Formik, Yup, useForm                    | ngModel, Reactive Forms, Validators                       | bind-Value, EditForm, DataAnnotationsValidator |
| **DOM 참조/Ref**        | useRef, ref                                                      | @ViewChild, ElementRef                                    | @ref, ElementReference                         |
| **조건/반복/렌더링**    | {cond && <div/>}, arr.map(), Fragment, Virtual DOM               | *ngIf, *ngFor, <ng-container>, ChangeDetection            | @if, @foreach, @key, Virtualize                |
| **라이프사이클/최적화** | React.memo, useMemo, useCallback (실제 병목일 때만), StrictMode  | OnPush, trackBy, Virtual Scroll, Pure Pipe, Strict DI/AOT | ShouldRender, Virtualize, Hot Reload           |
| **테스트/테스팅**       | Jest, React Testing Library, Cypress                             | Jasmine, Karma, Protractor                                | xUnit, bUnit, Playwright                       |

### (2) 고급/특수 패턴/아키텍처

| 개념/패턴                          | React 예시                                                                              | Angular 예시                                                                    | Blazor 예시                                                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Raw HTML 렌더링**                | dangerouslySetInnerHTML                                                                 | [innerHTML], DomSanitizer                                                       | MarkupString                                                                                                     |
| **서버 상태 관리**                 | React Query, SWR                                                                        | HttpClient+RxJS, NgRx                                                           | HttpClient, 서비스                                                                                               |
| **브라우저 호환성**                | Polyfill, core-js                                                                       | Polyfill, Zone.js                                                               | JS interop 필요시                                                                                                |
| **보안/인증**                      | XSS/CSRF 방지, BFF, JWT<br/>[BFF 패턴 예시](https://martinfowler.com/articles/bff.html) | 보안 가이드, HttpOnly, DI<br/>[Angular 보안](https://angular.io/guide/security) | ASP.NET Core Identity, 인증/인가, DI<br/>[Blazor 인증](https://learn.microsoft.com/aspnet/core/blazor/security/) |
| **실행/렌더링 모델**               | CSR, SSR(Next.js), Hydrate                                                              | CSR, SSR(Universal), Hydrate                                                    | SSR, Server, WebAssembly, Hybrid                                                                                 |
| **폼/쿼리 파라미터 바인딩**        | props, useSearchParams, Formik                                                          | @Input, ActivatedRoute.queryParams                                              | [Parameter], [SupplyParameterFromForm/Query]                                                                     |
| **Arbitrary Attributes**           | {...rest}                                                                               | [attr.xxx]                                                                      | @attributes, [Parameter(CaptureUnmatchedValues)]                                                                 |
| **동적 컴포넌트**                  | React.createElement, lazy                                                               | ViewContainerRef.createComponent                                                | <DynamicComponent Type=... Parameters=... />                                                                     |
| **JS Interop**                     | window, useEffect, ref                                                                  | ElementRef, Renderer2, JS interop                                               | IJSRuntime, .razor.js, JS 모듈                                                                                   |
| **Navigation Guard**               | usePrompt, react-router                                                                 | CanDeactivate guard                                                             | <NavigationLock>                                                                                                 |
| **Error Boundary**                 | <ErrorBoundary>                                                                         | ErrorHandler                                                                    | <ErrorBoundary>                                                                                                  |
| **페이지 메타데이터**              | react-helmet, document.title                                                            | Title service                                                                   | PageTitleService                                                                                                 |
| **데코레이터/메타**                | 없음 (HOC, 함수 조합)                                                                   | @Component, @Injectable, @Input, @Output 등                                     | [Parameter], [Inject], [CascadingParameter]                                                                      |
| **Route Resolver/데이터 프리패치** | loader (react-router v6+), useEffect+Suspense, 라우트 진입 전 fetch/await               | Route Resolver (resolve), 라우트 등록 시 데이터 프리패치, route.snapshot.data   | OnParametersSetAsync에서 await 데이터, 라우트 파라미터 변경 시 데이터 fetch, 상위에서 Task 전달 등               |

---

## Fragment/Template/비동기

| 개념/패턴              | React 예시                                         | Angular 예시                                                | Blazor 예시                                                                                                                                                                              |
| ---------------------- | -------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fragment/Template**  | `<></>` (Fragment, no extra DOM) <br/>`<Fragment>` | `<ng-container>`, `<ng-template>` (구조적, DOM 미추가)      | `@key`, `@attributes`, `RenderFragment` (구조적/동적 렌더링)<br/>`<ChildContent>@context.Name</ChildContent>`<br/>`Parent.razor: <ChildComponent ChildContent="@(() => <h1>Hi</h1>)" />` |
| **비동기/데이터 흐름** | Promise → `.then()`, `await`, Suspense(비동기 UI)  | Observable → `subscribe()`, async pipe, Signal → `effect()` | `Task`, `async/await`, `EventCallback`, `StateHasChanged()`, `await foreach`                                                                                                             |

> **비동기 UI 처리 요약**: React는 Suspense/Promise, Angular는 async pipe/Observable, Blazor는 await/Task/EventCallback 등으로 비동기 데이터와 UI를 연결합니다.

---

## 실전 팁/전환 주의점

- **테스트/테스팅**: React(Jest, React Testing Library, Cypress), Angular(Jasmine, Karma, Protractor), Blazor(xUnit, bUnit, Playwright) 등 각 프레임워크별 테스트 도구/전략을 숙지하세요.
- **StrictMode/개발 도구**: React(StrictMode), Angular(Strict DI/AOT), Blazor(Hot Reload 등)로 개발 생산성과 안정성을 높일 수 있습니다.
- **서버 상태 관리**: React Query/SWR, Angular HttpClient+RxJS, Blazor HttpClient/서비스로 서버 데이터 동기화/캐싱 최적화. (아래 FAQ 참고)
- **보안/인증**: React(BFF, XSS/CSRF, JWT), Angular(HttpOnly, DI, 보안 가이드), Blazor(ASP.NET Core Identity, 인증/인가, DI) 실전 예시/링크 참고.

- **불변성(immutability)**: React는 state를 직접 변경하지 않고 map/filter/spread 등으로 새 객체를 만들어야 함. Angular/Blazor는 상대적으로 자유.
- **Prop drilling**: React는 Context API로, Angular/Blazor는 DI/서비스로 깊은 props 전달 문제 해결.
- **useMemo/useCallback/React.memo**: 실제 연산 비용이 크거나 렌더링 병목일 때만 사용. 남용 시 가독성/성능 저하.
- **dangerouslySetInnerHTML**: XSS 위험. 꼭 필요한 경우만 사용, 외부 데이터는 sanitize 필수. Angular는 DomSanitizer, Blazor는 MarkupString.
- **StrictMode**: React 개발 전용, 잠재적 문제 탐지. Angular는 Strict DI/AOT, Blazor는 별도 없음.
- **서버 상태 관리**: React Query/SWR, Angular HttpClient+RxJS, Blazor HttpClient/서비스로 서버 데이터 동기화/캐싱 최적화.
- **보안/인증**: React는 XSS/CSRF/BFF/토큰 관리, Angular는 HttpOnly/DI, Blazor는 ASP.NET Core Identity/DI 활용.

- **Blazor 실행/렌더링 모델**: Blazor는 SSR/Server/WebAssembly 등 다양한 실행/렌더링 방식을 지원. React/Angular는 주로 CSR/SSR. Blazor SSR은 서버에서 HTML만 렌더, Server/WasM은 SignalR/브라우저에서 상호작용.
- **폼/쿼리 파라미터 바인딩**: Blazor의 [SupplyParameterFromForm], [SupplyParameterFromQuery]는 Angular의 ActivatedRoute, React의 useSearchParams와 유사. 폼/쿼리 파라미터를 직접 바인딩할 수 있음.
- **Arbitrary Attributes**: Blazor의 @attributes, [Parameter(CaptureUnmatchedValues)]는 React의 ...rest, Angular의 [attr.xxx]와 유사. 임의 속성 전달에 활용.
- **Virtualize, @key**: Blazor의 <Virtualize>, @key는 Angular의 \*cdkVirtualFor, React의 react-window, key prop과 유사. 대량 리스트/가상화 필수.
- **DynamicComponent**: Blazor의 DynamicComponent는 React의 createElement/lazy, Angular의 ViewContainerRef.createComponent와 유사. 런타임 동적 컴포넌트 렌더링.
- **EditForm/유효성검사**: Blazor의 EditForm+DataAnnotationsValidator는 Angular의 Reactive Forms, React의 Formik/Yup과 유사. C# 모델 기반 검증.
- **JS Interop**: Blazor의 JS Interop은 React의 useEffect+window, Angular의 ElementRef/Renderer2와 유사. JS 모듈/함수 호출 가능.
- **NavigationLock/ErrorBoundary**: Blazor의 NavigationLock, ErrorBoundary는 React의 usePrompt/ErrorBoundary, Angular의 CanDeactivate/ErrorHandler와 유사. 페이지 이탈 방지/에러 처리.
- **페이지 메타데이터**: Blazor의 PageTitleService는 React의 react-helmet, Angular의 Title과 유사. 동적 타이틀/메타데이터 관리.

> **실무 팁**: 각 프레임워크의 “컴포넌트-상태-이벤트-라우팅-폼-서비스” 흐름을 매핑하면, 전환/비교/학습이 훨씬 쉬워집니다. Blazor는 C# 기반 Razor 문법, Angular는 데코레이터+타입스크립트, React는 함수형+JSX가 기본입니다. 각 셀의 코드는 실제 프로젝트에서 바로 쓸 수 있는 최소 예시 위주로 작성했습니다.

---

### 실전 FAQ: 전환 시 가장 많이 실수하는 부분 TOP3

**Q. React에서 state를 직접 변경하면 안 되는 이유는?**
A. React는 불변성 기반으로 변경 감지(shallow equality)하므로, 직접 변경(push/splice 등)하면 UI가 갱신되지 않거나 버그가 발생할 수 있음. 항상 map/filter/spread 등으로 새 객체를 만들어야 함.

**Q. React에서 prop drilling이란?**
A. 여러 단계로 props를 전달하는 현상. Context API로 해결, Angular/Blazor는 DI/서비스로 해결.

**Q. useMemo/useCallback/React.memo는 언제 써야 하나요?**
A. 연산 비용이 크거나 렌더링 병목일 때만 사용. 남용하면 오히려 성능/가독성 저하.

**Q. dangerouslySetInnerHTML은 언제 써야 하나요?**
A. 외부 HTML을 렌더링해야 할 때만 사용. XSS 위험이 있으므로 반드시 sanitize 필요. Angular는 DomSanitizer, Blazor는 MarkupString 사용.

**Q. React Query/SWR vs Angular/Blazor 서버 상태 관리 실전 예시?**
A. React Query/SWR는 useQuery/useMutation으로 서버 데이터 fetch/caching/동기화/낙관적 업데이트를 지원합니다. Angular는 HttpClient+RxJS(Observable), Blazor는 HttpClient/서비스 패턴을 사용합니다.

// React 예시
import { useQuery } from 'react-query';
const { data, isLoading } = useQuery(['users'], () => fetch('/api/users').then(res => res.json()));

// Angular 예시
this.http.get<User[]>('/api/users').subscribe(users => ...);

// Blazor 예시 (서비스 DI)
@inject HttpClient Http
var users = await Http.GetFromJsonAsync<List<User>>("/api/users");

**Q. StrictMode/개발 도구는 실제 배포에 영향 있나요?**
A. React의 StrictMode, Angular의 Strict DI/AOT, Blazor의 Hot Reload 등은 개발 전용 도구로, 잠재적 문제 탐지/개발 생산성 향상에만 사용됩니다. 실제 빌드/배포에는 영향 없음.

1. **상태/참조 관리**: React의 useRef/useState, Angular의 Signal/Service, Blazor의 StateContainer/서비스/Fluxor 등 상태/참조 방식이 달라 직접 치환이 안 되는 경우가 많음. 각 프레임워크의 상태/참조 흐름을 먼저 익히세요.
2. **비동기 데이터 처리**: React의 Promise/Suspense, Angular의 Observable/async pipe, Blazor의 Task/await/EventCallback 등 비동기 처리 방식이 달라, 단순히 함수만 옮기면 UI가 갱신되지 않거나 메모리릭이 발생할 수 있음.
3. **Content Projection/Slot**: React의 children, Angular의 ng-content, Blazor의 ChildContent/RenderFragment는 구조/사용법이 다르므로, slot/템플릿 전달 시 문법과 라이프사이클 차이를 반드시 확인하세요.

**Q. Blazor의 SSR/Server/WasM 차이점은?**
A. SSR은 서버에서 HTML만 렌더, Server/WasM은 SignalR/브라우저에서 상호작용. Server는 보안/상태관리 강점, WasM은 클라이언트 실행(대규모/보안 낮은 서비스에 적합). @rendermode, Pre-render, StateHasChanged 등 렌더링/상태 동기화에 주의.

**Q. Blazor에서 Virtualize, @key는 언제 꼭 써야 하나요?**
A. 대량 리스트/가상화 시 <Virtualize>와 @key 필수. 리스트 순서 변경/삭제 시 상태 꼬임 방지, 성능 최적화에 중요.

**Q. Blazor에서 JS 라이브러리/함수는 어떻게 쓰나요?**
A. wwwroot에 .js 배치 후 IJSRuntime으로 import/invoke. 예외/에러 처리 필수. React/Angular의 JS interop과 유사.

**Q. Blazor에서 폼/쿼리 파라미터 바인딩은?**
A. [SupplyParameterFromForm], [SupplyParameterFromQuery]로 폼/쿼리 파라미터를 직접 바인딩. Angular의 ActivatedRoute, React의 useSearchParams와 유사.

**Q. Blazor에서 NavigationLock, ErrorBoundary, 페이지 타이틀은?**
A. NavigationLock은 페이지 이탈 방지, ErrorBoundary는 자식 컴포넌트 에러 처리, PageTitleService는 동적 타이틀 관리. React/Angular의 유사 기능과 비교해 활용.

**Q. RxJS 없이 Angular에서 비동기 처리하려면?**
A. Angular 17+에서는 Signal, async pipe, Promise를 활용할 수 있습니다. 간단한 비동기는 Promise/async pipe, 복잡한 스트림은 RxJS 권장.

**Q. Blazor에서 부모가 자식에 동적 UI(템플릿)를 전달하려면?**
A. RenderFragment를 파라미터로 넘기면 됩니다. `<ChildComponent ChildContent="@(() => <h1>Hi</h1>)" />` 처럼 사용합니다.

**Q. React에서 useRef와 useState의 차이는?**
A. useRef는 DOM/값 참조(변경해도 렌더링X), useState는 상태(변경 시 렌더링O) 관리용입니다.

더 많은 매핑/실전 팁이 필요하면 언제든 요청해 주세요!
