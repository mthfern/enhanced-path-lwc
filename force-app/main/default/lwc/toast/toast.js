import { ShowToastEvent } from 'lightning/platformShowToastEvent';

class ToastVariant {
  static ERROR = new ToastVariant('error');
  static SUCCESS = new ToastVariant('success');
  static INFO = new ToastVariant('info');
  static WARNING = new ToastVariant('warning');

  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class ToastEvent {
  static build(variant) {
    return new ToastEvent(variant.getName());
  }

  constructor(variant, { title = '', message = '' } = {}) {
    this.title = title;
    this.message = message;
    this.variant = variant;
  }

  setTitle(value) {
    this.title = value;
    return this;
  }

  setMessage(value) {
    this.message = value;
    return this;
  }

  createEvent() {
    return new ShowToastEvent(this);
  }
}

export { ToastEvent, ToastVariant };
