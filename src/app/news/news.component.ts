import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { parseString } from 'xml2js';
import { Observable } from 'rxjs';

@Component({
    selector: 'news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
    data: any;
    titles: string[] = [];
    titleNow = '';
    descriptionNow = '';
    descriptions: string[] = [];
    private timer;
    private counter = 0;

    constructor(private http:Http) {    
    }

    ngOnInit() {
        this.timer = Observable.timer(0, 10000);
        this.timer.subscribe((t) => this.onTimeOut());

        var headers = new Headers();
        headers.append('Accept', 'application/xml');
        this.http.get('https://www.vrt.be/vrtnws/nl.rss.headlines.xml', {headers: headers})
            .map(res => {
                var myRes
                parseString(res.text(), function (err, result) {
                    myRes = result;
                });
                return myRes;
            })
            .subscribe(res => {
                this.data = res;
                this.parseData(this.data);
            });

    }

    parseData(data) {
        var i;
        for (i = 0; i < 5; i++) {
            this.titles[i] = data.feed.entry[i].title[0]._;
            this.descriptions[i] = data.feed.entry[i].summary[0]._;
        }
    }

    onTimeOut() {
        if (this.counter >= 5) {
            this.counter = 0;
        }
        this.titleNow = this.titles[this.counter];
        this.descriptionNow = this.descriptions[this.counter];
        this.counter++;
    }

}
