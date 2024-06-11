import { Injectable } from '@angular/core';
import { User } from '../shared/models/User';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { IUserLogin } from '../shared/interface/IUserLogin';
import { URLS } from '../shared/constants/urls';
import { IUserRegister } from '../shared/interface/IUserRegister';

const USER_KEY = "User";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private setUserLocalStorage(user: User) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    private getUserLocalStorage(): User {
        if(typeof window !== 'undefined') {
            const userJson = localStorage.getItem(USER_KEY);
            if(userJson) {
                return JSON.parse(userJson) as User;
            }
        }
        return new User();
    }

    private userSubject = new BehaviorSubject<User>(this.getUserLocalStorage());
    public userObservable:Observable<User>;

    constructor(private http:HttpClient, private toastrService:ToastrService) { 
        this.userObservable = this.userSubject.asObservable();
    }

    public currentUser(): User {
        return this.userSubject.value;
    }

    login = (userLogin: IUserLogin) : Observable<User> => {
        return this.http.post<User>(
            URLS.USERS.LOGIN,
            userLogin  
        ).pipe(
            tap({
                next: (user) => {
                    this.setUserLocalStorage(user);
                    this.userSubject.next(user);
                    this.toastrService.success('Login successful');
                },
                error: (errorResponse) => {
                    this.toastrService.error(
                        'Login failed' 
                        + (errorResponse as HttpErrorResponse).error.message
                    );
                }
            })
        );
    }

    logout = () => {
        if(typeof window !== 'undefined') {
            this.userSubject.next(new User());
            localStorage.removeItem(USER_KEY);
            window.location.reload();
        }
    }

    register = (userRegister: IUserRegister): Observable<User> => {
        userRegister.roleScope = "user";
        return this.http.post<User>(
            URLS.USERS.REGISTER,
            userRegister
        ).pipe(
            tap({
                next: (user) => {
                    this.setUserLocalStorage(user);
                    this.userSubject.next(user);
                    this.toastrService.success('Registration successful');
                },
                error: (errorResponse) => {
                    this.toastrService.error(
                        'Registration failed' 
                        + (errorResponse as HttpErrorResponse).error.message
                    );
                }
            })
        );
    }
}
