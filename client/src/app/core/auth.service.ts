import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { API_URL } from './api';
import { AuthResponse, User } from './models';

const TOKEN_KEY = 'grove-token';
const USER_KEY = 'grove-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly user = signal<User | null>(this.readUser());
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly isLoggedIn = computed(() => !!this.token());

  constructor() {
    if (this.token()) {
      this.http.get<{ user: User }>(`${API_URL}/auth/me`).subscribe({
        next: (res) => {
          this.user.set(res.user);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        },
        error: () => this.clear(),
      });
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap((res) => this.persist(res)));
  }

  register(name: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, { name, email, password })
      .pipe(tap((res) => this.persist(res)));
  }

  logout(): void {
    this.clear();
  }

  private persist(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.token.set(res.token);
    this.user.set(res.user);
  }

  private clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.user.set(null);
  }

  private readUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
