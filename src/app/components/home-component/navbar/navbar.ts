import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import { RevealDirective } from '../../../directives/reveal.directive';

@Component({
  selector: 'app-navbar',
  imports: [RevealDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
}
