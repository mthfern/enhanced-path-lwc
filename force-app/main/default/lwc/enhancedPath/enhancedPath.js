import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import EnhancedPathItem from './enhancedPathItem';

export default class EnhancedPath extends LightningElement {
  @api recordId;
  @api objectApiName;
  @api sourceField;

  record;
  objectInfo;
  items = [];

  buttonLabel = '';
  showClosedModal = false;

  get sourceFieldValue() {
    return getFieldValue(this.record, this.sourceFieldApiName);
  }

  get sourceFieldApiName() {
    return this.getFieldApiName(this.sourceField);
  }

  get recordFields() {
    return [this.sourceFieldApiName];
  }

  get recordTypeId() {
    return this.record?.recordTypeId;
  }

  get closeModalTitle() {
    return `Close this ${this.objectInfo?.label}`;
  }

  get currentItem() {
    return this.items.find(item => item.isCurrent);
  }

  get activeItem() {
    return this.items.find(item => item.isActive);
  }

  get currentActiveItem() {
    return this.items.find(item => item.isCurrentActive);
  }

  get isLoaded() {
    return this.items.length > 0;
  }

  get showCheckIcon() {
    const item = this.activeItem;
    return item.isCurrent && !item.isClosed;
  }

  get closedOptions() {
    const options = [];
    for (const item of this.items) {
      let { labelClosed: label, value, isClosed } = item;
      if (isClosed) {
        options.push({ label, value });
      }
    }
    return options;
  }

  @wire(getRecord, { recordId: '$recordId', fields: '$recordFields' })
  wiredGetRecord(result) {
    this.handleGetRecord(result);
  }

  @wire(getObjectInfo, { objectApiName: '$objectApiName' })
  wiredGetObjectInfo(result) {
    this.handleGetObjectInfo(result);
  }

  @wire(getPicklistValues, {
    recordTypeId: '$recordTypeId',
    fieldApiName: '$sourceFieldApiName'
  })
  wiredGetPicklistValues(result) {
    this.handleGetPicklistValues(result);
  }

  handleGetRecord({ error, data }) {
    if (data) {
      this.record = data;
    }

    if (error) {
      this.record = undefined;
      this.handleError(error, false);
    }
  }

  handleGetObjectInfo({ error, data }) {
    if (data) {
      this.objectInfo = data;
    }

    if (error) {
      this.objectInfo = undefined;
      this.handleError(error, false);
    }
  }

  handleGetPicklistValues({ error, data }) {
    if (data) {
      this.items = [];
      let hasHidden = false;

      for (const item of data.values) {
        const { label, value, attributes } = item;
        const { closed = false, won = false } = attributes || {};
        const isCurrent = value === this.sourceFieldValue;
        const isHidden = isCurrent || hasHidden ? false : closed;
        if (isHidden) {
          hasHidden = true;
        }

        this.items.push(
          new EnhancedPathItem(closed ? 'Closed' : label, value, {
            labelClosed: label,
            isClosed: closed,
            isWon: won,
            isCurrent,
            isActive: isCurrent,
            isHidden
          })
        );
      }

      this.updateCompleteItems();
      this.refreshDOM();
    }

    if (error) {
      this.picklistValues = undefined;
      this.handleError(error, false);
    }
  }

  handleItemClick(event) {
    const targetId = event.currentTarget.dataset.id;
    if (this.activeItem.id !== targetId) {
      if (!(this.activeItem.isClosed && this.activeItem.isCurrent)) {
        this.activeItem.setActive(false);
      }
      this.getItemById(targetId).setActive(true);
      this.refreshDOM();
    }
  }

  handleButtonClick() {
    if (this.getNextItem().isClosed) {
      this.showClosedModal = true;
    } else {
      const nextItem = this.getNextItem();
      this.updateItem(nextItem)
        .then(() => {
          this.handleUpdateRecordSuccess();
        })
        .catch(error => {
          this.handleError(error);
        });
    }
  }

  handleClosedModalReturn(event) {
    const {
      detail: { type, data: value }
    } = event;

    if (type === 'ok') {
      const nextItem = this.getItemByValue(value);
      this.updateItem(nextItem)
        .then(() => {
          this.handleUpdateRecordSuccess();
        })
        .catch(error => {
          this.handleError(error);
        });
    }

    this.showClosedModal = false;
  }

  getNextItem() {
    if (this.activeItem.id === this.currentItem.id) {
      const currentIndex = this.getIndexOf(this.currentItem);
      return currentIndex === this.items.length - 1
        ? this.items[currentIndex]
        : this.items[currentIndex + 1];
    }

    return this.activeItem;
  }

  getItemById(id) {
    return this.items.find(item => item.id === id);
  }

  getItemByValue(value) {
    return this.items.find(item => item.value === value);
  }

  getIndexOf(item) {
    return this.items.indexOf(item);
  }

  getFieldApiName(fieldName) {
    return `${this.objectApiName}.${fieldName}`;
  }

  getFieldLabel(fieldName) {
    return this.objectInfo.fields[fieldName].label;
  }

  updateItem({ value }) {
    const fields = {};
    fields.Id = this.recordId;
    fields[this.sourceField] = value;
    return updateRecord({ fields });
  }

  refreshDOM() {
    this.renderPath();
    this.renderButtonLabel();
  }

  updateCompleteItems() {
    if (this.currentActiveItem) {
      const targetIndex = this.getIndexOf(this.currentActiveItem);
      const { isWon, isClosed } = this.currentActiveItem;

      this.items.forEach((item, index) => {
        if (index !== targetIndex) {
          item.setComplete(index < targetIndex ? isWon || !isClosed : false);
        }
      });
    }
  }

  renderPath() {
    for (const item of this.items) {
      const { id, className } = item;
      this.setPathItemClassName(id, className);
    }
  }

  setPathItemClassName(id, value) {
    const item = this.template.querySelector(`[data-id="${id}"]`);
    if (item) {
      item.className = value;
    }
  }

  renderButtonLabel() {
    const item = this.activeItem;
    if (item.isCurrent) {
      this.buttonLabel = item.isClosed
        ? 'Change Closed State'
        : 'Mark Stage as Complete';
    } else {
      this.buttonLabel = item.isClosed
        ? 'Select Closed Stage'
        : 'Mark as Current Stage';
    }
  }

  handleUpdateRecordSuccess() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: `${this.getFieldLabel(this.sourceField)} changed succesfully!`,
        message: '',
        variant: 'success'
      })
    );
  }

  handleError(error, showToast) {
    const { code: title, message } = error.body || {
      code: 'UNHANDLED',
      message: error
    };
    console.error('ERROR: %s %s', title, message);
    if (showToast) {
      this.dispatchEvent(
        new ShowToastEvent({
          title,
          message,
          variant: 'error'
        })
      );
    }
  }
}
