import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['sidebar', 'toggler']

  toggle() {
    this.sidebarTarget.classList.toggle('active')
    this.element.classList.toggle('sidebar-active')
    this.togglerTarget.classList.toggle('fa-times')
    this.togglerTarget.classList.toggle('fa-bars')
  }
}
