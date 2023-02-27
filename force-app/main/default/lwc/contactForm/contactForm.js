import { LightningElement, api, track, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

import SALUTATION_FIELD from '@salesforce/schema/Contact.Salutation';

export default class BootcampForm extends LightningElement {
    // table columns
    columns = [
        { label: '' },
        { label: 'Salutation' },
        { label: 'First Name' },
        { label: 'Last Name' },
        { label: 'Email' },
        { label: 'Phone Number' },
        { label: 'Title' },
    ];
    // contacts list passed from parent
    @api relatedContacts = [];
    // contact passed from parent
    @api defaultContact = {};
    // pass disable to parent
    @api disabledContactForm = false;

    // get salutations picklist
    @api salutations
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: SALUTATION_FIELD })
    wiredSalutations({ error, data }) {
        data && (this.salutations = data.values.map(s => {
            return {
                label: s.label,
                value: s.value
            }
        }))
    }

    handleInputChange(e) {
        let value = e.target.value;
        let name = e.target.name;
        console.log(JSON.stringify(this.salutations))

        this.dispatchEvent(
            new CustomEvent('stored', { detail: { name: name, value: value } })
        );
    }

    @api
    isInputValid() {
        let isValid = true;
        let inputs = this.template.querySelectorAll(".validate");

        inputs.forEach(input => {
            if (!input.reportValidity()) {
                isValid = false;
            }
        })

        return isValid;
    }
}
