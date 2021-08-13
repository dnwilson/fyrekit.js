import { Controller } from "stimulus"
const dropin = require('braintree-web-drop-in')

export default class extends Controller {
  static targets = ["button", "back", "container", "form", "spinner"]
  static values = { token: String, total: Number }

  connect() {
    
    if (this.totalValue !== 0) {
      this.setupDropIn()
    } else {
      this.spinnerTarget.classList.remove('show')
      this.buttonTarget.classList.remove('disabled')
      this.element.classList.add('loaded')
    }
  }

  setupDropIn() {
    let wrapper = this.element
    let spinner = this.spinnerTarget
    let submitBtn = this.buttonTarget
    let amount = Number(this.totalValue).toFixed(2)
    dropin.create({
      authorization: this.tokenValue,
      container: '#payment',
      paypal: {
        flow: 'checkout',
        amount: amount,
        currency: 'USD'
      }
    }, (_error, instance) => {
      if (instance.isPaymentMethodRequestable()) {
        // This will be true if you generated the client token
        // with a customer ID and there is a saved payment method
        // available to tokenize with that customer.
        console.log('isPaymentMethodRequestable')
      }

      this.braintree = instance

      const setupComplete = setInterval(() => {
        if (instance) {
          clearInterval(setupComplete)
          spinner.closest('.empty-state').classList.remove('show')
          wrapper.classList.add('loaded')
        }
      }, 10)

      instance.on('paymentMethodRequestable', function (event) {
        spinner.closest('.empty-state').classList.remove('show')
        submitBtn.classList.remove('disabled')
      })

      instance.on('noPaymentMethodRequestable', function () {
        submitBtn.classList.add('disabled')
      })
    })
  }

  submit(event) {
    event.preventDefault()

    let form = this.formTarget
    let submitBtn = this.buttonTarget
    let backBtn = this.backTarget

    backBtn.classList.add("disabled")
    submitBtn.classList.add("disabled")
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="visually-hidden">Loading...</span>`

    if (this.totalValue === 0) {
      form.submit()
    } else {
      this.braintree.requestPaymentMethod((err, payload) => {
        if (err) {
          console.log('Error', err)
          submitBtn.innerHTML = "Pay"
          backBtn.classList.remove("disabled")
          submitBtn.classList.remove("disabled")
          return;
        } else {
          // Add the nonce to the form and submit
          document.querySelector('#payment_method_nonce').value = payload.nonce
          if (payload.nonce) {
            form.submit()
          } else {
            console.error('There was an error with the payment information. Please try again')
          }
        }
      })
    }
  }
}