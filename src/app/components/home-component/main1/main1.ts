import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import { RevealDirective } from '../../../directives/reveal.directive';

@Component({
  selector: 'app-main1',
  imports: [RouterLink, RevealDirective],
  templateUrl: './main1.html',
  styleUrl: './main1.css'
})
export class Main1 {

}
