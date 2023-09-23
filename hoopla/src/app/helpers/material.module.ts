import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTableModule} from '@angular/material/table';


@NgModule({
    exports: [
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatSelectModule,
        MatRadioModule,
        MatListModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatTableModule
    ]
})
export class MaterialModule { }
