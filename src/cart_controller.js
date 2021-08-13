import { Controller } from "stimulus"

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export default class extends Controller {
  static targets = ["checkoutBtn", "fees", "subtotal", "total", "wrapper"]
  static values = { items: Array, url: String }

  connect() {
    if (!this.checkoutBtnTarget.classList.contains('disabled')) {
      this.checkoutBtnTarget.classList.add('disabled')
      this.wrapperTarget.classList.add('d-none')
    }
    this.cartItems = []
    this.updateTotals()
    window.addEventListener('cart-item:changed', this.itemChanged.bind(this))
  }

  disconnect () {
    window.removeEventListener('cart-item:changed', this.itemChanged.bind(this))
  }

  itemChanged(event) {
    const newItem = event.detail
    const existingItem = this.cartItems.find(item => item.ticket_type_id === newItem.ticket_type_id)


    if (existingItem) {
      if (newItem.quantity === 0) {
        this.cartItems = this.cartItems.filter(item => item.ticket_type_id !== newItem.ticket_type_id)
      } else {
        existingItem.quantity = newItem.quantity
      }
    } else {
      if (newItem.quantity == 0) { return }
      this.cartItems.push(newItem)
    }

    this.cartItems.length > 0 ? this.checkoutBtnTarget.classList.remove('disabled') : this.checkoutBtnTarget.classList.add('disabled')
    this.updateTotals();
  }

  updateTotals() {
    const subtotal = this.cartItems
                         .map(item => item.quantity * item.price)
                         .reduce((a, b) => Number(a) + Number(b || 0), 0)
    const baseFee = subtotal * 0.03
    const fee = baseFee > 0 ? baseFee + 0.3 : baseFee
    const total = Number(subtotal) + Number(fee)

    this.subtotalTarget.innerHTML = formatter.format(subtotal)
    this.feesTarget.innerHTML     = formatter.format(fee)
    this.totalTarget.innerHTML    = formatter.format(total)

    if (this.cartItems.length === 0 && !this.wrapperTarget.classList.contains('d-none')) {
      this.wrapperTarget.classList.add('d-none')
    } else if (this.cartItems.length > 0) {
      this.wrapperTarget.classList.remove('d-none')
    }
  }
}
