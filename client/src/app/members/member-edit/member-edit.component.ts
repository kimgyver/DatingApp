import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member | undefined;
  user: User | null = null;

  constructor(
    private accountService: AccountService,
    private membersService: MembersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
        if (this.user && (this.user as any).username) {
          this.loadMember((this.user as any).username);
        }
      },
    });
  }

  loadMember(userName: string) {
    if (!userName) {
      console.log('loadMember: userName is undefined');
      return;
    }
    console.log('loadMember: userName', userName);
    this.membersService.getMember(userName).subscribe({
      next: (member) => {
        this.member = member;
        console.log('member:', this.member);
      },
      error: (err) => {
        console.error('getMember error:', err);
      },
    });
  }

  updateMember() {
    this.membersService.updateMember(this.editForm?.value).subscribe({
      next: (_) => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      },
    });
  }
}
