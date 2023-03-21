import { LightningElement, wire, api } from 'lwc';
import{subscribe, unsubscribe, MessageContext} from 'lightning/messageService';
import SELECTED_STUDENT_CHANNEL from '@salesforce/messageChannel/SelectedStudentChannel__c';
import {NavigationMixin} from 'lightning/navigation';
// TODO #1: import the getRecord, getFieldValue, and getFieldDisplayValue functions from lightning/uiRecordApi.
import {getRecord, getFieldValue, getFieldDisplayValue} from 'lightning/uiRecordApi';

// TODO #2: We've imported the name field and placed it into an array for you.
//          To prepare for Lab 1, import the Description, Email, and Phone fields and add them to the array.
import FIELD_Name from '@salesforce/schema/Contact.Name';
import FIELD_Description from '@salesforce/schema/Contact.Description';
import FIELD_Email from '@salesforce/schema/Contact.Email';
import FIELD_Phone from '@salesforce/schema/Contact.Phone';
import contactID from '@salesforce/schema/Contact.Id';

const fields = [FIELD_Name,FIELD_Description,FIELD_Email,FIELD_Phone];
export default class StudentDetail extends LightningElement {

	// TODO #3: locate a valid Contact ID in your scratch org and store it in the studentId property.
	// Example: studentId = '003S000001SBAXEIA5';
	studentId;
	subscription;
	@api recordId;

	//TODO #4: use wire service to call getRecord, passing in our studentId and array of fields.
	//		   Store the result in a property named wiredStudent.
	@wire(getRecord, { recordId:'$studentId', fields})
	wiredStudent;

	@wire(MessageContext) messageContext;
		
	get name() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Name);
	}
    get description() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Description);
	}
    get phone() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Phone);
	}
    get email() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Email);
	}
	//TODO #5: We provided a getter for the name field. 
	// 		   To prepare for Lab 1, create getters for the description, phone, and email fields.
	
	//TODO #6: Review the cardTitle getter, and the _getDisplayValue function below.
	get cardemail() {
		let studentem = "";
		if (this.wiredStudent.data){
			studentem = this.email;
		} else if (this.wiredStudent.error) {
			studentph = "Something went wrong..."
		}
		return studentem;
	}
	get cardTitle() {
		let title = "";
		if (this.wiredStudent.data){
			title = this.name;
		} else if (this.wiredStudent.error) {
			studentph = "Something went wrong..."
		}
		return title;
	}
	get carddesc() {
		let studentdesc = "";
		if (this.wiredStudent.data){
			studentdesc = this.description;
		} else if (this.wiredStudent.error) {
			studentph = "Something went wrong..."
		}
		return studentdesc;
	}
	get cardphone() {
		let studentph = "";
		if (this.wiredStudent.data){
			studentph = this.phone;
		} else if (this.wiredStudent.error) {
			studentph = "Something went wrong..."
		}
		return studentph;
	}
	connectedCallback(){
		if(this.subscription){
			return;
		}
		this.subscription = subscribe(
			this.messageContext,
			SELECTED_STUDENT_CHANNEL,
			(message) => {
				this.handleStudentChange(message)
			}
		);
	}

	disconnectedCallback(){
		unsubscribe(this.subscription);
		this.subscription=null;
	}

	handleRecord(){
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: this.studentId,
				actionName: 'view'
			},
		});
    }

	handleStudentChange(message){
		this.studentId = message.studentId;
	}
	_getDisplayValue(data, field) {
		return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
	}
	
}