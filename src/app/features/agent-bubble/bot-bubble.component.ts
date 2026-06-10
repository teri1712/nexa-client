import {Component, HostListener, inject} from '@angular/core';
import {Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
      selector: 'app-bot-bubble',
      imports: [MatButtonModule, MatIconModule],
      templateUrl: './bot-bubble.component.html',
      styleUrl: './bot-bubble.component.scss',
})
export class BotBubbleComponent {
      router = inject(Router);

      @HostListener('click')
      onClick() {
            this.router.navigate([{
                  outlets: {
                        right: 'messages'
                  }
            }]);
      }
}
