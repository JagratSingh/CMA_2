import { Router } from "@angular/router";
import { User } from "../app.model";
import users from "./user.data";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    user: User | null = null;

    constructor(private router: Router) {
        const storedUser = localStorage.getItem('loggedInUser');  // 👈 FIXED
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        }
    }

    login({ email, password }: { email: string; password: string }): boolean {
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) {
            return false;
        }
        this.user = user;
        localStorage.setItem('loggedInUser', JSON.stringify(user));  // 👈 FIXED
        this.router.navigate([user.role === 'ADMIN' ? 'admin' : 'employee'], { replaceUrl: true }); // 👈 Route based on role
        return true;
    }

    logout(): void {
        this.user = null;
        localStorage.removeItem('loggedInUser');  // 👈 FIXED
        this.router.navigate(['login'], { replaceUrl: true });
    }

    isUserLoggedIn(): boolean {
        return !!this.user;
    }

    isAdmin(): boolean {
        return this.user?.role === 'ADMIN';
    }

    isEmployee(): boolean {
        return this.user?.role === 'EMPLOYEE';
    }
}
