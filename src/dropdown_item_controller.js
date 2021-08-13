import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [
    "text",
    "item",
  ]

  static classes = [
    "visibility"
  ]

  static values = {
    isSelected: Boolean,
    id: Number
  }

  select() {
    this.isSelectedValue = true

    const detail = { id: this.idValue, value: this.textTarget.innerText.trim() }
    const event = new CustomEvent('listItemSelected', { detail: detail })

    window.dispatchEvent(event)
  }

  deselect(event) {
    if(event.detail.value !== this.textTarget.innerText.trim()) {
      this.isSelectedValue = false
    }
  }

  // isSelectedValueChanged() {
  //   this.checkTarget.classList.toggle(this.visibilityClass)
  // }

  // highlight() {
  //   this.itemTarget.classList.add(this.backgroundPinkClass)
  //   this.textTarget.classList.add(this.textWhiteClass, this.semiboldClass)
  //   this.checkTarget.classList.replace(this.textPinkClass, this.textWhiteClass)
  // }

  // unhighlight() {
  //   this.itemTarget.classList.remove(this.backgroundPinkClass)
  //   this.textTarget.classList.remove(this.textWhiteClass, this.semiboldClass)
  //   this.checkTarget.classList.replace(this.textWhiteClass, this.textPinkClass)
  // }
}