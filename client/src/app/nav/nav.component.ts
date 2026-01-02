import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../_services/message.service';

export interface LoginModel {
  userName: string;
  password: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  model: LoginModel = { userName: '', password: '' };
  unreadTotal = 0;

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.messageService.unreadTotal$.subscribe((count) => {
      this.unreadTotal = count;
    });
    // 최초 1회만 서버에서 값을 받아와 unreadTotalSource를 갱신
    this.messageService.getUnreadCount().subscribe({
      next: (res) => {
        this.messageService.emitUnreadTotal(res.count);
      },
      error: () => {
        this.messageService.emitUnreadTotal(0);
      },
    });
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      },
      error: (error) => this.toastr.error(error.error),
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
