import {Component, inject} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {TokenStore} from '../../core/services/token-store.service';

@Component({
  selector: 'app-home',
  imports: [MatChipsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  protected readonly tokenService = inject(TokenStore);
  protected readonly profile = this.tokenService.profile;
  protected readonly isAdmin = this.tokenService.isAdmin;
}

