import { Controller } from 'stimulus'
import AddressBuilder from './lib/address_builder'

export default class extends Controller {
  static targets = ['autocomplete', 'city', 'state', 'latitude', 'longitude']

  static values = { value: String, type: String }

  connect() {
    this.autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */ (this.autocompleteTarget),
      {}
    )

    this.autocomplete.addListener('place_changed', this.placeChanged.bind(this))
    this.autocompleteTarget.addEventListener(
      'keydown',
      this.onKeydown.bind(this)
    )
  }

  placeChanged() {
    const address = new AddressBuilder(this.autocomplete.getPlace())

    if (this.typeValue !== 'long') {
      if (address.city && address.state) {
        this.autocompleteTarget.value = `${address.city}, ${address.state}`
      } else if (address.city) {
        this.autocompleteTarget.value = address.city
      } else if (address.state) {
        this.autocompleteTarget.value = address.state
      }
    }
    this.cityTarget.value = address.city
    this.stateTarget.value = address.state
    this.latitudeTarget.value = address.latitude
    this.longitudeTarget.value = address.longitude

    this.autocompleteTarget.dispatchEvent(
      new Event('place_changed', { detail: address })
    )
  }

  onKeydown(event) {
    if (event.key == 'Enter') {
      event.preventDefault()
      return false
    }
  }

  clear() {
    this.autocompleteTarget.value = ''
    this.cityTarget.value = ''
    this.stateTarget.value = ''
    this.latitudeTarget.value = ''
    this.longitudeTarget.value = ''
  }
}
