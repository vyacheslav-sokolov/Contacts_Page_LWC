public with sharing class ContactControllerLWC {

    @AuraEnabled(Cacheable=true)
    public static List<Contact> findContactsByName(String searchKey, String order) {
            String searchKeyword = '%' + searchKey + '%';

            List<Contact> contactListRecord = new List<Contact>();

            if (String.isBlank(order)) {
                contactListRecord = [SELECT Id, FirstName, LastName, Email, AccountId, Account.Name, MobilePhone, CreatedDate FROM Contact WHERE Name LIKE :searchKeyword ORDER BY Name LIMIT 15];
            } else {
                contactListRecord = [SELECT Id, FirstName, LastName, Email, AccountId, Account.Name, MobilePhone, CreatedDate FROM Contact WHERE Name LIKE :searchKeyword ORDER BY Name DESC LIMIT 15];
            }

            if(contactListRecord.size() == 0){
                throw new AuraHandledException('No Record Found..');
            }
            return contactListRecord;
    }
    @AuraEnabled
    public static void deleteContactFromDB(String contactId) {
        Contact cont = [SELECT Id FROM Contact WHERE Id = :contactId];
        List<Case> CaseList = [SELECT Id FROM Case WHERE ContactId = :contactId];
        delete CaseList;
        delete cont;
    }
}