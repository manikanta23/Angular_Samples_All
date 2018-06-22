import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NationalInventoryModalService {
    private notifyShowNationalInventoryModal = new Subject<any>();
    /**
     * Observable string streams
     */
    notifyShowNationalInventoryModalObservable = this.notifyShowNationalInventoryModal.asObservable();

    constructor() { }

    public notifyNationalInventoryModal(data: any) {
        if (data) {
            this.notifyShowNationalInventoryModal.next(data);
        }
    }
}