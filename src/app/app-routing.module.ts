import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'get',
    loadChildren: () => import('./get/get.module').then( m => m.GetPageModule)
  },
  {
    path: 'set',
    loadChildren: () => import('./set/set.module').then( m => m.SetPageModule)
  },
  {
    path: 'set/:type/:id',
    loadChildren: () => import('./set/set.module').then( m => m.SetPageModule)
  },
  {
    path: 'rules',
    loadChildren: () => import('./rules/rules.module').then( m => m.RulesPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'backup',
    loadChildren: () => import('./backup/backup.module').then( m => m.BackupPageModule)
  },
  {
    path: 'restore',
    loadChildren: () => import('./restore/restore.module').then( m => m.RestorePageModule)
  },
  {
    path: 'import',
    loadChildren: () => import('./import/import.module').then( m => m.ImportPageModule)
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
