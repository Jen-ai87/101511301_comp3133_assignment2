import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User, AuthPayload } from '../models/user.model';
import { LOGIN_QUERY, SIGNUP_MUTATION } from '../graphql/operations';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());

  constructor(private apollo: Apollo, private router: Router) {}

  private loadUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(usernameOrEmail: string, password: string): Observable<AuthPayload> {
    return this.apollo
      .query<{ login: AuthPayload }>({
        query: LOGIN_QUERY,
        variables: { usernameOrEmail, password },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result) => {
          const payload = result.data!.login;
          localStorage.setItem('currentUser', JSON.stringify(payload.user));
          this.currentUserSubject.next(payload.user);
          return payload;
        })
      );
  }

  signup(username: string, email: string, password: string): Observable<User> {
    return this.apollo
      .mutate<{ signup: User }>({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password },
      })
      .pipe(
        map((result) => result.data!.signup)
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.apollo.client.clearStore();
    this.router.navigate(['/login']);
  }
}
