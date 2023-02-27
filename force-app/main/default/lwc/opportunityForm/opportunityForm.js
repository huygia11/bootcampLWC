import { LightningElement, track, api, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';

export default class OpportunityForm extends LightningElement {

    // store opportunity passed by parent
    @api defaultOpportunity = {};
    // get opportunity stages picklist
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: STAGE_FIELD })
    stages

    handleChangeInput(e) {
        let value = e.target.value;
        let name = e.target.name;

        this.dispatchEvent(
            new CustomEvent('stored', { detail: { name: name, value: value } })
        )
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