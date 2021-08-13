export default class AddressBuilder {
  constructor(place) {
    let street_number = this.getAddressInfo(
      place.address_components,
      'street_number',
      'short_name'
    )
    let street_name = this.getAddressInfo(
      place.address_components,
      'route',
      'long_name'
    )
    this.street = [street_number, street_name].filter(Boolean).join(' ')
    this.city = this.getAddressInfo(
      place.address_components,
      'locality',
      'long_name'
    )
    this.state = this.getAddressInfo(
      place.address_components,
      'administrative_area_level_1',
      'short_name'
    )
    this.zipcode = this.getAddressInfo(
      place.address_components,
      'postal_code',
      'short_name'
    )
    this.city = this.city || place.vicinity
    this.longitude = place.geometry.location.lng()
    this.latitude = place.geometry.location.lat()
  }

  getAddressInfo(arr, key, key_type) {
    let value
    arr.forEach(function(e) {
      if (e.types[0] === key) {
        value = e[key_type]
      }
    })
    return value
  }
}