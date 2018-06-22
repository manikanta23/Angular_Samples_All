import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CustomerModalService {    
    public notifyShowModalEventEmitter: EventEmitter<any> = new EventEmitter();
    public notifyCustomerSelectEventEmitter: EventEmitter<any> = new EventEmitter();
    public notifyShowMSCPayerModalEventEmitter: EventEmitter<any> = new EventEmitter();
    constructor() { }

    public notifyShowCustomerModal(data: any) {
        if (data) {
            this.notifyShowModalEventEmitter.emit(data);
        }
    }

    public notifyShowMSCPayerCustomerModal(data: any) {
        if (data) {
            this.notifyShowMSCPayerModalEventEmitter.emit(data);
        }
    }

    public notifyCustomerSelection(data: any) {
        if (data) {
            this.notifyCustomerSelectEventEmitter.emit(data);
        }
    }
}