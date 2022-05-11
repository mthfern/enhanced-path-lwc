import { infiniteGenerator } from 'c/generatorFactory';

const generator = infiniteGenerator(0, 1);
const genId = function () {
  return `path-item-${generator.next().value}`;
};

class Status {
  static ACTIVE = new Status('Active');
  static CURRENT = new Status('Current');
  static COMPLETE = new Status('Complete');

  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

export default class EnhancedPathItem {
  constructor(
    label,
    value,
    {
      id = genId(),
      labelClosed = '',
      isClosed = false,
      isWon = false,
      isActive = false,
      isCurrent = false,
      isComplete = false,
      isHidden = false
    }
  ) {
    this.id = id;
    this.label = label;
    this.value = value;
    this.labelClosed = labelClosed;
    this.isClosed = isClosed;
    this.isWon = isWon;
    this.isActive = isActive;
    this.isCurrent = isCurrent;
    this.isComplete = isComplete;
    this.isHidden = isHidden;
  }

  get isClosedWon() {
    return this.isClosed && this.isWon;
  }

  get isCurrentActive() {
    return this.isCurrent && this.isActive;
  }

  get labelDisplay() {
    return this.isCurrent && this.isClosed ? this.labelClosed : this.label;
  }

  get className() {
    const classList = ['slds-path__item'];

    if (this.isCurrent || this.isActive) {
      if (this.isCurrent) {
        classList.push('slds-is-current');
      }

      if (this.isActive) {
        classList.push('slds-is-active');
      }

      if (this.isClosed && this.isCurrent) {
        classList.push(this.isWon ? 'slds-is-won' : 'slds-is-lost');
      }
    } else {
      classList.push(
        this.isComplete ? 'slds-is-complete' : 'slds-is-incomplete'
      );
    }

    return classList.join(' ');
  }

  setHidden(status) {
    this.isHidden = status;
  }

  setActive(status) {
    this.setStatus(Status.ACTIVE, status);
  }

  setCurrentActive(status) {
    this.setStatus(Status.ACTIVE, status);
    this.setStatus(Status.CURRENT, status);
    this.setStatus(Status.COMPLETE, false);
  }

  setComplete(status) {
    this.setStatus(Status.ACTIVE, false);
    this.setStatus(Status.CURRENT, false);
    this.setStatus(Status.COMPLETE, status);
  }

  setStatus(status, value) {
    this[`is${status.getName()}`] = value;
  }
}
