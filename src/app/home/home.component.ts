import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor() { }

  onMenuOptionClick(option: string): void {
    console.log('Menu option clicked:', option);
    // Logique pour gérer le clic sur les options du menu
  }
}
