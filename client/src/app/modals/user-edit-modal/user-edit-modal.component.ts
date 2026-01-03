import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../_services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrl: './user-edit-modal.component.css',
})
export class UserEditModalComponent implements OnInit, OnDestroy {
  private onHideSub?: Subscription;
  userName = '';
  editForm: FormGroup = new FormGroup({});
  isCancelled: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // Subscribe to modal hide event
    this.onHideSub = this.bsModalRef.onHide?.subscribe(() => {
      if (!this.isCancelled && (this as any).onUserUpdated) {
        (this as any).onUserUpdated();
      }
    });
  }

  ngOnDestroy(): void {
    this.onHideSub?.unsubscribe();
  }

  initializeForm() {
    this.editForm = this.fb.group({
      newUserName: [''],
      newPassword: [''],
      confirmPassword: [''],
      newKnownAs: [''],
    });
  }

  isPasswordProvided(): boolean {
    const password = this.editForm.get('newPassword')?.value;
    return password && password.trim() !== '';
  }

  getPasswordValue(): string {
    return this.editForm.get('newPassword')?.value || '';
  }

  hasMinLength(): boolean {
    return this.getPasswordValue().length >= 6;
  }

  hasDigit(): boolean {
    return /[0-9]/.test(this.getPasswordValue());
  }

  hasLowerCase(): boolean {
    return /[a-z]/.test(this.getPasswordValue());
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.getPasswordValue());
  }

  submit() {
    this.isCancelled = false; // Mark as not cancelled on successful submit
    const { newUserName, newPassword, newKnownAs } = this.editForm.value;
    const usernameProvided = newUserName && newUserName.trim() !== '';
    const passwordProvided = this.isPasswordProvided();
    const knownAsProvided = newKnownAs && newKnownAs.trim() !== '';

    // At least one must be provided
    if (!usernameProvided && !passwordProvided && !knownAsProvided) {
      this.toastr.error(
        'Please provide username, password, or KnownAs to update'
      );
      return;
    }

    // Validate password if provided
    if (passwordProvided) {
      // Length check
      if (newPassword.length < 6) {
        this.toastr.error('Password must be at least 6 characters');
        return;
      }

      // Digit check
      if (!/[0-9]/.test(newPassword)) {
        this.toastr.error('Password must contain at least one digit');
        return;
      }

      // Lowercase check
      if (!/[a-z]/.test(newPassword)) {
        this.toastr.error(
          'Password must contain at least one lowercase letter'
        );
        return;
      }

      // Uppercase check
      if (!/[A-Z]/.test(newPassword)) {
        this.toastr.error(
          'Password must contain at least one uppercase letter'
        );
        return;
      }

      // Password match check
      const { confirmPassword } = this.editForm.value;
      if (newPassword !== confirmPassword) {
        this.toastr.error('Passwords do not match');
        return;
      }
    }

    // Use new username if provided, otherwise keep current username
    const finalUserName = usernameProvided ? newUserName.trim() : this.userName;
    const finalKnownAs = knownAsProvided ? newKnownAs.trim() : '';

    this.adminService
      .updateUserNameAndPassword(
        this.userName,
        finalUserName,
        newPassword || '',
        finalKnownAs
      )
      .subscribe({
        next: () => {
          this.toastr.success('User updated successfully');
          this.bsModalRef.hide();
        },
        error: (err) => {
          this.toastr.error('Failed to update user');
          console.error(err);
        },
      });
  }

  cancel() {
    this.isCancelled = true;
    this.bsModalRef.hide();
  }
}
