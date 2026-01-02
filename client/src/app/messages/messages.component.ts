import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  unreadTotal = 0;
  messages?: Message[];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.unreadTotal$.subscribe((count) => {
      this.unreadTotal = count;
    });
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe({
        next: (response) => {
          this.messages = response.result;
          this.pagination = response.pagination;
          this.loading = false;
        },
      });
    this.messageService.getUnreadCount().subscribe({
      next: (res) => {
        this.messageService.emitUnreadTotal(res.count);
      },
      error: () => {
        this.messageService.emitUnreadTotal(0);
      },
    });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages?.splice(
          this.messages.findIndex((m) => m.id === id),
          1
        );
        this.messageService.getUnreadCount().subscribe({
          next: (res) => {
            this.messageService.emitUnreadTotal(res.count);
          },
          error: () => {
            this.messageService.emitUnreadTotal(0);
          },
        });
      },
    });
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
