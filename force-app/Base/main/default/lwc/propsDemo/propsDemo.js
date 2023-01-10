import { LightningElement, track } from 'lwc';

export default class PropsDemo extends LightningElement {
    counter = 3;

    myUntrackedIDs = [1,2,3];

    @track myTrackedIDs = [1,2,3];

    changeUntracked() {   
        this.counter++;
        this.myUntrackedIDs.push(this.counter);
    }

    changeTracked() {    
        this.counter++;
        this.myTrackedIDs.push(this.counter);
    }
}