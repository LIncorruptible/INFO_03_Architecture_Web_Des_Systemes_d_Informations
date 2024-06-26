import { Injectable } from '@angular/core';
import { User } from '../shared/models/User';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IUserLogin } from '../shared/interface/IUserLogin';
import { URLS } from '../shared/constants/urls';
import { IUserRegister } from '../shared/interface/IUserRegister';
import { INewUser } from '../shared/interface/INewUser';
import { IEditUser } from '../shared/interface/IEditUser';

const USER_KEY = "User";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    users!: User[];

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
    
    userObservable:Observable<User>;
    usersObservable: Observable<User[]> = new Observable<User[]>();

    constructor(private http:HttpClient, private toastrService:ToastrService) { 
        this.userObservable = this.userSubject.asObservable();

        this.getAll().subscribe((newUsers) => {
            this.users = newUsers;
            this.usersObservable = new Observable<User[]>(subscriber => {
                subscriber.next(this.users);
            });
        });
    }

    public currentUser(): User {
        return this.userSubject.value;
    }

    getAll = () : Observable<User[]> => {
        return this.http.get<User[]>(URLS.USERS.BASE);
    }

    getById = (id: string) : Observable<User> => {
        return this.http.get<User>(URLS.USERS.BY_ID + id);
    }

    getBySearchTerms = (searchTerm: string) : Observable<User[]> => {
        return this.http.get<User[]>(URLS.USERS.BY_SEARCH + searchTerm);
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
                        + ' ' + (errorResponse as HttpErrorResponse).error.message
                    );
                }
            })
        );
    }

    logout = () => {
        if(typeof window !== 'undefined') {
            this.userSubject.next(new User());
            localStorage.removeItem(USER_KEY);
            this.toastrService.success('Logout successful');
        }
    }

    register = (userRegister: IUserRegister): Observable<User> => {
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
                        'Registration failed ' 
                        + (errorResponse as HttpErrorResponse).error.message
                    );
                }
            })
        );
    }

    create = (user: INewUser): Observable<User> => {
        return this.http.post<User>(
            URLS.USERS.ADD,
            user
        ).pipe(
            tap({
                next: (user) => {
                    this.toastrService.success('User created');
                },
                error: (errorResponse) => {
                    this.toastrService.error(
                        'User creation failed ' 
                        + (errorResponse as HttpErrorResponse).error.message
                    );
                }
            })
        );
    }

    edit = (user: IEditUser): Observable<User> => {
        return this.http.put<User>(
            URLS.USERS.UPDATE + this.getUserLocalStorage().id,
            { user: user }
        ).pipe(
            tap({
                next: (user) => {
                    this.setUserLocalStorage(user);
                    this.userSubject.next(user);
                    this.toastrService.success('User edited');
                },
                error: (errorResponse) => {
                    this.toastrService.error(
                        'User edition failed ' 
                        + (errorResponse as HttpErrorResponse).error.message
                    );
                }
            })
        );
    }

    remove = (userToDelete: User): Observable<User[]> => {
        return this.http.delete<User[]>(
            URLS.USERS.DELETE + userToDelete.id
        ).pipe(
            tap({
                next: (user) => {
                    this.toastrService.success('User deleted');
                },
                error: (errorResponse) => {
                    this.toastrService.error(
                        'User deletion failed ' 
                        + (errorResponse as HttpErrorResponse).error.message
                    );
                }
            })
        );
    }
}
