import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = [
    "text",
    "selected",
    "input",
    "list",
  ]

  static classes = [
    "visibility"
  ]

  connect() {
    this.toggleList()
  }

  reset() {
    this.inputTarget.classList.toggle("show")
  }

  setText(event) {
    if(event.detail.value) {
      this.selectedTarget.classList.toggle("show")
      this.inputTarget.classList.toggle("show")
      this.textTarget.textContent = event.detail.value
    }
  }

  setSelected(event) {
    this.toggleList()
    if(event.detail.value) {
      this.textTarget.textContent = event.detail.value
    }
  }

  toggleList() {
    this.listTarget.classList.toggle(this.visibilityClass)
  }
}