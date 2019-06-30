import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleError, HttpErrorHandler } from '../handle-error/http-error-handler.service';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private handleError: HandleError;

  private subjectPaginateList = new Subject<any[]>();
  private subjectTotalPages = new Subject<number>();

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler) {
    this.handleError = this.httpErrorHandler.createHandleError("PaginationService");
  }

  readPaginateList<T>(): Observable<T[]> {
    return this.subjectPaginateList.asObservable();
  }

  readTotalPages(): Observable<number> {
    return this.subjectTotalPages.asObservable();
  }

  getPage(page: number, baseUrl: string) {
    const url = [environment[baseUrl], ['paging?page', page].join('=')].join('/');
    this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError(['getPage', page].join('/'), []))
      )
      .subscribe(_ => {
        this.subjectPaginateList.next(_['results']);
        this.subjectTotalPages.next(_['totalPages']);
      });
  }
}
