import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home',       loadChildren: () => import('./pages/home/home.module')   .then( m => m.HomePageModule  )},
    { path: 'login',      loadChildren: () => import('./pages/login/login.module') .then( m => m.LoginPageModule )},
    { path: 'tabs',       loadChildren: () => import('./pages/tabs/tabs.module')   .then( m => m.TabsPageModule  )},
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
