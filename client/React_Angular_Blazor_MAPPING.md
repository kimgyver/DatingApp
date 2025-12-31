# React ↔ Angular ↔ Blazor 주요 개념/코드 1:1 매핑

## 목차

- [기본 개념](#기본-개념)
- [고급/최적화/패턴](#고급최적화패턴)
- [Fragment/Template/비동기](#fragmenttemplate비동기)
- [실전 팁/전환 주의점](#실전-팁전환-주의점)

---

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

## 고급/최적화/패턴

| 개념/패턴                  | React 예시                                    | Angular 예시                                                                                                                               | Blazor 예시                                   |
| -------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| **커스텀 디렉티브/훅**     | Custom Hook (재사용 로직, DOM 제어는 제한적)  | Custom Directive (`@Directive`, DOM 제어/재사용)                                                                                           | Attribute/Child Component (속성/구성 재사용)  |
| **HostBinding/Listener**   | 없음 (inline style/class, useEffect로 이벤트) | `@HostBinding`, `@HostListener`                                                                                                            | 없음 (이벤트는 @onXXX, 스타일은 속성)         |
| **Content Projection**     | `{props.children}`                            | `<ng-content>`                                                                                                                             | `ChildContent`, `RenderFragment`              |
| **커스텀 파이프/변환**     | 없음 (함수/Custom Hook)                       | Pipe (`@Pipe`)                                                                                                                             | ValueConverter, Custom Method                 |
| **RxJS/Observable 연산자** | 없음 (Promise/Array method)                   | RxJS 연산자(map, switchMap, filter 등)                                                                                                     | 없음 (LINQ/Task/이벤트)                       |
| **Signal/반응성 상태**     | 없음 (useState/useEffect 기반)                | Signal, effect(), computed()<br/>`count = signal(0); effect(() => console.log(count()));`<br/>`doubleCount = computed(() => count() * 2);` | 없음 (StateHasChanged, EventCallback 등 수동) |
| **ChangeDetection/최적화** | React.memo, useMemo, key, Virtual DOM         | OnPush, trackBy, Virtual Scroll, Pure Pipe                                                                                                 | ShouldRender, Virtualize                      |
| **데코레이터/메타**        | 없음 (HOC, 함수 조합)                         | @Component, @Injectable, @Input, @Output 등                                                                                                | [Parameter], [Inject], [CascadingParameter]   |

---

## Fragment/Template/비동기

| 개념/패턴              | React 예시                                         | Angular 예시                                                | Blazor 예시                                                                                                                                                                              |
| ---------------------- | -------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fragment/Template**  | `<></>` (Fragment, no extra DOM) <br/>`<Fragment>` | `<ng-container>`, `<ng-template>` (구조적, DOM 미추가)      | `@key`, `@attributes`, `RenderFragment` (구조적/동적 렌더링)<br/>`<ChildContent>@context.Name</ChildContent>`<br/>`Parent.razor: <ChildComponent ChildContent="@(() => <h1>Hi</h1>)" />` |
| **비동기/데이터 흐름** | Promise → `.then()`, `await`, Suspense(비동기 UI)  | Observable → `subscribe()`, async pipe, Signal → `effect()` | `Task`, `async/await`, `EventCallback`, `StateHasChanged()`, `await foreach`                                                                                                             |

> **비동기 UI 처리 요약**: React는 Suspense/Promise, Angular는 async pipe/Observable, Blazor는 await/Task/EventCallback 등으로 비동기 데이터와 UI를 연결합니다.

---

## 실전 팁/전환 주의점

- **커스텀 디렉티브/훅**: Angular의 `@Directive`는 DOM 제어/재사용 로직에, React는 Custom Hook(로직 재사용), Blazor는 Attribute/Child Component로 유사 기능 구현. 용도/역할이 다르니 전환 시 주의.
- **HostBinding/Listener**: Angular만 데코레이터로 스타일/이벤트 바인딩. React/Blazor는 인라인/속성/이벤트 핸들러 사용.
- **Content Projection**: React는 `{children}`, Angular는 `<ng-content>`, Blazor는 `ChildContent`/`RenderFragment`로 슬롯/템플릿 전달.
- **커스텀 파이프/변환**: Angular Pipe, Blazor ValueConverter/메서드, React는 함수/훅으로 변환 처리. Blazor는 C# 메서드/ValueConverter, Angular는 @Pipe, React는 함수/훅 활용.
- **RxJS 연산자**: Angular만 RxJS 연산자(map, switchMap 등)로 비동기/스트림 처리. React/Blazor는 없음.
- **Signal/반응성**: Angular 17+ Signal, effect()로 반응성 상태 관리. React는 useState/useEffect, Blazor는 StateHasChanged 등 수동 갱신.
- **ChangeDetection/최적화**: Angular OnPush, trackBy, Virtual Scroll, React.memo/useMemo, Blazor ShouldRender/Virtualize 등 각 프레임워크별 최적화 기법 존재.
- **데코레이터/메타**: Angular/Blazor는 데코레이터/속성 기반 메타프로그래밍, React는 HOC/함수 조합.
- **DOM 참조/Ref**: React의 `useRef()`/`ref`는 DOM 요소나 컴포넌트 인스턴스에 직접 접근할 때 사용. Angular는 `@ViewChild`, `ElementRef`, Blazor는 `@ref`, `ElementReference`로 유사하게 DOM/컴포넌트 참조.
- **Blazor DI/상태관리**: `[Inject] MyService MyService { get; set; }`, `CascadingParameter`, `StateContainer`, `Fluxor` 등 다양한 패턴 존재. 전역 상태는 서비스/Fluxor/컨테이너 패턴 활용.
- **비동기 데이터 흐름**: React는 Promise/Suspense, Angular는 Observable/async pipe/Signal, Blazor는 Task/await/EventCallback/StateHasChanged 등으로 UI와 데이터 연결. Blazor의 `await foreach`는 실시간 데이터 처리에 유용.

> **실무 팁**: 각 프레임워크의 “컴포넌트-상태-이벤트-라우팅-폼-서비스” 흐름을 매핑하면, 전환/비교/학습이 훨씬 쉬워집니다. Blazor는 C# 기반 Razor 문법, Angular는 데코레이터+타입스크립트, React는 함수형+JSX가 기본입니다. 각 셀의 코드는 실제 프로젝트에서 바로 쓸 수 있는 최소 예시 위주로 작성했습니다.

---

### 실전 FAQ: 전환 시 가장 많이 실수하는 부분 TOP3

1. **상태/참조 관리**: React의 useRef/useState, Angular의 Signal/Service, Blazor의 StateContainer/서비스/Fluxor 등 상태/참조 방식이 달라 직접 치환이 안 되는 경우가 많음. 각 프레임워크의 상태/참조 흐름을 먼저 익히세요.
2. **비동기 데이터 처리**: React의 Promise/Suspense, Angular의 Observable/async pipe, Blazor의 Task/await/EventCallback 등 비동기 처리 방식이 달라, 단순히 함수만 옮기면 UI가 갱신되지 않거나 메모리릭이 발생할 수 있음.
3. **Content Projection/Slot**: React의 children, Angular의 ng-content, Blazor의 ChildContent/RenderFragment는 구조/사용법이 다르므로, slot/템플릿 전달 시 문법과 라이프사이클 차이를 반드시 확인하세요.

---

### 실무 FAQ: 자주 묻는 질문

**Q. RxJS 없이 Angular에서 비동기 처리하려면?**
A. Angular 17+에서는 Signal, async pipe, Promise를 활용할 수 있습니다. 간단한 비동기는 Promise/async pipe, 복잡한 스트림은 RxJS 권장.

**Q. Blazor에서 부모가 자식에 동적 UI(템플릿)를 전달하려면?**
A. RenderFragment를 파라미터로 넘기면 됩니다. `<ChildComponent ChildContent="@(() => <h1>Hi</h1>)" />` 처럼 사용합니다.

**Q. React에서 useRef와 useState의 차이는?**
A. useRef는 DOM/값 참조(변경해도 렌더링X), useState는 상태(변경 시 렌더링O) 관리용입니다.

더 많은 매핑이 필요하면 언제든 요청해 주세요!
