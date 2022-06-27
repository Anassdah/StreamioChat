import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  title='Angular-IVS';
  options ={
    sources: [{
      src:  'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8',
      type: 'application/x-mpegURL'
    }],
    fluid: true,
    aspectRatio: '16:9',
    autoplay: true,
    controls: true,
}   
  userName:string="mama";
  message:string = '';
  messageList: {message: string, userName: string, mine: boolean}[] = [];
  userList: string[] = [];
  room:string="streamername"
  socket: any;
  idtest: string | undefined;
  constructor() { }

  ngOnInit(): void {
    //this.socket.emit('join-room',this.room)
    //this.socket.emit('connection', this.room);
   // this.socket.on('connect',()=>{this.socket.emit('join-room',this.room)})
   this.socket = io.io(`localhost:4004?userName=${this.userName}&room=${this.room}`);
   this.socket.emit('set-user-name', name,this.room);
   this.socket.on('output-messages',(data: any)=>{
     //console.log(data);
     if (data.length){
       data.forEach((message: any) => {
         if(this.room==message.room){
           if(message.username==this.userName){
             this.messageList.push({message: message.msg, userName: message.username, mine: true});
           }
           else{
             this.messageList.push({message: message.msg, userName: message.username, mine: false});
           }
         }
         
       });
     }
   })

   /*this.socket.on('user-list', (userList: string[]) => {
     this.userList = userList;
     //this.socket.id=this.room;
     this.idtest=this.socket.id;
   });*/

   this.socket.on('message-broadcast', (data: {message: string, userName: string}) => {
     if (data) {
       this.messageList.push({message: data.message, userName: data.userName, mine: false});
     }
   });
  }
  userNameUpdate(name: string): void {
    this.socket = io.io(`localhost:4004?userName=${name}&room=${this.room}`);
    this.userName = name;
    this.socket.emit('set-user-name', name,this.room);
    this.socket.on('output-messages',(data: any)=>{
      //console.log(data);
      if (data.length){
        data.forEach((message: any) => {
          if(this.room==message.room){
            if(message.username==this.userName){
              this.messageList.push({message: message.msg, userName: message.username, mine: true});
            }
            else{
              this.messageList.push({message: message.msg, userName: message.username, mine: false});
            }
          }
          
        });
      }
    })

    /*this.socket.on('user-list', (userList: string[]) => {
      this.userList = userList;
      //this.socket.id=this.room;
      this.idtest=this.socket.id;
    });*/

    this.socket.on('message-broadcast', (data: {message: string, userName: string}) => {
      if (data) {
        this.messageList.push({message: data.message, userName: data.userName, mine: false});
      }
    });
  }

  sendMessage(): void {
    this.socket.emit('message',this.message,this.room);
    this.messageList.push({message: this.message, userName: this.userName, mine: true});
    this.message = '';
  }
  async joinRoom(){
    this.socket.emit('join-room',this.room);
  }



}