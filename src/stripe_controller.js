import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['cardElement', 'cardErrors']

  connect() {
    let stripe = Stripe(this.data.get('key'))
    let elements = stripe.elements()
    let style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    }

    let card = elements.create('card', {
      style: style,
    })

    card.mount(this.cardElementTarget)

    // Handle real-time validation errors from the card Element.
    let controller = this
    card.addEventListener('change', (event) => {
      let displayError = controller.cardErrorsTarget
      if (event.error) {
        displayError.textContent = event.error.message
      } else {
        displayError.textContent = ''
      }
    })

    // Handle form submission.
    let form = controller.element
    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const submitBtn = form.querySelector('button.btn-primary')
      submitBtn.classList.add('disabled')
      submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i>`

      stripe.createToken(card).then((result) => {
        if (result.error) {
          // Inform the user if there was an error.
          let errorElement = this.cardErrorsTarget
          errorElement.textContent = result.error.message
          submitBtn.innerHTML = 'Start Now'
          submitBtn.classList.remove('disabled')
          return
        } else {
          // Send the token to your server.
          controller.stripeTokenHandler(result.token)
        }
      })
    })
  }

  // Submit the form with the token ID.
  stripeTokenHandler(token) {
    let form = this.element
    const fields = ['stripe_token', 'last4', 'exp_month', 'exp_year', 'brand']
    fields.forEach((string) => {
      let input = document.createElement('input')
      const name = string === 'stripe_token' ? string : `card_${string}`
      const value = string === 'stripe_token' ? token.id : token.card[string]
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', `subscription[${name}]`)
      input.setAttribute('value', value)
      form.appendChild(input)
    })

    // Submit the form
    form.submit()
  }

  show(event) {
    const btn = document.querySelector(`label[for="${event.target.id}"] .btn`)
    const price = document.querySelector(
      '.payment-fields .text-primary .amount'
    )
    price.innerHTML = `&nbsp;$${btn.dataset.price}&nbsp;`
  }
}
