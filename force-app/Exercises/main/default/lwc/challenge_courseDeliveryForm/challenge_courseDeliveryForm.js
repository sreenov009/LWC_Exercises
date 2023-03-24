import { LightningElement,api} from 'lwc';
import courseDelivery from '@salesforce/schema/Course_Delivery__c';
import FIELD_City from '@salesforce/schema/Course_Delivery__c.City__c';
import FIELD_Country from '@salesforce/schema/Course_Delivery__c.Country__c';

export default class Challenge_courseDeliveryForm extends LightningElement {
    fields = [FIELD_City, FIELD_Country]; 

    @api recordId;
    get courseDelivery(){
        return courseDelivery;
    }
    
}