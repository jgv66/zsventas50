import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'inicio' ,   children: [ { path: '', loadChildren: () => import('../tabinicio/tabinicio.module')  .then(m => m.TabinicioPageModule ) }] },
      { path: 'carrito',   children: [ { path: '', loadChildren: () => import('../tabcarrito/tabcarrito.module').then(m => m.TabcarritoPageModule) }] },
      { path: 'miconfig',  children: [ { path: '', loadChildren: () => import('../tabconfig/tabconfig.module')  .then(m => m.TabconfigPageModule)  }] },      
      { path: 'tareas',    children: [ { path: '', loadChildren: () => import('../tabtarea/tabtarea.module')    .then(m => m.TabtareaPageModule)   }] },
      { path: 'salida',    children: [ { path: '', loadChildren: () => import('../tabsalida/tabsalida.module')  .then(m => m.TabsalidaPageModule)  }] },
      { path: '', redirectTo: '/tabs/(inicio:inicio)', pathMatch: 'full' },
    ]
  },
  { path: '',    redirectTo: '/tabs/(inicio:inicio)',   pathMatch: 'full' },
  { path: 'menuseteo',           children: [ { path: '', loadChildren: () => import('../menuseteo/menuseteo.module')           .then(m => m.MenuseteoPageModule      ) }] },
  { path: 'ctacteclientes',      children: [ { path: '', loadChildren: () => import('../ctacteclientes/ctacteclientes.module') .then(m => m.CtacteclientesPageModule ) }] },
  { path: 'documento/:id',       children: [ { path: '', loadChildren: () => import('../documento/documento.module')           .then(m => m.DocumentoPageModule      ) }] },
  { path: 'ultimosdocs/:td',     children: [ { path: '', loadChildren: () => import('../ultimosdocs/ultimosdocs.module')       .then(m => m.UltimosdocsPageModule    ) }] },
  { path: 'crearclientes',       children: [ { path: '', loadChildren: () => import('../crearclientes/crearclientes.module')   .then(m => m.CrearclientesPageModule  ) }] },
  { path: 'ultmovs/:dataP',      children: [ { path: '', loadChildren: () => import('../ultimosmovs/ultimosmovs.module')       .then(m => m.UltimosmovsPageModule    ) }] },
  { path: 'sugerencias/:dataP',  children: [ { path: '', loadChildren: () => import('../sugerencias/sugerencias.module')       .then(m => m.SugerenciasPageModule    ) }] },
  { path: 'notif/:dataP',        children: [ { path: '', loadChildren: () => import('../notificaciones/notificaciones.module') .then(m => m.NotificacionesPageModule ) }] },
  { path: 'crearnvi/:dataP',     children: [ { path: '', loadChildren: () => import('../crearnvi/crearnvi.module')             .then(m => m.CrearnviPageModule       ) }] },
  { path: 'socialsh/:dataP',     children: [ { path: '', loadChildren: () => import('../socialsh/socialsh.module')             .then(m => m.SocialshPageModule       ) }] },  
  { path: 'fichatecnica/:dataP', children: [ { path: '', loadChildren: () => import('../fichatecnica/fichatecnica.module')     .then(m => m.FichatecnicaPageModule   ) }] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
