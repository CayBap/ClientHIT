import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { UserService } from '../services';
import { MatDialog, MatTableDataSource, PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogQ } from '../admin/dialog.component';
import { SocketService } from '../socket/index';
@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.css']
})
export class JudgeComponent implements OnInit {
  displayedColumns = ['position', 'name', 'studentId', 'exScore', 'interviewScore', 'status', 'online', 'action'];
  dataSource;
  interviewRef;
  data = {
    total: 10,
    docs: []
  };
  pageEvent: PageEvent;
  pageIndex;

  currentPage = 1;
  currentLimit = 10;
  count = 0;
  constructor(private user: UserService, public dialog: MatDialog, public socket: SocketService) {}

  ngOnInit() {
    this.SetData(1, 10);
    this.socket.onUpdateInterview().subscribe(result => {
      console.log(result);
      console.log(this.data.docs.findIndex(d => d.studentId === result.studentId));
      this.data.docs[this.data.docs.findIndex(d => d.studentId === result.studentId)].playId.isInterviewing = true;
      this.dataSource = new MatTableDataSource<Object>(this.data.docs);
    });
    // setTimeout(() => {
    //   this.data.docs[1].playId.isInterviewing = false;
    //   this.dataSource = new MatTableDataSource<Object>(this.data.docs);
    // }, 5000);
  }
  // Init Function
  SetData(page, limit) {
    this.user.GetUsers(page, limit, undefined).then(result => {
      this.data = result.data;
      console.log(this.data);
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
    });
  }
  GetIndexPage(event) {
    this.user.GetUsers(event.pageIndex + 1, event.pageSize, undefined).then(result => {
      this.currentPage = event.pageIndex + 1;
      this.currentLimit = event.pageSize;
      this.data = result.data;
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
    });
  }
  openDialog(title: string, content: string, studentId: string, callback: Function) {
    const dialogRef = this.dialog.open(DialogQ, {
      width: '250px',
      data: { name: title, content: content }
    });

    dialogRef.afterClosed().subscribe(result => {
      return callback(result);
    });
  }
  // Style Function
  getBtnDisable(playId) {
    if (playId.isInterviewing === true || playId.interviewScore !== 0 || playId === undefined) {
      return true;
    }
    return false;
  }
  CheckEx(playId) {
    if (playId.status == 1) {
      return 'Đang thi';
    } else {
      return 'Đã thi';
    }
  }
  checkStatus(playId) {
    if (playId.status === 1) {
      return 'Đang làm bài thi';
    }
    if (playId.isInterviewing === true) {
      return 'Đang phỏng vấn';
    }
    if (playId.status === 0 && playId.isInterviewing === false) {
      if (playId.interviewScore === 0) {
        return 'Chưa phỏng vấn';
      } else {
        return 'Đã phỏng vấn';
      }
    }
  }
  getStyle(playId) {
    if (playId.status === 1) {
      return 'red';
    }
    if (playId.isInterviewing === true) {
      return 'green';
    }
    if (playId.status === 0 && playId.isInterviewing === false) {
      if (playId.interviewScore === 0) {
        return;
      } else {
        return 'red';
      }
    }
  }
  getRow(element) {
    if (this.data.docs.indexOf(element) % 2 === 0) {
      return 'white';
    } else {
      return 'rgba(0,0,0,.03)';
    }
  }
  // Feature Function
  showDialog(element, command) {
    if (command === 'interview') {
      this.openDialog('Thông báo', 'Bạn muốn phỏng vấn ' + element.name + '?', element.studentId, result => {
        if (result === true) {
          // this.interviewRef = this.dialog.open(InterViewDialogComponent, {
          //   width: '500px',
          //   data: element
          // });
          this.socket.startInterview(element.studentId);

          this.data.docs[this.data.docs.findIndex(d => d._id === element._id)].playId.isInterviewing = true;
          this.dataSource = new MatTableDataSource<Object>(this.data.docs);
          // this.updateRef.afterClosed().subscribe(result => {
          //   this.user.Update(result).then(re => {
          //     this.SetData(this.currentPage, this.currentLimit);
          //     this.openSnackBar('Cập nhập người dùng thành công ', 'Đóng');
          //   });
          // });
        }
      });
    }
  }
}
@Component({
  selector: 'app-interviewdialog',
  templateUrl: 'interview-dialog.component.html'
})
export class InterViewDialogComponent {
  constructor(public dialogRef: MatDialogRef<InterViewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
