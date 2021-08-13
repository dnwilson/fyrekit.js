import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['productId', 'price', 'quantity', 'total']
  static values = { item: Object}

  connect() {
    this.item = this.itemValue
    this.item.quantity = this.item.quantity || 1
    this.item.costCents = this.item.costCents ? this.item.costCents/100 : 0
    this.validate()
  }

  get item() {
    return self.item;
  }

  set item(mItem) {
    self.item = mItem;
  }

  addProduct(event) {
    const product = JSON.parse(event.target.dataset.autocompleteItem)
    this.item.costCents = product.price_cents/100
    this.item.productId = product.id

    this.priceTarget.disabled = false
    this.quantityTarget.disabled = false
    this.populate()
  }

  validate(event) {
    if (!this.itemValue.productId || event?.key == 'Backspace') {
      this.quantityTarget.value = 1
      this.priceTarget.value = null
      this.quantityTarget.value = null
      this.priceTarget.disabled = true
      this.quantityTarget.disabled = true

      if (event?.key == 'Backspace') {
        this.item.productId = null
      }
    }
  }

  update(event) {
    const attribute = event.target.dataset.lineItemTarget == "price" ? "costCents" : "quantity"
    this.item[attribute] = Number(event.target.value)
    this.populate()
  }

  populate() {
    this.quantityTarget.value = Number(this.item.quantity)
    this.priceTarget.value = Number(this.item.costCents).toFixed(2)
    this.totalTarget.value = Number(this.item.costCents * this.item.quantity).toFixed(2)
  }
}
