import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private loggedInUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.loggedInUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(catchError(this.handleError));
  }

  // იმიტირებული Login (რეალურ პროექტში backend ამოწმებს პაროლს და აბრუნებს ტოკენს)
  login(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      tap((users) => {
        if (users.length > 0) {
          const fakeToken = btoa(users[0].email + new Date().getTime());
          localStorage.setItem('token', fakeToken);
          localStorage.setItem('user', JSON.stringify(users[0]));
          this.loggedInUserSubject.next(users[0]);
        }
      }),
      catchError(this.handleError),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedInUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Server error, please try again later.'));
  }
}
