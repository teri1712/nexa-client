import {Component, HostListener, inject, input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
      selector: 'app-bot-bubble',
      standalone: true,
      imports: [MatButtonModule, MatIconModule],
      templateUrl: './bot-bubble.component.html',
      styleUrl: './bot-bubble.component.scss',
})
export class BotBubbleComponent {
      router = inject(Router);
      route = inject(ActivatedRoute);
      docId = input<string>();

      @HostListener('click')
      onClick() {
            this.router.navigate([{
                  outlets: {
                        right: ['messages']
                  }
            }], { relativeTo: this.route });
      }
}
