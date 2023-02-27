public with sharing class ContactController {
    @AuraEnabled (cacheable = true)
    public static List<Contact> getRelatedContact(String accountId) {
        return [
            SELECT Id, Salutation, FirstName, LastName,
                   Email, Phone, Title, AccountId
            FROM Contact
            WHERE AccountId = :accountId LIMIT 10
        ];
    }

    @AuraEnabled
    public static Contact insertRecord (
        Id accountId, Contact contact,
        Id contactId, Opportunity opportunity
    ) {
        Contact con = contact;

        if (contactId == null) {
            con.AccountId = accountId;
            insert con;
            contactId = con.Id;
        }

        Opportunity opp = opportunity;
        opp.ContactId = contactId;
        opp.AccountId = accountId;

        insert opp;
        return con;
    }
    
}