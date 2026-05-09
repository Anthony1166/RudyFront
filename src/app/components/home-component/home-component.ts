import { Component } from '@angular/core';
import {Navbar} from './navbar/navbar';
import {Main1} from './main1/main1';
import {FooterPrincipal} from './footer-principal/footer-principal';
import {Perfil} from './perfil/perfil';
import { NavbarProd } from "./Desarrollo-comp-prod/navbar-prod/navbar-prod";
import { FooterP1 } from "./footer-p1/footer-p1";

@Component({
  selector: 'app-home-component',
  imports: [
    Navbar,
    Main1,
    Perfil,
    FooterP1
],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {

}
