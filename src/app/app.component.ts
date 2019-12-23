import { Component, Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { switchMap, debounceTime, shareReplay, delay } from 'rxjs/operators';

type Data = any;

@Injectable()
class SearchService implements OnDestroy {

  items: Observable<Data>;

  private term: Subject<string> = new Subject<string>();

  constructor() {
    /**
     * We initialize the stream, and will be store the response.
     */
    this.items = this.term.pipe(
      debounceTime(250),
      /**
       * It's would like this.http.get(...)
       */
      switchMap((term: string) => loadAndSearch(term)),
      shareReplay(1)
    )
  }

  search(term: string) {
    /**
     * Set the value which the search stream will work.
     */
    return this.term.next(term);
  }

  ngOnDestroy(): void {
    this.term.complete();
  }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [ SearchService ]
})
export class AppComponent  {
  name = 'Angular';
  constructor(readonly search: SearchService) {}
}


/**
 * Simple mock for backend requests.
 */
const data = Array(100).fill(0).map(Math.random);
function loadAndSearch(term: string): Observable<Data> {
  const filtered = data.filter((item) => `${item}`.match(term));
  return of(filtered).pipe(delay(100));
}