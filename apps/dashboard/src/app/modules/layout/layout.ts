import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  imports: [RouterModule, Navbar],
  selector: 'app-layout',
  templateUrl: './layout.html',
})
export class Layout {}
