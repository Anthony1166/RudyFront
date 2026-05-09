import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Perfil} from '../home-component/perfil/perfil';
import {FooterPrincipal} from '../home-component/footer-principal/footer-principal';


@Component({
  selector: 'app-testing-component',
  standalone: true,
  imports: [CommonModule, FooterPrincipal],
  templateUrl: './testing-component.html',
  styleUrls: ['./testing-component.css']
})
export class TestingComponent {

}
