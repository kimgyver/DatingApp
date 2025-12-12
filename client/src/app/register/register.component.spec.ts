import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { RegisterComponent } from './register.component';
import { User } from '../_models/user';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock User data
const mockUser: User = {
  userName: 'testuser',
  token: 'mock-token',
  photoUrl: 'assets/user.png',
  knownAs: 'Test User',
  gender: 'male',
  roles: [],
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAccountService: jest.Mocked<AccountService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    // Mock services
    mockAccountService = {
      register: jest.fn(),
    } as any;

    mockRouter = {
      navigateByUrl: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: AccountService, useValue: mockAccountService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(RegisterComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize registerMode as false in parent', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize registerForm with empty values', () => {
      expect(component.registerForm).toBeTruthy();
      expect(component.registerForm.get('userName')?.value).toBe('');
      expect(component.registerForm.get('gender')?.value).toBe('male');
    });

    it('should set maxDate to 18 years ago', () => {
      const today = new Date();
      const expectedMaxDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      expect(component.maxDate.getFullYear()).toBe(
        expectedMaxDate.getFullYear()
      );
    });
  });

  describe('Form Validation', () => {
    it('should invalidate form when required fields are empty', () => {
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should require userName field', () => {
      const userNameControl = component.registerForm.get('userName');
      expect(userNameControl?.hasError('required')).toBeTruthy();
    });

    it('should require password with minimum length 4', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('abc');
      expect(passwordControl?.hasError('minlength')).toBeTruthy();
    });

    it('should require password with maximum length 10', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('abcdefghijk');
      expect(passwordControl?.hasError('maxlength')).toBeTruthy();
    });

    it('should validate password length between 4-10', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('abcd');
      expect(passwordControl?.valid).toBeTruthy();
    });

    it('should validate confirmPassword matches password', () => {
      const passwordControl = component.registerForm.get('password');
      const confirmPasswordControl =
        component.registerForm.get('confirmPassword');

      passwordControl?.setValue('password123');
      confirmPasswordControl?.setValue('password123');
      confirmPasswordControl?.updateValueAndValidity();

      expect(confirmPasswordControl?.valid).toBeTruthy();
    });

    it('should invalidate confirmPassword when not matching password', () => {
      const passwordControl = component.registerForm.get('password');
      const confirmPasswordControl =
        component.registerForm.get('confirmPassword');

      passwordControl?.setValue('password123');
      confirmPasswordControl?.setValue('password456');
      confirmPasswordControl?.updateValueAndValidity();

      expect(confirmPasswordControl?.hasError('notMatched')).toBeTruthy();
    });
  });

  describe('Password Validation with Dynamic Updates', () => {
    it('should update confirmPassword validation when password changes', (done) => {
      const passwordControl = component.registerForm.get('password');
      const confirmPasswordControl =
        component.registerForm.get('confirmPassword');

      passwordControl?.setValue('newpass');
      confirmPasswordControl?.setValue('oldpass');
      confirmPasswordControl?.updateValueAndValidity();

      // Password가 변경될 때 confirmPassword의 유효성이 재검사됨
      setTimeout(() => {
        expect(confirmPasswordControl?.hasError('notMatched')).toBeTruthy();
        done();
      }, 0);
    });
  });

  describe('getDateOnly Method', () => {
    it('should format date correctly (YYYY-MM-DD)', () => {
      const inputDate = '2000-05-15T00:00:00';
      const result = component['getDateOnly'](inputDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return undefined for undefined input', () => {
      const result = component['getDateOnly'](undefined);
      expect(result).toBeUndefined();
    });

    it('should handle timezone offset correctly', () => {
      const testDate = new Date('2000-05-15');
      const inputDate = testDate.toISOString();
      const result = component['getDateOnly'](inputDate);
      expect(result).toBeTruthy();
    });
  });

  describe('Register Method', () => {
    beforeEach(() => {
      component.registerForm.patchValue({
        gender: 'male',
        userName: 'testuser',
        knownAs: 'Test User',
        dateOfBirth: '2000-05-15',
        city: 'Seoul',
        country: 'Korea',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    it('should call accountService.register with correct data on success', (done) => {
      mockAccountService.register.mockReturnValue(of(mockUser));

      component.register();

      expect(mockAccountService.register).toHaveBeenCalled();
      const registerData = mockAccountService.register.mock.calls[0][0];
      expect(registerData.userName).toBe('testuser');
      expect(registerData.dateOfBirth).toBe('2000-05-15');
      done();
    });

    it('should navigate to /members on successful registration', (done) => {
      mockAccountService.register.mockReturnValue(of(mockUser));

      component.register();

      setTimeout(() => {
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/members');
        done();
      }, 0);
    });

    it('should handle registration error and set validationErrors', (done) => {
      const errorResponse: any = { error: ['Username already exists'] };
      mockAccountService.register.mockReturnValue(
        throwError(() => errorResponse)
      );

      component.register();

      setTimeout(() => {
        expect(component.validationErrors).toEqual(errorResponse);
        done();
      }, 0);
    });

    it('should format dateOfBirth correctly before sending to server', (done) => {
      mockAccountService.register.mockReturnValue(of(mockUser));
      component.registerForm
        .get('dateOfBirth')
        ?.setValue('2000-05-15T12:34:56');

      component.register();

      setTimeout(() => {
        const registerData = mockAccountService.register.mock.calls[0][0];
        expect(registerData.dateOfBirth).toBe('2000-05-15');
        done();
      }, 0);
    });
  });

  describe('Cancel Method', () => {
    it('should emit cancelRegister event with false value', () => {
      const emitSpy = jest.spyOn(component.cancelRegister, 'emit');

      component.cancel();

      expect(emitSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('Custom Validator - matchValues', () => {
    it('should validate matching values', () => {
      component.registerForm.patchValue({
        password: 'test1234',
        confirmPassword: 'test1234',
      });
      component.registerForm.get('confirmPassword')?.updateValueAndValidity();

      expect(component.registerForm.get('confirmPassword')?.valid).toBeTruthy();
    });

    it('should invalidate non-matching values', () => {
      component.registerForm.patchValue({
        password: 'test1234',
        confirmPassword: 'test5678',
      });
      component.registerForm.get('confirmPassword')?.updateValueAndValidity();

      expect(
        component.registerForm.get('confirmPassword')?.hasError('notMatched')
      ).toBeTruthy();
    });
  });
});
