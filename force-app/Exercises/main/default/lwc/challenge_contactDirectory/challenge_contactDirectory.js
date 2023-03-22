import { LightningElement,wire } from 'lwc';
import getContacts from '@salesforce/apex/Contacts.getContacts';
const alpha = Array.from(Array(26)).map((e, i) => i + 65);

export default class Challenge_contactDirectory extends LightningElement {
    letters = alpha.map((x) => String.fromCharCode(x));
    firstLetter = '';
	@wire(getContacts, {firstLetter: '$firstLetter'}) contacts;

    columnConfig = [
        {
            label: 'Name',
            fieldName: 'Name',
            type: 'text'
        },{
            label: 'Email',
            fieldName: 'Email',
            type: 'email'
        },{
            label: 'Phone',
            fieldName: 'Phone',
            type: 'phone'
        }
    ];

    firstLetters(event){
        this.firstLetter = event.detail.value;
    }
}