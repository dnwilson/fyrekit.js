import Flatpickr from 'stimulus-flatpickr'

export default class extends Flatpickr {
  change(selectedDates, dateStr, instance) {
    instance.input.classList.toggle('date-present')
  }
}