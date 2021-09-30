import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from '@salesforce/apex';

import findContactsByName from '@salesforce/apex/ContactControllerLWC.findContactsByName';
import deleteContactFromDB from '@salesforce/apex/ContactControllerLWC.deleteContactFromDB';

export default class LightningDatatableLWCExample extends NavigationMixin(LightningElement) {

    @track fields = {};
    @track selectedValue;

    nameUpBool;
    nameDWBool = true;

    error;
    contactsList = [];
    contactIdToRemove;
    wiredActivities;

    searchValue = '';
    sortOrder = '';

    openModal = false;
    openModalNew = false;

    @wire(findContactsByName, { searchKey: '$searchValue', order: '$sortOrder'})
    getContacts(result) {
        this.wiredActivities = result;
        if (result.data) {
            this.contactsList = result.data;
        } else if (result.error) {
            this.error = result.error;
            const event = new ShowToastEvent({
                variant: 'Error',
                title: 'Error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
        }
    }

    viewRecord(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                "recordId": event.target.value,
                "objectApiName": "Account",
                "actionName": "view"
            },
        });
    }

    handleSucess(event) {
        const contactId = event.detail.id;
        const selectEvent = new CustomEvent('contactid', {
            detail: contactId
        });
        this.dispatchEvent(selectEvent);
        this.openModalNew = false;
        refreshApex(this.wiredActivities);
        this.showToast();
    }

    firstNameChange(event) {
        this.fields.FirstName = event.target.value;
    }
    lastNameChange(event) {
        this.fields.LastName = event.target.value;
    }
    emailChange(event) {
        this.fields.Email = event.target.value;
    }
    accountChange(event) {
        this.fields.Email = event.target.value;
    }
    mobilePhoneChange(event) {
        this.fields.Email = event.target.value;
    }

    handleSearchKeyword() {
        this.searchValue = this.template.querySelector('lightning-input').value;
        refreshApex(this.wiredActivities);
    }

    sortByFirstName() {
        if (this.sortOrder === '') {
            this.nameUpBool = true;
            this.nameDWBool = false;
            this.sortOrder = 'DESC';
        } else {
            this.nameUpBool = false;
            this.nameDWBool = true;
            this.sortOrder = ''
        }
    }

    deleteContact() {
        deleteContactFromDB({ contactId: this.contactIdToRemove })
            .then(() => {
                const event = new ShowToastEvent({
                    variant: 'success',
                    title: 'Success',
                    message: 'Contact deleted',
                });
                if (this.contactsList = 0) {
                    refreshApex(this.searchValue);
                }
                this.contactIdToRemove = null;
                this.openModal = false;
                this.dispatchEvent(event);
                refreshApex(this.wiredActivities);
            })
            .catch(error => {
                this.error = error;
                const event = new ShowToastEvent({
                    variant: 'Error',
                    title: 'Error',
                    message: error
                });
                this.dispatchEvent(event);
            });
    }

    showToast() {
        const event = new ShowToastEvent({
            variant: 'success',
            title: 'Success',
            message: 'Contact Insert',
        });
        this.dispatchEvent(event);
    }

    showDialog(event) {
        this.contactIdToRemove = event.target.value;
        this.openModal = true;
    }

    showDialogNewContact() {
        this.openModalNew = true;
    }

    closeModal() {
        this.openModal = false;
    }

    closeModalNewContact() {
        this.openModalNew = false;
    }

    handleChange(event){
        this.selectedValue =event.target.value;
    }

    refreshPage() {
        refreshApex(this.searchValue);
        refreshApex(this.wiredActivities);
        eval("$A.get('e.force:refreshView').fire();");
    }
}






