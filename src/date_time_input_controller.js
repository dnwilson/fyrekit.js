import { Controller } from 'stimulus'
import flatpickr from 'flatpickr'

export default class extends Controller {
  static values = { type: String, wrapper: String }

  // *** Getters
  get dateConfig() {
    return {
      altFormat: 'm/d/Y',
      altInput: true,
      appendTo: this.element.parentElement,
      clickOpens: false,
      dateFormat: 'Y-m-d',
      disableMobile: true,
      positionElement: this.element.parentElement,
      onOpen: function() {
        this.jumpToDate(this.element.value)
        this.element
          .closest(`.${this.wrapperClass}.date`)
          .classList.add('flatpickr-open')
      },
      onClose: () => this.toggleDatePresentClass(),
    }
  }

  get timeConfig() {
    return {
      altFormat: 'h:i K',
      altInput: true,
      appendTo: this.element.parentElement,
      clickOpens: false,
      dateFormat: 'Y-m-d h:i K',
      disableMobile: true,
      enableTime: true,
      noCalendar: true,
      positionElement: this.element.parentElement,
      onOpen: function() {
        this.element
          .closest(`.${this.wrapperClass}.time`)
          .classList.add('flatpickr-open')
      },
      onClose: () => this.toggleDatePresentClass(),
    }
  }

  get dateTimeConfig() {
    return {
      altFormat: 'l, F j, Y @ h:i K',
      altInput: true,
      appendTo: this.element.parentElement,
      clickOpens: false,
      dateFormat: 'Y-m-d h:i K',
      disableMobile: true,
      enableTime: true,
      positionElement: this.element.parentElement,
      onOpen: function() {
        this.element
          .closest(`.${this.wrapperClass}.date_time`)
          .classList.add('flatpickr-open')
      },
      onClose: () => this.toggleDatePresentClass(),
    }
  }

  get wrapperClass() {
    return this.wrapperValue === 'floatingformbuilder' ? 'form-floating' : 'form-group'
  }

  toggleDatePresentClass() {
    const parentElement = this.element.closest(`.${this.wrapperClass}`)
    if (this.element.value) {
      parentElement.classList.add('date-present')
    } else {
      parentElement.classList.remove('date-present')
    }
    parentElement.classList.remove('flatpickr-open')
  }

  get config() {
    switch (this.typeValue) {
      case 'date':
        return this.dateConfig
      case 'time':
        return this.timeConfig
      default:
        // datetime
        return this.dateTimeConfig
    }
  }

  // *** Lifecycle

  connect() {
    this.picker = flatpickr(this.element, this.config)
    this.toggleDatePresentClass()
    this.element.nextSibling.onclick = function(event) {
      if (this.picker.isOpen) {
        this.picker.close()
      } else {
        this.picker.open()
      }
    }.bind(this)
  }

  disconnect() {
    this.picker.destroy()
    this.picker = null
  }
}
