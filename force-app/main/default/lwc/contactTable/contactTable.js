import { LightningElement, track, wire, api } from 'lwc';

export default class contactTable extends LightningElement {
    columns = [
        { label: '' },
        { label: 'Salutation' },
        { label: 'First Name' },
        { label: 'Last Name' },
        { label: 'Email' },
        { label: 'Phone Number' },
        { label: 'Title' },
    ];

    @api relatedContacts = [];
    @api selectedContact = {};
    @api defaultContact = {};

    renderedCallback() {
        let buttons = this.template.querySelectorAll("lightning-button-icon-stateful");

        buttons.forEach(btn => {
            btn.selected = btn.dataset.id == this.defaultContact.Id;
        })
    }

    handleSelectContact(e) {
        let selectedId = e.currentTarget.dataset.id;
        // handle UI render
        let buttons = this.template.querySelectorAll("lightning-button-icon-stateful");
        buttons.forEach(btn => {
            btn.selected = selectedId != this.defaultContact.Id
                           ? btn.selected = btn.dataset.id == selectedId
                           : btn.selected = false;
        })

        if (selectedId == this.defaultContact.Id) {
            // unselected and fire event to parent on contact unselected
            this.dispatchEvent(
                new CustomEvent(
                    'unselected',
                    { bubbles: true, composed: true }
                ))
        }
        else {
            let selectedContact_ = this.relatedContacts.filter(c => c.Id == selectedId);
            // selected and fire event to parent on contact selected
            if (selectedContact_.length == 1) {
                this.dispatchEvent(
                    new CustomEvent(
                        'selected',
                        { detail: selectedContact_[0], bubbles: true, composed: true }
                    ));
            }
        }
    }
}