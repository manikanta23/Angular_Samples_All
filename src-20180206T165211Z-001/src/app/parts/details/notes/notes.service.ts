import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { Notes } from "./../../../_entities/notes.entity";

@Injectable()
export class NotesService {
    constructor(
        private http: Http,
        private commonDataService: CommonDataService) { }

    getNotes(partId: string, partNumber: string, noteId: number): Promise<any> {

        let url: string = `api/Notes?partId=${partId}&partNumber=${partNumber}&noteId=${noteId}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }


    createNotes(newNote): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(`api/Notes/Create`, newNote, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: any): any {
        if (res.ErrorType != undefined && res.ErrorType != 200) {
            return res;
        }
        if (res != undefined && res != null) {
            return res.json() || {};
        }
        else {
            return {};
        }
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || "";
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(error);
        return Promise.reject(errMsg);
    }
}
