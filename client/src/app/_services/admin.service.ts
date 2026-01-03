import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsersWithRoles() {
    return this.http.get<User[]>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUsersRoles(userName: string, roles: string[]) {
    console.log(roles);
    return this.http.post<string[]>(
      this.baseUrl +
        'admin/edit-roles/' +
        userName +
        '?roles=' +
        roles.join(','),
      {}
    );
  }

  updateUserNameAndPassword(
    currentUserName: string,
    newUserName: string,
    newPassword: string,
    newKnownAs: string
  ) {
    return this.http.post(
      this.baseUrl + 'admin/update-user/' + currentUserName,
      { newUserName, newPassword, newKnownAs }
    );
  }
}
