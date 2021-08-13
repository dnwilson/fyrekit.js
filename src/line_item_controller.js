import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['productId', 'price', 'quantity', 'total']
  static values = { item: Object}

  connect() {
    this.item = this.itemValue
    this.item.quantity = this.item.quantity || 1
    this.item.costCents = this.item.costCents ? this.item.costCents/100 : 0
    this.validate()
    // this.update()
    // this.totalTarget.value = (
    //   Number(this.priceValue) * Number(this.quantityValue)
    // ).toFixed(2)

    // this.element.addEventListener('update-qty', this.updateQty.bind(this))
  }

  // updateQty(event) {
  //   this.quantityValue = event.detail.quantity
  //   this.updateUI()
  // }

  // populate(event) {
  //   let item = JSON.parse(event.target.dataset.nestedFormValue)
  //   this.productIdTarget.value = item.id || item.name
  //   this.priceValue = item.price
  //   this.quantityValue = this.quantityTarget.value ? this.quantityTarget.value : 1
  //   this.totalValue = Number(item.priceValue) * Number(this.quantityValue)
  //   this.updateUI()
  // }

  // updateUI() {
  //   this.quantityTarget.value = Number(this.quantityValue)
  //   this.priceTarget.value = Number(this.priceValue).toFixed(2)
  //   this.totalTarget.value = (
  //     Number(this.priceValue) * Number(this.quantityValue)
  //   ).toFixed(2)
  //   console.log('TOTAL', this.totalTarget, this.element)
  // }

  // update(event) {
  //   if (event == undefined) {
  //     this.productIdTarget.value = this.idValue || this.nameValue
  //     this.priceValue = this.priceValue
  //     this.quantityValue = this.quantityTarget.value ? this.quantityTarget.value : 1
  //     this.totalValue = Number(this.priceValue) * Number(this.quantityValue)
  //     this.updateUI()
  //   } else {
  //     this.quantityValue = this.quantityTarget.value ? this.quantityTarget.value : 1
  //     this.priceValue = this.priceTarget.value
  //     this.totalValue = Number(this.priceTarget.value) * Number(this.quantityValue)
  //   }
  // }

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
