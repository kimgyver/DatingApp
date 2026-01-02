import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PresenceService } from '../../_services/presence.service';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
  // encapsulation: ViewEncapsulation.None,
})
export class MemberCardComponent {
  @Input() member: Member | undefined;
  @Output() likeToggled = new EventEmitter<Member>();

  online = false;

  constructor(
    private memberService: MembersService,
    private toastr: ToastrService,
    private presenceService: PresenceService
  ) {}

  ngOnInit(): void {
    this.presenceService.onlineUsers$.subscribe((userNames) => {
      this.online = !!(this.member && userNames.includes(this.member.userName));
    });
  }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: (res: any) => {
        member.likedByCurrentUser = res.liked;
        if (res.liked) {
          this.toastr.success(`You liked ${member.userName}.`);
        } else {
          this.toastr.info(`You unliked ${member.userName}.`);
        }
        this.likeToggled.emit(member);
      },
    });
  }
}
