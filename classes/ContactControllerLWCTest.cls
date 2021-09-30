@IsTest
public with sharing class ContactControllerLWCTest {
    @IsTest
    public static void findContactsByNameTest() {
       
        Contact contactA = new Contact(LastName = 'Alan');
        insert contactA;
        Contact contactB = new Contact(LastName = 'Bibo');
        insert contactB;
        
        List<Contact> ctContact = ContactControllerLWC.findContactsByName('Alan','');
        System.assertEquals(1, ctContact.size());
        System.assertEquals(contactA.id, ctContact[0].id);
    }
    @IsTest
    public static void findContactsSortOrderByNameTest() {
        
        Contact contactA = new Contact(LastName = 'Alan');
        insert contactA;
        Contact contactB = new Contact(LastName = 'Bibo');
        insert contactB;
        
        List<Contact> ctContact = ContactControllerLWC.findContactsByName('',null);
        System.assertEquals(2, ctContact.size());
        System.assertEquals(contactA.id, ctContact[0].id);
        System.assertEquals(contactB.id, ctContact[1].id);
        
        List<Contact> ctContact2 = ContactControllerLWC.findContactsByName('','DESC');
        System.assertEquals(2, ctContact2.size());
        System.assertEquals(contactB.id, ctContact2[0].id);
        System.assertEquals(contactA.id, ctContact2[1].id);
    }
    @IsTest
    public static void findContactsByNameErrorTest() {
        try { 
            List<Contact> ctContact = ContactControllerLWC.findContactsByName('', '');
        } catch(AuraHandledException e) {
            System.assert(!String.isEmpty(e.getMessage()));  
        }
    }
    
    @IsTest
    public static void deleteContactFromDBTest() {
        Test.startTest();
        Contact cont = new Contact(LastName = 'TestCont', Contact_Level__c = 'Primary');
        insert cont;
        Test.stopTest();
        ContactControllerLWC.deleteContactFromDB(cont.id);
        List<Contact> conts = [SELECT Id FROM Contact];
        System.assertEquals(0, conts.size(), 'Количество всех контактов после удаление должно быть равно 0.');  
    }
    
    @IsTest
    public static void findContactsByNameEmptyTest() {
        
        Contact contactA = new Contact(LastName = 'Alan');
        insert contactA;
        Contact contactB = new Contact(LastName = 'Bibo');
        insert contactB;
        
        List<Contact> ctContact = ContactControllerLWC.findContactsByName('','');
        System.assertEquals(2, ctContact.size());
    }
}