import { api } from 'lwc';
import ModalContentInterface from 'c/modalContentInterface';

export default class SingleCombobox extends ModalContentInterface {
  @api options;
  value;

  handleChange(event) {
    this.value = event.detail.value;
  }

  getData() {
    return this.value;
  }
}
