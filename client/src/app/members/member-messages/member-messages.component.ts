import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../_models/message';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from '../../_services/message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';

@Component({
  standalone: true,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css',
  imports: [CommonModule, TimeagoModule, FormsModule],
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() userName?: string;
  @Input() messages: Message[] = [];
  messageContent = '';
  currentUser?: User;

  constructor(
    private messageService: MessageService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        if (user) this.currentUser = user;
      },
    });
  }

  ngOnInit(): void {
    if (this.currentUser && this.userName) {
      this.messageService.createHubConnection(this.currentUser, this.userName);
      this.messageService.messageThread$.subscribe({
        next: (messages) => {
          this.messages = messages;
        },
      });
    }
  }

  sendMessage() {
    if (!this.userName || !this.messageContent.trim()) return;
    this.messageService
      .sendMessage(this.userName, this.messageContent)
      .then(() => {
        // Message will be added to the thread via SignalR event
        this.messageForm?.reset();
      })
      .catch((error) => {
        console.error('Send message failed:', error);
      });
  }
}
