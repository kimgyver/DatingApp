import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';
import { UserEditModalComponent } from '../../modals/user-edit-modal/user-edit-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent | UserEditModalComponent> =
    new BsModalRef<RolesModalComponent | UserEditModalComponent>();
  availableRoles = ['Admin', 'Moderator', 'Member'];

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users) => {
        console.log(users);
        this.users = [...users]; // 새 배열 할당
        this.cdr.detectChanges(); // 강제 화면 갱신
      },
    });
  }

  openEditUserModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        userName: user.userName,
        knownAs: user.knownAs,
        onUserUpdated: () => this.getUsersWithRoles(), // 콜백 전달
      },
    };

    this.bsModalRef = this.modalService.show(UserEditModalComponent, config);
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        userName: user.userName,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles],
      },
    };

    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const modalContent = this.bsModalRef.content as RolesModalComponent;
        const selectedRoles = modalContent?.selectedRoles;
        if (!this.arrayEqual(selectedRoles!, user.roles)) {
          this.adminService
            .updateUsersRoles(user.userName, selectedRoles!)
            .subscribe({
              next: (roles) => (user.roles = roles),
            });
        }
      },
    });
  }
}
