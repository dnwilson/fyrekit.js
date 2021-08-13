import { Controller } from "stimulus"

export default class extends Controller {
  static values = { data: Object }

  itemChanged(event) {
    window.dispatchEvent(new CustomEvent('cart-item:changed', {
      detail: { ...this.dataValue, quantity: Number(event.detail.data.text) }
    }))
  }
}