import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private messageService: MessageService
  ) {}

  createHubConnection(user: User) {
    if (!user || !user.token) {
      console.log('No valid user or token');
      return;
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => {
      console.log('SignalR connection error:', error);
      this.router.navigate(['/']);
    });

    this.hubConnection.on('UserIsOnline', (userName) => {
      console.log('UserIsOnline', userName);
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (userNames) =>
          this.onlineUsersSource.next([...userNames, userName]),
      });
    });

    this.hubConnection.on('UserIsOffline', (userName) => {
      console.log('UserIsOffline', userName);
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (userNames) =>
          this.onlineUsersSource.next([
            ...userNames.filter((x) => x !== userName),
          ]),
      });
    });

    this.hubConnection.on('GetOnlineUsers', (userNames) => {
      this.onlineUsersSource.next(userNames);
    });

    this.hubConnection.on('NewMessageReceived', ({ userName, knownAs }) => {
      this.toastr
        .info(knownAs + ' has sent you a new message! Click me to see it!')
        .onTap.pipe(take(1))
        .subscribe(() =>
          this.router.navigateByUrl('/members/' + userName + '?tab=Messages')
        );
      // Immediately update unread count
      this.messageService.getUnreadCount().subscribe({
        next: (res) => {
          this.messageService.emitUnreadTotal(res.count);
        },
        error: () => {
          this.messageService.emitUnreadTotal(0);
        },
      });
    });

    this.hubConnection.on(
      'ReceiveLikeNotification',
      ({ userName, knownAs }) => {
        this.toastr
          .info(knownAs + ' liked your profile!')
          .onTap.pipe(take(1))
          .subscribe(() => this.router.navigateByUrl('/members/' + userName));
      }
    );
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => console.log(error));
  }
}
