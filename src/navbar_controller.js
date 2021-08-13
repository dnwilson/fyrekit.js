import { Controller } from 'stimulus'

export default class extends Controller {
  connect() {
    window.onscroll = () => {
      if (window.scrollY >= 60) {
        this.element.classList.add('shrink')
      } else {
        this.element.classList.remove('shrink')
      }
    }
  }
}
