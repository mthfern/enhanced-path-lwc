import { LightningElement } from 'lwc';

export default class ModalContentInterface extends LightningElement {
  connectedCallback() {
    const event = new CustomEvent('contentcallback', {
      bubbles: true,
      detail: {
        callbacks: {
          getData: this.getData.bind(this),
          clearData: this.clearData.bind(this),
          executeAction: this.executeAction.bind(this)
        }
      }
    });
    this.dispatchEvent(event);
  }

  getData() {}

  clearData() {}

  executeAction() {}
}
