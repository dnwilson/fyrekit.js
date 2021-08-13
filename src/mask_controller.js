import { Controller } from 'stimulus'
import imask from 'imask'

const CURRENCY = {
  pounds: "‎£",
  euro: "‎€",
  dollar: "$"
}
export default class extends Controller {
  static values = { type: String, options: Object }

  connect() {
    imask(this.element, this.config)
  }

  get config() {
    if (this.typeValue === 'number') { return this.numberConfig }

    return this.typeValue === 'phone' ? this.phoneConfig : this.moneyConfig
  }

  get numberConfig() {
    return {
      mask: Number,  // enable number mask

      // other options are optional with defaults below
      scale: 2,  // digits after point, 0 for integers
      signed: false,  // disallow negative
      thousandsSeparator: ',',  // any single char
      padFractionalZeros: false,  // if true, then pads zeros at end to the length of scale
      normalizeZeros: true,  // appends or removes zeros at ends
      radix: ',',  // fractional delimiter
      mapToRadix: ['.'], // symbols to process as radix
      min: 0
    }
  }

  get moneyConfig() {
    const type = this.optionsValue.currency || 'dollar'
    const isEuro = this.optionsValue.currency === 'euro'

    return {
      mask: `${CURRENCY[type]}num`,
      lazy: false,
      blocks: {
        num: {
          // nested masks are available!
          mask: Number,
          thousandsSeparator: isEuro ? '.' : ',',
          placeholderChar: '#',
          lazy: false,
          scale: 2,                   // digits after point, 0 for integers
          signed: false,              // disallow negative
          padFractionalZeros: false,  // if true, then pads zeros at end to the length of scale
          normalizeZeros: false,      // appends or removes zeros at ends
          radix: isEuro ? ',' : '.',  // fractional delimiter
          mapToRadix: isEuro ? [','] : ['.']  // symbols to process as radix
        }
      }
    }
  }

  get phoneConfig() {
    return {
      mask: [
        {
          mask: '+{1} (000) 000-0000',
          startsWith: '',
          country: 'Default'
        },
        {
          mask: '+44 000 0000 0000',
          startsWith: '44',
          lazy: false,
          country: 'United Kingdom'
        },
        {
          mask: '99 99 9999 9999',
          startsWith: '',
          lazy: false,
          country: 'Mexico'
        }
      ]
    }
  }
}
