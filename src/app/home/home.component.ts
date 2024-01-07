import { Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  menuOuvert: boolean = false;

  @ViewChild('menuContainerRef') menuContainerRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  cliquerHorsDuMenu(event: MouseEvent) {
    // Vérifiez si le clic est en dehors du conteneur du menu
    if (this.menuOuvert && !this.menuContainerRef.nativeElement.contains(event.target)) {
      this.menuOuvert = false;
    }
  }

  basculerMenu() {
    this.menuOuvert = !this.menuOuvert;
  }

  onMenuOptionClick(option: string) {
    console.log(option);
    // Traitez l'option de menu sélectionnée ici
    // ...
  }
}
