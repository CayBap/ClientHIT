import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { QuestionManagerComponent } from './question-manager/question-manager.component';
import { CompetitiveManagerComponent } from './competitive-manager/competitive-manager.component';
import { MatterialModule } from '../material/material.module';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';
import { EditCompetitiveDialogComponent } from './competitive-manager/edit-competitive-dialog/edit-competitive-dialog.component';
import { EditAddDialogComponent } from './question-manager/question-dialog/question-dialog.component';
import { EditUserDialogComponent } from './user-manager/edit-user-dialog/edit-user-dialog.component';
@NgModule({
  imports: [CommonModule, AdminRoutingModule, MatterialModule, FormsModule, ReactiveFormsModule],
  // tslint:disable-next-line:max-line-length
  declarations: [
    AdminComponent,
    UserManagerComponent,
    QuestionManagerComponent,
    CompetitiveManagerComponent,
    QuestionDialogComponent,
    EditCompetitiveDialogComponent,
    EditAddDialogComponent,
    EditUserDialogComponent
  ],
  exports: [QuestionDialogComponent],
  // tslint:disable-next-line:max-line-length
  entryComponents: [QuestionDialogComponent, EditCompetitiveDialogComponent, EditUserDialogComponent, QuestionDialogComponent, EditAddDialogComponent]
})
export class AdminModule {}
