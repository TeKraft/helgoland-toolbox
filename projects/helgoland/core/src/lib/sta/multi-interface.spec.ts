import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from '../core.module';
import { SplittedDataDatasetApiInterface } from '../dataset-api/splitted-data-api-interface.service';
import { Timespan } from '../model/internal/timeInterval';
import { MultiDatasetInterface } from './multi-interface';
import { StaReadInterfaceService } from './read/sta-read-interface.service';

describe('HttpService', () => {

    const staUrl = 'http://docker.srv.int.52north.org:8081/sta/';
    const apiUrl = 'https://www.fluggs.de/sos2/api/v1/';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HelgolandCoreModule,
                TranslateTestingModule
            ],
            providers: [
                MultiDatasetInterface,
                SplittedDataDatasetApiInterface,
                StaReadInterfaceService
            ]
        });
    });

    fit('should be created', inject([MultiDatasetInterface], (service: MultiDatasetInterface) => {
        const url = staUrl;
        // service.getTimeseries(url, { expanded: false }).subscribe(
        //     series => {
        //         console.log(JSON.stringify(series, null, 2));
        //         if (series.length > 0) {
        //             const id = series[0].id;
        //             const timespan = new Timespan(new Date(2019, 9, 11, 9, 18).valueOf(), new Date(2019, 9, 11, 10, 26).valueOf());
        //             service.getTsData(id, url, timespan).subscribe(
        //                 ts => console.log(JSON.stringify(ts, null, 2)),
        //                 error => console.error(error)
        //             );
        //         }
        //     },
        //     error => console.error(error)
        // );
        // testStations(service, url);
        testServices(service, staUrl);
        expect(service).toBeDefined();
    }));

});

function testServices(service: MultiDatasetInterface, staUrl: string) {
    service.getServices(staUrl).subscribe(services => {
        console.log(JSON.stringify(services, null, 2));
    });
}

function testStations(service: MultiDatasetInterface, url: string) {
    service.getStations(url).subscribe(res => {
        console.log(JSON.stringify(res, null, 2));
        if (res.length > 0) {
            service.getStation(res[0].id, url).subscribe(entry => {
                console.log(entry);
            });
        }
    });
}

