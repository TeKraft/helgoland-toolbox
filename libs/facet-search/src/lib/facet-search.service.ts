import { Injectable, Optional } from '@angular/core';
import { HelgolandTimeseries, Timespan } from '@helgoland/core';
import { Observable, ReplaySubject } from 'rxjs';

import { FacetParameter, ParameterFacetSort, ParameterFacetType } from './facet-search-model';

export abstract class FacetSearchService {
  abstract getResults(): Observable<HelgolandTimeseries[]>;
  abstract getParameterList(type: ParameterFacetType, sort: ParameterFacetSort): FacetParameter[];
  abstract selectParameter(type: ParameterFacetType, parameter: FacetParameter): any;
  abstract setTimeseries(timeseries: HelgolandTimeseries[]);
  abstract getFilteredResults(): HelgolandTimeseries[];
  abstract setSelectedTimespan(timespan: Timespan);
  abstract getSelectedTimespan(): Timespan;
  abstract getFilteredTimespan(): Timespan;
  abstract getCompleteTimespan(): Timespan;
  abstract resetAllFacets();
  abstract areFacetsSelected(): boolean;
}

@Injectable()
export class FacetSearchConfig {
  showZeroValues?: boolean;
}

@Injectable()
export class FacetSearchServiceImpl implements FacetSearchService {

  private onResultsChanged: ReplaySubject<HelgolandTimeseries[]> = new ReplaySubject(1);

  private facets: Map<ParameterFacetType, FacetParameter> = new Map();

  private timeseries: HelgolandTimeseries[];

  private selectedTimespan: Timespan;

  private filteredTimeseries: HelgolandTimeseries[];

  private nullable = false;

  constructor(
    @Optional() config?: FacetSearchConfig
  ) {
    if (config && config.showZeroValues) { this.nullable = config.showZeroValues; }
  }

  public setTimeseries(ts: HelgolandTimeseries[]) {
    this.timeseries = ts;
    this.setFilteredTimeseries();
  }

  public getResults(): Observable<HelgolandTimeseries[]> {
    return this.onResultsChanged.asObservable();
  }

  public getParameterList(type: ParameterFacetType, sort: ParameterFacetSort): FacetParameter[] {
    let params = [];
    if (this.filteredTimeseries) {
      switch (type) {
        case ParameterFacetType.category:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.category); }
          this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.category, e.parameters.category.label));
          break;
        case ParameterFacetType.feature:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.feature); }
          this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.feature, e.parameters.feature.label));
          break;
        case ParameterFacetType.offering:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.offering); }
          this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.offering, e.parameters.offering.label));
          break;
        case ParameterFacetType.phenomenon:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.phenomenon); }
          this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.phenomenon, e.parameters.phenomenon.label));
          break;
        case ParameterFacetType.procedure:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.procedure); }
          this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.procedure, e.parameters.procedure.label));
          break;
      }
    }
    return this.sortParameters(params, sort);
  }

  public selectParameter(type: ParameterFacetType, parameter: FacetParameter) {
    if (parameter.selected) {
      this.facets.set(type, parameter);
    } else {
      this.facets.delete(type);
    }
    this.setFilteredTimeseries();
  }

  public areFacetsSelected(): boolean {
    return this.facets.size > 0 || !!this.selectedTimespan;
  }

  public getFilteredResults(): HelgolandTimeseries[] {
    return this.filteredTimeseries;
  }

  public getCompleteTimespan(): Timespan {
    return this.createTimespan(this.timeseries);
  }

  public setSelectedTimespan(timespan: Timespan) {
    this.selectedTimespan = timespan;
    this.setFilteredTimeseries();
  }

  public getSelectedTimespan(): Timespan {
    return this.selectedTimespan;
  }

  public getFilteredTimespan(): Timespan {
    return this.createTimespan(this.filteredTimeseries);
  }

  public resetAllFacets() {
    this.facets.clear();
    this.selectedTimespan = null;
    this.setFilteredTimeseries();
  }

  private createTimespan(timeseriesList: HelgolandTimeseries[]): Timespan {
    let timespan: Timespan = null;
    if (timeseriesList.length > 0) {
      timespan = { from: Infinity, to: 0 };
      timeseriesList.forEach(e => {
        if (e.firstValue && e.lastValue) {
          if (e.firstValue.timestamp < timespan.from) { timespan.from = e.firstValue.timestamp; }
          if (e.lastValue.timestamp > timespan.to) { timespan.to = e.lastValue.timestamp; }
        }
      });
    }
    if (timespan.from !== Infinity && timespan.to !== 0) {
      return timespan;
    }
  }

  private setFilteredTimeseries() {
    if (this.facets.size > 0 || this.selectedTimespan) {
      this.filteredTimeseries = this.timeseries.filter(e => {
        const matchCategory = this.checkFacet(ParameterFacetType.category, e.parameters.category.label);
        const matchFeature = this.checkFacet(ParameterFacetType.feature, e.parameters.feature.label);
        const matchOffering = this.checkFacet(ParameterFacetType.offering, e.parameters.offering.label);
        const matchPhenomenon = this.checkFacet(ParameterFacetType.phenomenon, e.parameters.phenomenon.label);
        const matchProcedure = this.checkFacet(ParameterFacetType.procedure, e.parameters.procedure.label);
        const matchTimespan = this.checkTimespan(e);
        return matchCategory && matchFeature && matchOffering && matchPhenomenon && matchProcedure && matchTimespan;
      });
    } else {
      this.filteredTimeseries = this.timeseries;
    }
    if (this.filteredTimeseries) {
      this.onResultsChanged.next(this.filteredTimeseries);
    }
  }

  private checkTimespan(ts: HelgolandTimeseries): boolean {
    if (this.selectedTimespan) {
      const checkfrom = this.selectedTimespan.from <= ts.lastValue.timestamp && this.selectedTimespan.to >= ts.firstValue.timestamp;
      return checkfrom;
    }
    return true;
  }

  private checkFacet(type: ParameterFacetType, parameter: string): boolean {
    if (this.facets.has(type)) {
      return parameter === this.facets.get(type).label;
    }
    return true;
  }

  private sortParameters(list: FacetParameter[], sort: ParameterFacetSort): FacetParameter[] {
    if (sort === null || sort === ParameterFacetSort.none) { return list; }
    list.sort((a, b) => {
      switch (sort) {
        case ParameterFacetSort.ascCount:
          return a.count - b.count;
        case ParameterFacetSort.descCount:
          return b.count - a.count;
        case ParameterFacetSort.ascAlphabet:
          return b.label < a.label ? 1 : -1;
        case ParameterFacetSort.descAlphabet:
          return b.label > a.label ? 1 : -1;
      }
    });
    return list;
  }

  private addParameter(list: FacetParameter[], type: ParameterFacetType, entry: string) {
    const existing = list.find(e => e.label === entry);
    if (existing) {
      existing.count += 1;
    } else {
      list.push({
        label: entry,
        count: 1,
        selected: this.checkSelection(type, entry)
      });
    }
  }

  private createEmptyParamList(type: ParameterFacetType): FacetParameter[] {
    const params: FacetParameter[] = [];
    this.timeseries.forEach(ts => {
      if (!params.find(e => e.label === ts.parameters[type].label)) {
        params.push({ label: ts.parameters[type].label, count: 0, selected: this.checkSelection(type, ts.parameters[type].label) });
      }
    });
    return params;
  }

  private checkSelection(type: ParameterFacetType, entry: string): boolean {
    return this.facets.has(type) && this.facets.get(type).label === entry;
  }

}
