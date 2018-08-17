import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {  MatDialog, MatTableDataSource , PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogQ } from '../dialog.component';
import { ProblemService } from "../../services/problem.service";
import { Router } from '@angular/router';

@Component({
    selector: 'admin-question',
    templateUrl: './problem.component.html',
    styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {
    displayedColumns = ['position', 'title','sortName', 'level', 'language','correctScore', 'action'];
    // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    dataSource;
    count = 0;
    updateRef;
    data = {
        total:10
    }
    pageEvent: PageEvent;
    pageIndex;
    currentPage = 1;
    currentLimit = 10;

    constructor(private queS: ProblemService, public dialog: MatDialog, public snackBar: MatSnackBar,private router:Router) { }

    ngOnInit() {
        let token = localStorage.getItem('token');
        this.queS.checkLogin(token).then(result=>{
            this.SetData(1, 10);
        }).catch(err=>{
            localStorage.removeItem('token');
            localStorage.removeItem('studentId');
            localStorage.removeItem('name');
            localStorage.removeItem('role');
            this.router.navigate(['login']);
        })
    }

    SetData(page, limit) {

        this.queS.GetQuestions(page, limit).then(result => {
            this.data = result.data;
            console.log(this.data)
            this.dataSource = new MatTableDataSource<Object>(result.data.docs);
        })
    }
    GetIndexPage(event){
        this.queS.GetQuestions((event.pageIndex+1),event.pageSize).then(result=>{
            this.currentPage = (event.pageIndex+1);
            this.currentLimit = event.pageSize;
            this.data = result.data;
            this.dataSource = new MatTableDataSource<Object>(result.data.docs);
        })
    }
    openDialog(title: string, content: string, studentId: string, callback: Function) {
        let dialogRef = this.dialog.open(DialogQ, {
            width: '250px',
            data: { name: title, content: content }

        });

        dialogRef.afterClosed().subscribe(result => {
            return callback(result);
        });
    }
    Open(studentId: string,title:String ,comand: string) {
        if (comand == 'delete') {
            this.openDialog('Thông báo', 'Bạn có muốn xóa problem ' + title, studentId, (result) => {
                if (result == true) {
                    this.queS.DeleteQuestion(studentId)
                        .then(resultDelete => {
                            if (resultDelete.code == 1) {
                                this.openSnackBar(resultDelete.message, 'Đóng');
                                this.SetData(this.currentPage,this.currentLimit);
                            } else {
                                this.openSnackBar(resultDelete.message, 'Đóng');
                            }
                        })
                        .catch(err => console.log(err));
                }
            });
        }
    }
    Update(id: string) {
        this.queS.GetQuestionById(id)
        .then(data=>{
            console.log(data.data)
            if(data.code==1){
                this.updateRef = this.dialog.open(EditProblem, {
                    width: '500px',
                    data: data.data
                });
                this.updateRef.afterClosed().subscribe(result=>{
                    this.queS.Update(result).then(re=>{
                        this.SetData(this.currentPage,this.currentLimit);
                        this.openSnackBar("Cập nhập câu hỏi thành công ", 'Đóng');
                    })
                });
            }else{
                this.openSnackBar("Bạn không có quyền ", 'Đóng');
            }
        })
        .catch(err=>{
            this.openSnackBar("Không tìm thấy câu hỏi", 'Đóng');
        })

    }
    Add(){
        let data = {
          title: "",
          content: "",
          input:"",
          output:"",
          example:{
              inputEx:"",
              outputEx:""
          },
          correctScore:"",
          level:3,
          timeLimit:"",
          memmoryLimit:"",
          cluster:"",
          language:""
        }

        this.updateRef = this.dialog.open(AddProblem, {
            width: '500px',
            data: data
        });
        this.updateRef.afterClosed().subscribe(result=>{
          console.log(result)
            this.queS.Add(result).then(re=>{
                this.SetData(this.currentPage,this.currentLimit);
                this.openSnackBar("Thêm câu hỏi thành công ", 'Đóng');
            }).catch(err=>{
                this.openSnackBar("Thêm câu hỏi thất bại ", 'Đóng');
            })
        });
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 4000,
        });
    }
}
@Component({
    selector: 'dialog-update',
    templateUrl:'update.component.html',
    styleUrls: ['./problem.component.css']
})
export class EditProblem {

    constructor(
        public dialogRef: MatDialogRef<EditProblem>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    onNoClick(): void {
        this.dialogRef.close();
    }

}
@Component({
    selector: 'dialog-add',
    templateUrl:'add.component.html',
    styleUrls: ['./problem.component.css']
})
export class AddProblem {

    constructor(
        public dialogRef: MatDialogRef<AddProblem>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    onNoClick(): void {
        this.dialogRef.close();
    }

}
