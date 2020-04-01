import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { ParameterFacetComponent } from './components/parameter-facet/parameter-facet.component';
import { ResultListComponent } from './components/result-list/result-list.component';
import { ResultMapComponent } from './components/result-map/result-map.component';
import { FacetSearchService, FacetSearchServiceImpl } from './facet-search.service';

const COMPONENTS = [
  ParameterFacetComponent,
  ResultListComponent,
  ResultMapComponent,
];

@NgModule({
  imports: [
    CommonModule,
    HelgolandCoreModule
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS],
  providers: [
    {
      provide: FacetSearchService,
      useClass: FacetSearchServiceImpl
    }
  ]
})
export class HelgolandFacetSearchModule { }
