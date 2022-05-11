import ModalInterface from 'c/modalInterface';

export default class ModalOkCancel extends ModalInterface {
  get okButtonLabel() {
    return this.getButtonLabel(1);
  }

  get cancelButtonLabel() {
    return this.getButtonLabel(2);
  }

  constructor() {
    super(2);
    this.setButtonLabel(1, 'Ok');
    this.setButtonLabel(2, 'Cancel');
  }

  handleClose() {
    this.clearContentData();
    this.return({ type: 'close' });
  }

  handleCancel() {
    this.clearContentData();
    this.return({ type: 'cancel' });
  }

  handleOk() {
    const data = this.getContentData();
    this.return({ type: 'ok', data });
  }
}
