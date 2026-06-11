import {Component, computed, inject, input} from '@angular/core';
import {Message} from "../../core/models/message.models";
import {DatePipe} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import {marked} from "marked";

@Component({
      selector: 'app-message',
      imports: [DatePipe],
      templateUrl: './message.component.html',
      styleUrl: './message.component.scss',
})
export class MessageComponent {
      message = input<Message>()
      private sanitizer = inject(DomSanitizer);

      formattedContent = computed(() => {
            const content = this.message()?.content || '';
            if (this.message()?.mine) return content;

            const html = marked.parse(content) as string;
            return this.sanitizer.bypassSecurityTrustHtml(html);
      })
}
