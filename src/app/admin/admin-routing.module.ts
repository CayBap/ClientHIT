import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CompetitiveManagerComponent } from './competitive-manager/competitive-manager.component';
import { QuestionManagerComponent } from './question-manager/question-manager.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'question-manager', component: QuestionManagerComponent },
      { path: 'competitive-manager', component: CompetitiveManagerComponent },
      { path: 'user-manager', component: UserManagerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
