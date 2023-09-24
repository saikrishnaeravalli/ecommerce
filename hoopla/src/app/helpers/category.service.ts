import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private selectedCategorySubject = new BehaviorSubject<string>('All');
  selectedCategory$: Observable<string> = this.selectedCategorySubject.asObservable();

  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }
}
