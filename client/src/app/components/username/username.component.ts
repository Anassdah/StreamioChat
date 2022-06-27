import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {
 @Output() userNameEvent = new EventEmitter<string>();
 userName:string='';

  constructor() { }

  ngOnInit(): void {
  }
  setUserName(): void {
    this.userNameEvent.emit(this.userName);
  }

}
