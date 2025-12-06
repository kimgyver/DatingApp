import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { MembersService } from './members.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private injector: Injector,
    private presenceService: PresenceService
  ) {}

  login(model: any) {
    console.log('model', model);
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.injector.get(MembersService).resetUserParams();
        }
        return user;
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    // 토큰 만료 체크
    const tokenPayload = this.getDecodedToken(user.token);
    console.log('tokenPayload', tokenPayload);
    const exp = tokenPayload.exp;
    const now = Math.floor(Date.now() / 1000);
    if (exp && exp < now) {
      this.logout();
      // 필요시 라우터로 로그인 페이지 이동
      // this.router.navigate(['/login']);
      return;
    }

    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    user.roles = Array.isArray(roles) ? roles : [roles];
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
