# React ↔ Angular ↔ Blazor 주요 개념/코드 1:1 매핑

| 개념/패턴                | React 예시                                           | Angular 예시                                  | Blazor 예시                        |
| ------------------------ | ---------------------------------------------------- | --------------------------------------------- | ---------------------------------- |
| **컴포넌트 선언**        | `function MyComp() {}`<br/>`export default MyComp;`  | `@Component ...`<br/>`export class MyComp {}` | `MyComp.razor`<br/>`@code { ... }` |
| **상태(State)**          | `const [cnt, setCnt] = useState(0)`<br/>`this.state` | `@Input()`, 서비스+RxJS                       | `@code { int cnt = 0; }`           |
| **Props/Input**          | `props`                                              | `@Input()`                                    | `[Parameter]`                      |
| **이벤트 바인딩**        | `<button onClick={fn}>`                              | `<button (click)="fn()">`                     | `<button @onclick="fn">`           |
| **양방향 바인딩**        | 없음(수동 처리)<br/>`value/onChange`                 | `[(ngModel)]`                                 | `bind-Value`                       |
| **라우팅**               | `<Route path=... />`<br/>`react-router`              | `@angular/router`<br/>`<router-outlet>`       | `<NavLink>`, `Router`              |
| **DI/서비스**            | Context API, custom hooks                            | 서비스+DI                                     | 서비스+DI, `[Inject]`              |
| **라이프사이클**         | `useEffect`, `componentDidMount`                     | `ngOnInit`, `ngOnDestroy`                     | `OnInitialized`, `Dispose`         |
| **조건부 렌더링**        | `{cond && <div/>}`                                   | `*ngIf`                                       | `@if (cond) { ... }`               |
| **반복 렌더링**          | `{arr.map()}`                                        | `*ngFor`                                      | `@foreach`                         |
| **스타일/클래스 바인딩** | `className`, `style`                                 | `[ngClass]`, `[ngStyle]`                      | `class=...`, `style=...`           |
| **폼/입력**              | `onChange`, `value`                                  | `ngModel`, Reactive Forms                     | `bind-Value`, `EditForm`           |
| **커스텀 훅/파이프**     | Custom Hook                                          | Pipe                                          | ValueConverter                     |
| **전역 상태관리**        | Redux, Context                                       | NgRx, 서비스+RxJS                             | Fluxor, 서비스                     |

---

**실전 팁**

- 각 프레임워크의 “컴포넌트-상태-이벤트-라우팅-폼-서비스” 흐름을 매핑하면, 전환/비교/학습이 훨씬 쉬워집니다.
- Blazor는 C# 기반 Razor 문법, Angular는 데코레이터+타입스크립트, React는 함수형+JSX가 기본입니다.
- 각 셀의 코드는 실제 프로젝트에서 바로 쓸 수 있는 최소 예시 위주로 작성했습니다.

더 많은 매핑이 필요하면 언제든 요청해 주세요!
