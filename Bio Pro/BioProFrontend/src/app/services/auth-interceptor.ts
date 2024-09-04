import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {
        if (sessionStorage.getItem('Token')) {
            const jwt = JSON.parse(sessionStorage.getItem('Token')!)
            const token = jwt.token
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + token)
            });

             return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}