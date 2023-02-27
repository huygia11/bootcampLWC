import { LightningElement, track, api, wire } from 'lwc';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// imported controller
import getRelatedContact from '@salesforce/apex/ContactController.getRelatedContact';
import insertRecord from '@salesforce/apex/ContactController.insertRecord';
// lwc ui
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';

export default class BootcampContainer extends LightningElement {
    @track account = { Name: 'Sample Account' };
    // output contact
    @track contact = {};
    // output opportunity
    @track opportunity = {};
    // button label
    @track btnLabel = 'Next';
    // switch page boolean
    @track isContactPage = true;
    // disable input boolean
    @track disabledContactForm = false;
    // Spinner
    @api isSpinner = false;
    // contacts list
    @track relatedContacts = [
        {
            Id: 1,
            Salutation: 'Mr',
            FirstName: 'Phap',
            LastName: 'Mai',
            Email: 'phap.mai@aodigy.com',
            Phone: `(+84) ${Math.floor(Math.random() * 900000000)}`,
            Title: 'Leader'
        },
        {
            Id: 2,
            Salutation: 'Mrs',
            FirstName: 'Khanh',
            LastName: 'Do',
            Email: 'khanh.do@aodigy.com',
            Phone: `(+84) ${Math.floor(Math.random() * 900000000)}`,
            Title: 'Mentor'
        },
        {
            Id: 3,
            Salutation: 'Mr',
            FirstName: 'Thien',
            LastName: 'Phung',
            Email: 'thien.phung@aodigy.com',
            Phone: `(+84) ${Math.floor(Math.random() * 900000000)}`,
            Title: 'Developer'
        },
        {
            Id: 4,
            Salutation: 'Mr',
            FirstName: 'Quang',
            LastName: 'Tran',
            Email: 'quang.tran@aodigy.com',
            Phone: `(+84) ${Math.floor(Math.random() * 900000000)}`,
            Title: 'Developer'
        },
        {
            Id: 5,
            Salutation: 'Ms',
            FirstName: 'Nga',
            LastName: 'Tran',
            Email: 'nga.tran@aodigy.com',
            Phone: `(+84) ${Math.floor(Math.random() * 900000000)}`,
            Title: 'Developer'
        },
    ];

    // get salesforce account name
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNT_NAME_FIELD] })
    record;

    get accountName() {
        return getFieldValue(this.record.data, ACCOUNT_NAME_FIELD);
    }

    // get salesforce related contacts of account
    @wire(getRelatedContact, { accountId: '$recordId' })
    wiredRelatedContactStream( {error, data} ) {
        data && (this.relatedContacts = data);
    }

    set contact_(value) {
        this.contact = value;
        this.disabledContactForm = !!this.contact.Id;
    }

    handleOnSwitchPage() {
        let contactForm = this.template.querySelector("c-contact-form");

        if (this.isContactPage == true) {
            let isValidContact = contactForm.isInputValid();

            if (isValidContact) {
                this.isContactPage = !this.isContactPage;
                this.btnLabel = this.isContactPage == true ? "Next" : "Back";
            }
        }
        else if (this.isContactPage == false) {
            this.isContactPage = !this.isContactPage;
            this.btnLabel = this.isContactPage == true ? "Next" : "Back";
        }
    }

    handleStoredContact(e) {
        let name = e.detail.name;
        let value = e.detail.value;
        this.contact[name] = value;
    }

    handleStoredOpp(e) {
        let name = e.detail.name;
        let value = e.detail.value;
        this.opportunity[name] = value;
    }

    handleSelectedContact(e) {
        this.contact_ = e.detail;
    }

    handleUnselectedContact(e) {
        this.contact_ = {};
    }

    handleOnSubmit() {
        let oppForm = this.template.querySelector("c-opportunity-form");
        let isValidOpp = oppForm.isInputValid();
 
        if (isValidOpp) {
            this.isSpinner = true;

            insertRecord({
                // insert contact
                accountId: this.recordId,
                contact: this.contact,
                // insert opportunity
                contactId: this.contact.Id,
                opportunity: this.opportunity,
            })
            .then (rs => {
                console.log("đã thêm ====>", JSON.stringify(rs));
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent(
                    { variant: 'warning', title: 'Fail!', message: error, }
                ));
            })
            .finally(rs => {
                this.isSpinner = false;

                this.dispatchEvent(new ShowToastEvent(
                    { variant: 'success', title: 'Success!', message: '', }
                ));

                this.contact = {};
                this.opportunity = {};
                this.disabledContactForm = false;
                this.isContactPage = true;
            })
        }
    }
}