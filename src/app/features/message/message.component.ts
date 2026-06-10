import {Component, input} from '@angular/core';
import {Message} from "../../core/models/message.models";
import {DatePipe} from "@angular/common";

@Component({
      selector: 'app-message',
      imports: [DatePipe],
      templateUrl: './message.component.html',
      styleUrl: './message.component.scss',
})
export class MessageComponent {
      message = input<Message>()
}
