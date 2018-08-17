import { NgModule } from '@angular/core';
import {AuthService} from './auth.service';
import { UserService } from './user.service';
import { PlayService } from './play.service';
import { QuestionService } from './quesion.service';
import { ProblemService } from './problem.service';
import { SubmitService } from './submit.service';
@NgModule({
    declarations: [],
    imports: [ ],
    exports: [],
    providers: [AuthService,UserService,PlayService,QuestionService,ProblemService,SubmitService],
})
export class APIModule {}
