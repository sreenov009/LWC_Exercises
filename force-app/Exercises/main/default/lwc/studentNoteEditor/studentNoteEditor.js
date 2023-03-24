import { LightningElement, api, wire } from 'lwc';
import { getFieldValue, getRecord, updateRecord} from 'lightning/uiRecordApi';
import Utils from 'c/utils';
import { reduceErrors } from 'c/ldsUtils';

import FIELD_ATTENDEE_ID from '@salesforce/schema/Course_Attendee__c.Id';
import FIELD_INSTRUCTOR_NOTES from '@salesforce/schema/Course_Attendee__c.InstructorNotes__c';

const detailFields = [FIELD_INSTRUCTOR_NOTES];

export default class StudentNoteEditor extends LightningElement {
	
	_historyOptions = [];
	_editorInitialized=false;
	
	courseAttendeeId;
	instructorNotes = '';

	@wire(getRecord, { recordId: '$courseAttendeeId', fields: detailFields })
	wiredCourseAttendee({ error, data }) {
		if (data) {
			let updatedNotes = getFieldValue(data, FIELD_INSTRUCTOR_NOTES);
			this.instructorNotes = (updatedNotes == null) ? '' : updatedNotes;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.record = undefined;
        }
    }

	@api 
	get history() {
		return this._historyOptions;
	}
	set history(historyData) {

		if (typeof historyData !== 'undefined') {
			this._historyOptions = [];

			let found = false;
			historyData.forEach(c => {
				if (c.courseAttendeeId === this.courseAttendeeId) {
					found = true;
				}
				let label = c.courseName + ' ' +c.startDate;
				this._historyOptions.push({
					value: c.courseAttendeeId,
					label
				});
			});
			if (!found && this._historyOptions.length > 0) {
				this.courseAttendeeId = this._historyOptions[0].value;
			} 
		}
	}

	renderedCallback() {
		//without the following, the rich text area doesn't show text until first click
		if (!this._editorInitialized) {
			this._editorInitialized = true;
			this.template.querySelector('lightning-input-rich-text').focus();
		}
	}

	onCourseChange(event) {
		this.courseAttendeeId = event.target.value;
	}
	onNoteChange(event) {
		this.instructorNotes = event.target.value;
	}
	onSave() {
		let fieldsToSave = {};
		fieldsToSave[FIELD_ATTENDEE_ID.fieldApiName] = this.courseAttendeeId;
		fieldsToSave[FIELD_INSTRUCTOR_NOTES.fieldApiName] = this.instructorNotes;
		
		const recordInput = { fields:fieldsToSave}

		updateRecord(recordInput)
			.then(() => {
				Utils.showToast(this,'Success', 'Notes updated', 'success');
			})
			.catch(error => {
				let errors = reduceErrors(error);
				let errorBody = (errors.length) ? errors[0] : 'There was a problem updating your record.';
				Utils.showToast(this,'Error updating record', errorBody, 'error');
			});
			 
	}

	

}