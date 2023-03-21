import { LightningElement, api} from 'lwc';

export default class Challenge_currentDateTime extends LightningElement {
    reloadedDateTime = new Date();
    buttonClick(){
        this.reloadedDateTime = new Date();
    }
    connectedCallback(){
        setInterval(() => {
            this.reloadedDateTime = new Date();
        }, 1000);
    }
}