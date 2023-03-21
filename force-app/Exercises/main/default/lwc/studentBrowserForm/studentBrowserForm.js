import { LightningElement ,wire} from 'lwc';
import getInstructors from '@salesforce/apex/StudentBrowserForm.getInstructors';
import getDeliveriesByInstructor from '@salesforce/apex/StudentBrowserForm.getDeliveriesByInstructor';

export default class StudentBrowserForm extends LightningElement {
    instructors =[];
    selectedInstructorId = '';
    deliveries = [];
    selectedDeliveryId = '';
    Error;
    @wire(getInstructors)
    wired_getInstructors({error,data}){
        debugger;
        this.instructors =[];
        if(data){
            this.instructors.push({
                value:'',
                label:'Select an Instructor'
            })
            console.log(data);
            data.forEach(instructor =>{
                this.instructors.push({
                    value:instructor.Id,
                    label: instructor.Name
                });
            });

        }else if(error){
            this.error = error;
            console.log(error);
        }
    }
    @wire(getDeliveriesByInstructor,{instructorId:'$selectedInstructorId'})
    wired_getDeliveriesByInstructor({ error, data }) {
        this.deliveries = [];
        if (data && data.length) {
            
            this.deliveries = data.map(delivery => ({
                value: delivery.Id,
                label: `${delivery.Start_Date__c} ${delivery.Location__c} ${delivery.Attendee_Count__c} students`
            }));
    
            this.deliveries.unshift({
                value: '',
                label: 'Any Delivery' 
            });
    
        } else if (error) {
            this.error = error;
        }
    }
    onInstructorChange(event){
        this.selectedDeliveryId='';
        this.selectedInstructorId=event.target.value;
    }
}