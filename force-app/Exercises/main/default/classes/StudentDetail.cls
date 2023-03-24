public with sharing class StudentDetail {
	@AuraEnabled(cacheable=true)
	public static List < Course_Attendee__c > getCoursesAttended(String contactId) {
		return [
			SELECT 
				Id, 
				InstructorNotes__c, 
				Status__c,
				Course_Delivery__r.Instructor__r.Name,
				Course_Delivery__r.Start_Date__c, 
				Course_Delivery__r.Course__r.Name
			FROM Course_Attendee__c
			WHERE Student__c =: contactId
			WITH SECURITY_ENFORCED
		];
	}
}
