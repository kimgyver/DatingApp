# React ↔ Angular ↔ Blazor 주요 개념/코드 1:1 매핑

---

## 기본 개념

| 개념/패턴 | React 예시 | Angular 예시 | Blazor 예시 |
| --- | --- | --- | --- |
| **컴포넌트 선언** | `function MyComp() {}`<br/>`export default MyComp;` | `@Component({...})`<br/>`export class MyComp {}` | `MyComp.razor`<br/>`@code { ... }` |
| **상태(State)** | `const [cnt, setCnt] = useState(0)` | 컴포넌트 필드, `signal()`, 서비스 | `@code { int cnt = 0; }`<br/>변경 후 보통 자동 리렌더, 필요 시 `StateHasChanged()` |
| **Props/Input** | `props` / 함수 인자 | `@Input()` / `input()` | `[Parameter]` |
| **출력 이벤트** | `onChange={fn}`, 콜백 props | `@Output() EventEmitter` / `output()` | `EventCallback` / `EventCallback<T>` |
| **이벤트 바인딩** | `<button onClick={fn}>` | `<button (click)="fn()">` | `<button @onclick="fn">` |
| **양방향 바인딩** | controlled:<br/>`value` + `onChange` | `[(ngModel)]` | `@bind` / `@bind-Value`<br/>`@bind:event="oninput"` |
| **페이지 라우트** | `<Route path="..." />` | `Routes` + `path` | `@page "/path"`<br/>`@page "/users/{id:int}"` |
| **라우트 파라미터** | `useParams()` | `ActivatedRoute.paramMap` / `input` 바인딩 | `[Parameter]` + `@page "/x/{id:int}"`<br/>제약: `int`, `guid`, `*` 등 |
| **라우팅** | `react-router`<br/>`<Outlet />` | `@angular/router`<br/>`<router-outlet>` | `Router` / `RouteView`<br/>`AuthorizeRouteView` |
| **레이아웃 / 중첩 라우트** | Layout route + `<Outlet />` | `children` + 부모 `<router-outlet>` | `@layout MainLayout`<br/>`MainLayout.razor`의 `@Body`<br/>중첩: 레이아웃 체인 |
| **라우팅 링크** | `<Link to="/path">`<br/>`useNavigate()` | `routerLink` | `<NavLink href="/path">`<br/>`Match` / `ActiveClass` |
| **프로그래밍 네비게이션** | `navigate('/path')` | `this.router.navigate(['/path'])` | `NavigationManager.NavigateTo("/path")` |
| **렌더 모드** | CSR / SSR(Next.js) | CSR / `@angular/ssr` / Hydration | `@rendermode InteractiveServer`<br/>`InteractiveWebAssembly` / `InteractiveAuto` / Static SSR |
| **DI/서비스** | Context, custom hooks | `@Injectable()` + `inject()` / 생성자 DI | `@inject MyService Svc`<br/>또는 `[Inject]`<br/>Server: Scoped≈회로, Singleton=전역 |
| **라이프사이클** | `useEffect`, mount/unmount | `ngOnInit`, `ngOnDestroy`, `ngAfterViewInit` | `OnInitialized[Async]`<br/>`OnParametersSet[Async]`<br/>`OnAfterRender[Async]`<br/>`Dispose` / `IAsyncDisposable` |
| **입력값/상태 변화에 반응** | `useEffect(() => ..., [value])` | `ngOnChanges`, Signal `effect()`, Observable | `OnParametersSet[Async]`<br/>파라미터 setter<br/>(임의 필드 변화는 이벤트/`StateHasChanged`로 처리) |
| **조건부 렌더링** | `{cond && <div/>}` | `*ngIf` / `@if` | `@if (cond) { ... }` |
| **반복 렌더링** | `{arr.map(...)}` + `key` | `*ngFor` / `@for` + `track` | `@foreach` + `@key` |
| **스타일/클래스 바인딩** | `className`, `style` | `[ngClass]`, `[ngStyle]` | `class="..."`, `style="..."`<br/>조건부: `class="@(cond ? "a" : "b")"` |
| **CSS 캡슐화** | CSS Modules, styled-components | `ViewEncapsulation` (Emulated/ShadowDom/None) | `Component.razor.css`<br/>(CSS isolation, 자동 scope) |
| **폼/입력** | controlled input, Formik | `ngModel`, Reactive Forms | `@bind`, `EditForm` |
| **재사용 로직** | Custom Hook | 서비스, 유틸, 디렉티브 | 서비스, 확장 메서드, 베이스 컴포넌트 |
| **표시용 변환(Pipe 대응)** | 함수 / 포맷 유틸 | `@Pipe` | `@code` 메서드 호출<br/>예: `@FormatDate(dt)` (Pipe 문법 아님) |
| **전역 상태관리** | Redux, Context | NgRx, 서비스+RxJS | Fluxor, DI 서비스,<br/>`CascadingValue` / `[CascadingParameter]` |
| **DOM 참조/Ref** | `useRef()`, `ref` | `@ViewChild`, `ElementRef` | `@ref`, `ElementReference` |
| **인증 UI/라우트** | 라우트 가드 + 조건부 렌더 | `CanActivateFn`, `*appHasRole` 등 | `@attribute [Authorize]` on 페이지<br/>`AuthorizeRouteView`<br/>`AuthorizeView` (역할/정책 UI) |
| **HTTP 클라이언트** | `fetch`, axios | `HttpClient` | `HttpClient`<br/>`GetFromJsonAsync` 등 |
| **앱 부트스트랩** | `createRoot(...).render()` | `bootstrapApplication` / `AppModule` | Server: `WebApplication`<br/>WASM: `WebAssemblyHostBuilder` |

---

## 고급/최적화/특수 패턴 비교

### (1) 최적화·DX (기본 표와 겹치는 항목은 생략)

| 개념/패턴 | React 예시 | Angular 예시 | Blazor 예시 |
| --- | --- | --- | --- |
| **상태/불변성** | useState, 불변 업데이트(spread/map) | 필드/Signal/서비스 (상대적으로 자유) | 필드 변경 가능. 리스트 재정렬·가상화 시 `@key` 권장 |
| **폼/유효성검사** | Controlled, Formik, Yup, useForm | Reactive Forms, Validators | `EditForm`, `DataAnnotationsValidator` |
| **조건/반복/가상화** | `key`, react-window | `track` / trackBy, CDK Virtual Scroll | `@key`, `<Virtualize>` |
| **렌더 최적화** | React.memo, useMemo, useCallback (병목일 때만) | OnPush, Pure Pipe | `ShouldRender()`, `@key`, `<Virtualize>` |
| **변경 감지 모델** | Virtual DOM / 상태 변경 시 재렌더 | Zone.js CD / Signal / OnPush | 이벤트·`await` 후 배치 렌더<br/>필요 시 `StateHasChanged()` |
| **로딩·지연 UI** | `Suspense`, 스피너 상태 | `@defer`, 로딩 컴포넌트 | `Task` 대기 + `@if (loading)`<br/>플레이스홀더 템플릿 |
| **테스트** | Jest, RTL, Cypress/Playwright | Jasmine/Jest, Karma, Cypress/Playwright | xUnit, bUnit, Playwright |
| **개발 DX** | StrictMode, Fast Refresh | Strict templates/DI, HMR | Hot Reload, `.razor` 핫리로드 |

### (2) 고급/특수 패턴/아키텍처

| 개념/패턴 | React 예시 | Angular 예시 | Blazor 예시 |
| --- | --- | --- | --- |
| **Raw HTML 렌더링** | `dangerouslySetInnerHTML` (XSS 위험) | `[innerHTML]` + DomSanitizer | `MarkupString` (**인코딩 우회, sanitize 아님**) |
| **서버 상태 관리** | React Query, SWR | HttpClient+RxJS, NgRx | `HttpClient` + 서비스. 캐시/재시도/낙관적 업데이트는 **직접 설계** 또는 Fluxor 등 |
| **HTTP 가로채기** | axios interceptor, fetch wrapper | `HttpInterceptorFn` / class interceptor | 클라이언트: `DelegatingHandler`<br/>(API 서버 파이프라인 middleware는 **별층**) |
| **Realtime** | socket.io, WebSocket | RxJS `webSocket`, SignalR 클라이언트 | **SignalR** (`HubConnection`)<br/>Blazor Server 회로와 별개 허브 가능 |
| **환경설정** | `.env`, `import.meta.env` | `environment.ts` / `ApplicationConfig` | `appsettings*.json`, `IConfiguration`<br/>WASM: host 설정 / `appsettings` |
| **i18n** | i18next, FormatJS | `@angular/localize`, Transloco 등 | Server: `IStringLocalizer` + 리소스<br/>WASM: 리소스·Culture 설정이 더 필요 |
| **브라우저 호환성** | Polyfill, core-js | Polyfill, Zone.js | 대부분 .NET/브라우저 런타임. 필요 시 JS interop |
| **보안/인증** | XSS/CSRF, BFF, JWT<br/>[BFF](https://martinfowler.com/articles/bff.html) | 보안 가이드, HttpOnly<br/>[Angular Security](https://angular.dev/guide/security) | ASP.NET Core Identity/JWT, 인가 정책<br/>`[Authorize]`, 정책/역할<br/>[Blazor Security](https://learn.microsoft.com/aspnet/core/blazor/security/) |
| **실행/렌더링 모델** | CSR, SSR(Next), Hydration | CSR, `@angular/ssr`, Hydration | Static SSR, Interactive Server, Interactive WASM, Auto (`@rendermode`) |
| **쿼리·폼 파라미터** | `useSearchParams` | `ActivatedRoute.queryParams`<br/>`withComponentInputBinding` | `[SupplyParameterFromQuery]`<br/>`[SupplyParameterFromForm]`<br/>(경로 파라미터는 기본 표 참고) |
| **Arbitrary Attributes** | `{...rest}` | `[attr.xxx]` | `@attributes`, `[Parameter(CaptureUnmatchedValues = true)]` |
| **동적 컴포넌트** | `createElement`, `lazy` | `ViewContainerRef.createComponent` | `<DynamicComponent Type="..." Parameters="..." />` (타입 런타임 선택) |
| **코드 스플리팅 / Lazy** | `React.lazy` + `Suspense` | `loadComponent` / `loadChildren` | WASM: lazy assembly 로드 등.<br/>`DynamicComponent` ≠ 번들 분할 |
| **프리렌더 → Interactive** | SSR/RSC + hydrate 상태 주의 | SSR hydrate | 프리렌더 상태 유실 가능 → `PersistentComponentState` |
| **이벤트 수정자** | `e.preventDefault()`, `e.stopPropagation()` | `(click)="$event.preventDefault()"`, `$event` | `@onclick:preventDefault`<br/>`@onclick:stopPropagation`<br/>`@bind:after` |
| **DI 수명** | 모듈/Context 범위 | `providedIn`, 모듈/`EnvironmentInjector` | Server: Scoped≈회로, Singleton=전역<br/>WASM: 앱 인스턴스 기준 |
| **JS Interop** | window, useEffect, ref | ElementRef, Renderer2 | `IJSRuntime`, collocated `.razor.js`, `IJSObjectReference` |
| **Navigation Guard** | blocker / `useBlocker` | `CanDeactivate` | `<NavigationLock>` (Interactive 모드) |
| **Error Boundary** | `<ErrorBoundary>` | `ErrorHandler` | `<ErrorBoundary>` (자식 **렌더** 예외 중심, Interactive) |
| **페이지 메타데이터** | react-helmet, `document.title` | `Title` 서비스 | `<PageTitle>` |
| **데코레이터/메타** | HOC, 함수 조합 | `@Component`, `@Injectable`, `@Input`… | `[Parameter]`, `[Inject]`, `[CascadingParameter]`, `@page`, `@rendermode` |
| **Route 데이터 프리패치** | loader (RR v6+), Suspense | Resolve / route data | `OnParametersSetAsync`에서 await fetch<br/>상위 `Task` 전달 / 서비스 캐시 |
| **Cascading / Context** | Context Provider/Consumer | DI 계층, 입력 전달 | `<CascadingValue>` / `[CascadingParameter]` |
| **바인딩 세부** | controlled get/set | getter/setter + ngModel | `@bind:get` / `@bind:set` / `@bind:after` |

---

## Fragment / Template / 비동기

| 개념/패턴 | React 예시 | Angular 예시 | Blazor 예시 |
| --- | --- | --- | --- |
| **Fragment (DOM 래퍼 없이)** | `<>...</>` / `<Fragment>` | `<ng-container>` | 다중 루트 허용(최신), 또는 `RenderFragment` |
| **콘텐츠 투영/슬롯** | `children`, render props | `ng-content`, `ng-template` | 기본: 자식 마크업 → `ChildContent`<br/>named: `RenderFragment` 파라미터 |
| **키 / 속성 스프레드** | `key`, `{...rest}` | `track`, `[attr.xxx]` | `@key`, `@attributes` |
| **비동기/데이터 흐름** | Promise, `await`, Suspense | Observable, async pipe, Signal | `Task`, `async/await`, `EventCallback`, `StateHasChanged()`, `await foreach` |

**ChildContent / RenderFragment 예시**

```razor
@* Parent.razor — 가장 흔한 형태 *@
<Child>
    <h1>Hi</h1>
</Child>

@* named RenderFragment *@
<Child>
    <Header>Title</Header>
    <Body>Content</Body>
</Child>

@* Child.razor *@
@code {
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public RenderFragment? Header { get; set; }
    [Parameter] public RenderFragment? Body { get; set; }
}
```

> **비동기 UI**: React는 Suspense/Promise, Angular는 async pipe/Observable·Signal, Blazor는 `async/await` + 라이프사이클/`EventCallback`으로 UI를 갱신합니다. Blazor에서 await 후 UI가 안 바뀌면 `StateHasChanged()` 또는 올바른 라이프사이클 위치를 확인하세요.

---

## 실전 팁 / 전환 주의점

> 표에 있는 1:1 대응은 반복하지 않고, **발에 걸리는 주의점만** 적습니다. “왜?”는 FAQ를 보세요.

- **불변성 / `@key`**: React는 mutate 금지. Angular·Blazor는 필드 변경 가능해도 리스트·가상화에서는 track/`@key`로 정체성 유지.
- **Raw HTML**: `dangerouslySetInnerHTML` / `[innerHTML]` / `MarkupString` 모두 XSS. sanitize는 별도. `MarkupString` ≠ DomSanitizer.
- **인증 층**: 페이지 진입 차단(`[Authorize]`/`AuthorizeRouteView`/가드)과 UI 조각(`AuthorizeView`)을 섞지 말 것.
- **HTTP 가로채기 층**: 클라이언트 Interceptor/`DelegatingHandler` ≠ API 서버 middleware.
- **HttpClient 등록**: named/`AddHttpClient<T>`로 핸들러를 붙였으면, 주입도 그 클라이언트·타입이랑 맞춰야 함 (`@inject HttpClient` 기본 인스턴스와 무관할 수 있음).
- **DI 수명 (Server)**: Scoped ≈ 회로, Singleton = 전역(사용자 간 공유 주의).
- **프리렌더 → Interactive**: 상태 유실 가능 → `PersistentComponentState`.
- **Interactive 전제**: `NavigationLock` / `ErrorBoundary`(렌더 예외)는 Interactive에서 의미 있음.
- **DynamicComponent ≠ lazy**: 번들/어셈블리 분할은 로더 쪽.
- **SignalR**: UI 회로(Server) ≠ 앱 Hub(채팅 등).
- **로딩 UI**: Blazor에 Suspense 동급 내장 없음 → Task + `@if`.
- **i18n**: Server는 `IStringLocalizer`가 자연스러움. WASM은 리소스·Culture를 따로 설계.
- **JS Interop**: 모듈 로드는 `OnAfterRenderAsync`, dispose 시 해제.
- **전환 핵심 흐름**: 컴포넌트 → 상태 → `EventCallback` → `@page` → 폼 → DI 서비스.

> React = 함수형+JSX, Angular = 데코레이터+TS, Blazor = C#+Razor. 표 코드는 최소 스니펫 기준.

---

## 최소 코드 스니펫 (Blazor)

```razor
@* 양방향 + after *@
<input @bind="name" @bind:event="oninput" @bind:after="OnNameChanged" />

@* 이벤트 수정자 *@
<a href="/x" @onclick="Go" @onclick:preventDefault>Go</a>

@* 라우트 + 인가 + 레이아웃 + 서비스 주입 *@
@page "/members/{id:int}"
@attribute [Authorize]
@layout MainLayout
@inject NavigationManager Nav
@inject MemberService Members

@* 타이틀 *@
<PageTitle>Profile</PageTitle>

@* 로딩 UI *@
@if (member is null)
{
    <p>Loading...</p>
}
else
{
    <p>@member.UserName</p>
}

@* 위험 HTML — 신뢰 가능한 소스만. sanitize 아님 *@
@((MarkupString)htmlFromTrustedSource)

@* 인증 구역 (역할/정책 UI) *@
<AuthorizeView Roles="Admin">
    <Authorized>Hello, @context.User.Identity?.Name</Authorized>
    <NotAuthorized>Login required</NotAuthorized>
</AuthorizeView>
```

```csharp
// Program.cs — DelegatingHandler를 MemberService용 클라이언트에 연결
builder.Services.AddTransient<JwtHandler>();
builder.Services.AddHttpClient<MemberService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["ApiBaseUrl"]!);
}).AddHttpMessageHandler<JwtHandler>(); // ≈ Angular HttpInterceptorFn

// MemberService(HttpClient http) 생성자 주입 → 위 typed client 사용
// 컴포넌트에서는 MemberService만 주입 (기본 @inject HttpClient 와 혼동 금지)

// 페이지 컴포넌트
[Parameter] public int Id { get; set; }
[Inject] private MemberService Members { get; set; } = default!;
Member? member;

protected override async Task OnParametersSetAsync()
{
    member = await Members.GetAsync(Id); // 라우트 id 변경 시에도 재호출
}
```

```razor
@* MainLayout.razor — Outlet/@Body *@
@inherits LayoutComponentBase
<nav>...</nav>
@Body
```

---

## 실전 FAQ

### 전환 시 가장 많이 실수하는 TOP3

1. **상태/참조 관리**  
   React `useState`/`useRef`, Angular Signal/서비스, Blazor 필드+서비스+Fluxor는 1:1 치환이 안 됩니다. 변경 감지·리렌더 트리거부터 맞추세요.

2. **비동기 데이터 처리**  
   Promise/Suspense, Observable/async pipe, `Task`/`await`/`EventCallback` 차이로 UI 미갱신·중복 요청·dispose 누락이 납니다. Blazor는 `OnParametersSetAsync` / `OnAfterRenderAsync` 위치와 `IAsyncDisposable`을 확인하세요.

3. **Content Projection / Slot**  
   React `children`, Angular `ng-content`, Blazor `ChildContent`/`RenderFragment`는 문법·라이프사이클이 다릅니다. 기본 슬롯은 자식 마크업, named는 `RenderFragment` 파라미터를 쓰세요.

---

### 추가 FAQ

**Q. React에서 state를 직접 변경하면 안 되는 이유는?**
A. 불변성 기반 변경 감지(shallow compare)라 mutate 시 UI가 안 바뀌거나 버그가 납니다. map/filter/spread로 새 참조를 만드세요.

**Q. Prop drilling이란?**  
A. 여러 단계로 props만 넘기는 현상. React는 Context, Angular/Blazor는 DI·CascadingValue로 완화합니다.

**Q. useMemo / useCallback / React.memo는 언제?**  
A. 실제 병목일 때만. Blazor 대응은 `ShouldRender()`, `@key`, `<Virtualize>`.

**Q. dangerouslySetInnerHTML / MarkupString은?**  
A. 외부·비신뢰 HTML을 넣을 때만, 그리고 **반드시 sanitize 후**. Blazor `MarkupString`은 DomSanitizer 대체재가 아니라 React의 dangerous API에 가깝습니다.

**Q. React Query/SWR vs Angular/Blazor 서버 상태?**  

```jsx
// React (@tanstack/react-query)
const { data, isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: () => fetch("/api/users").then((r) => r.json()),
});
```

```ts
// Angular
this.http.get<User[]>('/api/users').subscribe(users => { ... });
```

```razor
@* Blazor *@
@inject HttpClient Http
@code {
    List<User>? users;
    protected override async Task OnInitializedAsync()
        => users = await Http.GetFromJsonAsync<List<User>>("/api/users");
}
```

Blazor는 캐시·재검증·낙관적 업데이트를 프레임워크가 기본 제공하지 않으므로 서비스 계층에서 정책을 정하세요.

**Q. StrictMode / Hot Reload는 배포에 영향?**  
A. 주로 개발 DX. 프로덕션 번들·런타임 보안 모델과는 별개로 보세요.

**Q. Blazor SSR / Server / WASM 차이는?**  
A.  
- **Static SSR**: 서버 HTML, 기본 상호작용 없음  
- **Interactive Server**: SignalR 회로, 서버에 상태·비밀 유지에 유리  
- **Interactive WASM**: 브라우저에서 .NET 실행, 오프라인·클라이언트 부하에 유리 (API 보안은 서버와 동일하게 설계)  
- **Auto**: 상황에 따라 Server↔WASM  

`@rendermode`, prerender, `StateHasChanged`, 회로 끊김을 함께 고려하세요.

**Q. Virtualize / `@key`는 언제?**  
A. 긴 리스트·순서 변경·항목 재사용 시. 없으면 성능 저하·입력 상태 꼬임이 납니다.

**Q. JS 라이브러리는?**  
A. `wwwroot` 또는 collocated `.razor.js` + `IJSRuntime`/`IJSObjectReference`. 모듈 import는 `OnAfterRenderAsync`에서, dispose 시 해제.

**Q. 경로 vs 쿼리·폼 파라미터는?**  
A. **경로**: React `useParams` / Angular `paramMap` / Blazor `@page`+`[Parameter]`. **쿼리·폼**: `useSearchParams` / `queryParams` / `[SupplyParameterFromQuery]`·`[SupplyParameterFromForm]`.

**Q. NavigationLock / ErrorBoundary / 타이틀은?**  
A. `<NavigationLock>`은 Interactive에서 페이지 이탈 방지. `<ErrorBoundary>`는 자식 **렌더링** 예외 중심(모든 비동기/이벤트 예외를 막지는 않음). `<PageTitle>`은 문서 타이틀.

**Q. Blazor Server DI Scoped/Singleton 차이는?**  
A. Scoped는 보통 SignalR 회로(해당 사용자 연결) 단위로 공유되고, Singleton은 서버 프로세스 전역이라 사용자 간 상태가 섞일 수 있습니다. 사용자별 상태는 Scoped/Circuit 기준으로 두세요.

**Q. 프리렌더 후 Interactive로 바뀌면 상태가 사라지나요?**  
A. 그럴 수 있습니다. 프리렌더에서 만든 필드는 Interactive 회로/WASM으로 넘어가며 다시 만들어질 수 있어, 유지할 데이터는 `PersistentComponentState`로 저장·복원하세요. React/Angular hydrate와 같은 “SSR→클라이언트 상태 이음” 문제입니다.

**Q. `DynamicComponent`가 React.lazy와 같나요?**  
A. 아닙니다. `DynamicComponent`는 이미 알고 있는 `Type`을 런타임에 그리는 API입니다. 코드 스플리팅은 React `lazy`+`Suspense`, Angular `loadComponent`/`loadChildren`, Blazor WASM lazy assembly 등 **로더** 쪽을 보세요.

**Q. preventDefault / bind 후처리는?**  
A. Blazor: `@onclick:preventDefault`, `@onclick:stopPropagation`, `@bind:after="..."`. React는 핸들러에서 `e.preventDefault()`, Angular는 `$event.preventDefault()`.

**Q. 레이아웃·중첩 라우트는?**  
A. React: 부모 Layout + `<Outlet />`. Angular: `children` + 부모 `<router-outlet>`. Blazor: `@layout MainLayout`과 레이아웃의 `@Body`. 라우트 트리와 레이아웃 트리를 같이 설계하세요.

**Q. 라우트 파라미터는?**  
A. React `useParams()`, Angular `ActivatedRoute`/`withComponentInputBinding`, Blazor `@page "/members/{id:int}"` + `[Parameter] public int Id`. `OnParametersSetAsync`에서 id 변경을 처리하세요.

**Q. `[Authorize]`와 `AuthorizeView` 차이는?**  
A. `[Authorize]`(+`AuthorizeRouteView`)는 **페이지 진입** 자체를 막습니다. `AuthorizeView`는 **이미 렌더된 트리 안**에서 역할/정책별로 UI 조각을 보여 줍니다.

**Q. JWT Interceptor 대응은?**  
A. Angular `HttpInterceptorFn`, React axios/fetch 래퍼, Blazor `DelegatingHandler`를 `AddHttpClient<T>(...).AddHttpMessageHandler<THandler>()`로 등록. typed/`named` 클라이언트와 실제 주입 대상이 같아야 하며, API 서버 middleware와는 다른 층입니다.

**Q. Suspense / @defer 대응은?**  
A. Blazor에 동일 API는 없습니다. `isLoading` 플래그 + `@if`, 또는 자식에 `RenderFragment` 플레이스홀더 패턴을 씁니다. Angular `@defer`는 템플릿 지연 로딩에 가깝습니다.

**Q. SignalR은 Blazor Server랑 같나요?**  
A. 다릅니다. Blazor Server는 UI 회로(SignalR 기반). 채팅·알림 등 앱 실시간은 보통 별도 Hub + `HubConnection`입니다. React/Angular도 동일 Hub를 JS 클라이언트로 붙일 수 있습니다.

**Q. CSS가 전역으로 새나요?**  
A. Blazor는 `Component.razor.css`(isolation), Angular는 `ViewEncapsulation`, React는 CSS Modules 등으로 스코프를 맞추세요.

**Q. Blazor i18n은 Server/WASM 차이가 있나요?**  
A. Server는 `IStringLocalizer`+리소스가 자연스럽습니다. WASM은 위성 조립·Culture 전환·리소스 로드를 더 명시적으로 설계해야 합니다.

**Q. RxJS 없이 Angular 비동기는?**  
A. Angular 17+ Signal, async pipe, Promise로 단순 케이스 가능. 복잡한 스트림은 RxJS 권장.

**Q. 부모가 자식에 동적 UI를 넘기려면?**  
A. 자식 마크업(ChildContent) 또는 named `RenderFragment` 파라미터. (상단 Fragment 섹션 예시 참고)

**Q. useRef vs useState?**  
A. useRef는 변경해도 리렌더 없음(참조), useState는 변경 시 리렌더. Blazor `@ref`/`ElementReference`는 DOM 참조, 필드는 상태에 가깝습니다.

더 많은 매핑/실전 팁이 필요하면 언제든 요청해 주세요.
