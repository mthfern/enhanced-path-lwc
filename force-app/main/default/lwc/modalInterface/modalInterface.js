import { LightningElement, api } from 'lwc';

export default class ModalInterface extends LightningElement {
  @api sourceId;
  @api title = 'Modal Title';
  buttons = [];

  constructor(nbrOfButtons) {
    super();
    for (let index = 1; index <= nbrOfButtons; index++) {
      this.buttons.push({ id: index, label: `button-${index}` });
    }
  }

  setButtonLabel(id, label) {
    this.buttons.find(el => el.id === id).label = label;
  }

  getButtonLabel(id) {
    return this.buttons.find(el => el.id === id).label;
  }

  contentCallback(event) {
    const { getData, clearData, executeAction } = event.detail.callbacks;
    this.getContentData = getData;
    this.clearContentData = clearData;
    this.executeContentAction = executeAction;
  }

  return({ sourceId = this.sourceId, type = '', data = null } = {}) {
    this.dispatchEvent(
      new CustomEvent('modalreturn', {
        bubbles: true,
        detail: { sourceId, type, data }
      })
    );
  }
}
