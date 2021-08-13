import { Controller } from 'stimulus'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})
export default class extends Controller {
  static targets = ['total', 'subtotal', 'taxes', 'reference']
  static values = { taxRate: Number }

  connect() {
    this.update()
  }

  update() {
    this.subtotal = 0
    this.total = 0
    this.taxRate = 0
    this.taxes = 0
    this.referenceTargets.forEach(el => {
      this.subtotal += Number(el.value)
    })

    this.taxes = this.subtotal * this.taxRate
    this.total = this.subtotal + this.taxes
    this.populate()
  }

  populate() {
    this.taxesTarget.innerHTML = formatter.format(this.taxes)
    this.subtotalTarget.innerHTML = formatter.format(this.subtotal)
    this.totalTarget.innerHTML = formatter.format(this.total)
  }

  // initialize() {
  //   this.updateTotals()
  // }

  // set total(_total) {
  //   this.data.set('total', _total)
  // }

  // set subtotal(_subtotal) {
  //   this.data.set('subtotal', _subtotal)
  // }

  // set taxes(_taxes) {
  //   this.data.set('taxes', _taxes)
  // }

  // get total() {
  //   return this.data.get('total')
  // }

  // get subtotal() {
  //   return this.data.get('subtotal')
  // }

  // get taxes() {
  //   return this.data.get('taxes')
  // }

  // updateTotals(event) {
  //   const items = this.element.querySelectorAll('.invoice-item')
  //   const parent = this
  //   let total = 0
  //   let subtotal = 0
  //   let taxes = 0

  //   Array.from(items).forEach(function(el) {
  //     const item = parent.getChild(el)

  //     if (item) {
  //       subtotal += Number(item.data.get('total'))
  //       taxes += Number(item.data.get('taxes'))
  //       total += Number(item.data.get('total')) - Number(item.data.get('taxes'))
  //     }
  //   })

  //   const formatter = new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 2,
  //   })

  //   this.subtotal = subtotal
  //   this.taxes = taxes
  //   this.total = total

  //   this.taxesTarget.innerHTML = formatter.format(taxes)
  //   this.subtotalTarget.innerHTML = formatter.format(subtotal)
  //   this.totalTarget.innerHTML = formatter.format(total)
  // }

  // remove(event) {
  //   let item = this.getChild(event.target.closest('.invoice-item'))
  //   let total = this.total ? this.total : 0
  //   let subtotal = this.subtotal ? this.subtotal : 0
  //   let taxes = this.taxes ? this.taxes : 0

  //   subtotal -= Number(item.data.get('total'))
  //   taxes -= Number(item.data.get('taxes'))
  //   total -= Number(item.data.get('total')) - Number(item.data.get('taxes'))

  //   this.subtotal = subtotal
  //   this.taxes = taxes
  //   this.total = total

  //   const formatter = new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 2,
  //   })

  //   this.taxesTarget.innerHTML = formatter.format(this.taxes)
  //   this.subtotalTarget.innerHTML = formatter.format(this.subtotal)
  //   this.totalTarget.innerHTML = formatter.format(this.total)
  // }

  // getChild(el) {
  //   return this.application.getControllerForElementAndIdentifier(el, 'item')
  // }
}
