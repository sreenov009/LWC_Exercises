import { LightningElement, wire } from 'lwc';
import Utils from 'c/utils';
import { getRecord} from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import SELECTED_STUDENT_CHANNEL from '@salesforce/messageChannel/SelectedStudentChannel__c';
import { NavigationMixin } from 'lightning/navigation';

import FIELD_Name from '@salesforce/schema/Contact.Name';
import FIELD_Description from '@salesforce/schema/Contact.Description';
import FIELD_Email from '@salesforce/schema/Contact.Email';
import FIELD_Phone from '@salesforce/schema/Contact.Phone';
const fields = [FIELD_Name, FIELD_Description, FIELD_Email, FIELD_Phone];

import getCoursesAttended from '@salesforce/apex/StudentDetail.getCoursesAttended';

export default class StudentDetail extends NavigationMixin(LightningElement) {

	studentId;
	subscription;
	history;

	@wire(MessageContext) messageContext;

	@wire(getRecord, { recordId: '$studentId', fields })
	wiredStudent;

	@wire(getCoursesAttended, {contactId: '$studentId'})
	wired_getCoursesAttended(result) {
		let data = result.data;
		let error = result.error;
		this.history = [];
		if (data) {
			this.history = data.map ( (c) => ({
				courseAttendeeId: c.Id,
				startDate: c.Course_Delivery__r.Start_Date__c,
				courseName: c.Course_Delivery__r.Course__r.Name,
				instructorNotes: (c.InstructorNotes__c) ? c.InstructorNotes__c : 'No Notes',
				status: c.Status__c,
				instructorName: (c.Course_Delivery__r.Instructor__c) ? c.Course_Delivery__r.Instructor__r.Name : 'Unassigned',
				label: c.Course_Delivery__r.Course__r.Name + ' ' +c.Course_Delivery__r.Start_Date__c
			}));
		} else if (error) {
			this.error=error;
		}
	}
	
	connectedCallback() {
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

	disconnectedCallback() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}

	get name() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Name);
	}
	get description() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Description);
	}
	get phone() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Phone);
	}
	get email() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Email);
	}
	
	get cardTitle() {
		let title = "Please select a student";
		if (this.wiredStudent.data) {
			title = this.name;
		} else if (this.wiredStudent.error) {
			title = "Something went wrong..."
		}
		return title;
	}

	get hasHistory() {
		return this.history && this.history.length > 0;
	}
	handleStudentChange(message) {
		this.studentId = message.studentId;
	}

	onGoToRecord(evt) {
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: this.studentId,
				actionName: 'view'
			},
		});
	}
	
}