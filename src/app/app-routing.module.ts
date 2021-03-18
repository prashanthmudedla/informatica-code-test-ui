import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityComponent } from './entity/entity.component';


const routes: Routes = [
  { path: '', component: EntityComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
