import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { UserService } from '../services/user.service';
import { SocketService } from '../socket/socket.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  panelOpenState = false;
  token;
  role;
  name;
  studentId;
  session;
  md5;
  socket: SocketService;
  constructor(private router: Router, private user: UserService) {}

  ngOnInit() {
    //   alert('thang')
  }
  LogOut() {
    let token = localStorage.getItem('token');
    if (token) {
      if (this.socket) {
        this.socket.disconnect();
        this.socket.onDisconnect().subscribe(result => {});
      }
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
  }
  checkRole() {
    this.md5 = new Md5();
    this.studentId = localStorage.getItem('studentId');
    this.session = sessionStorage.getItem('session');
    let s = this.md5.appendStr(this.role + this.studentId).end();
    if (this.session == s) {
      return true;
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('studentId');
      localStorage.removeItem('name');
      return false;
    }
  }
}
