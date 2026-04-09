import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-home',
  imports: [MatChipsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  protected readonly tokenService = inject(TokenService);
  protected readonly profile = this.tokenService.profile;
  protected readonly isAdmin = this.tokenService.isAdmin;
}

