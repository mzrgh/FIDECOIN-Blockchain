/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';


import { ConsortiumComponent } from './Consortium/Consortium.component';
import { GenericsComponent } from './Generics/Generics.component';
import { CustomerComponent } from './Customer/Customer.component';
import { MemberComponent } from './Member/Member.component';
import { StoreComponent } from './Store/Store.component';

import { GiveFIDCComponent } from './GiveFIDC/GiveFIDC.component';
import { TransferFIDCComponent } from './TransferFIDC/TransferFIDC.component';
import { BuyFIDCComponent } from './BuyFIDC/BuyFIDC.component';
import { SellFIDCComponent } from './SellFIDC/SellFIDC.component';
import { InitSystemComponent } from './InitSystem/InitSystem.component';
import { SetupDemoComponent } from './SetupDemo/SetupDemo.component';
import { AllTransactionsComponent } from './AllTransactions/AllTransactions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'About', component: AboutComponent},
  { path: 'Consortium', component: ConsortiumComponent },
  { path: 'Generics', component: GenericsComponent },
  { path: 'Customer', component: CustomerComponent },
  { path: 'Member', component: MemberComponent },
  { path: 'Store', component: StoreComponent },
  { path: 'GiveFIDC', component: GiveFIDCComponent },
  { path: 'TransferFIDC', component: TransferFIDCComponent },
  { path: 'BuyFIDC', component: BuyFIDCComponent },
  { path: 'SellFIDC', component: SellFIDCComponent },
  { path: 'InitSystem', component: InitSystemComponent },
  { path: 'SetupDemo', component: SetupDemoComponent },
  { path: 'AllTransactions', component: AllTransactionsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
