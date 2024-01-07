import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userConnected: boolean = false;
  accountMenuOpened: boolean = false;
  burgerMenuOpened: boolean = false;

  @ViewChild('menuContainerRef') menuContainerRef!: ElementRef;
  @ViewChild('menuBurger') menuBurger!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.accountMenuOpened && !this.menuContainerRef.nativeElement.contains(event.target)) {
      this.accountMenuOpened = false;
    }
    if (this.burgerMenuOpened && !this.menuBurger.nativeElement.contains(event.target)) {
      this.burgerMenuOpened = false;
    }
  }

  toggleAccountMenu(event: MouseEvent) {
    event.stopPropagation();
    this.accountMenuOpened = !this.accountMenuOpened;
  }

  toggleBurgerMenu(event: MouseEvent) {
    event.stopPropagation();
    this.burgerMenuOpened = !this.burgerMenuOpened;
  }

  onAccountMenuOptionClick(option: string) {
    console.log(option);
    // Traitez l'option de menu sélectionnée ici
    this.accountMenuOpened = false; // Ferme le menu compte après la sélection d'une option
  }
}
