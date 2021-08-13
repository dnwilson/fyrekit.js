import { Controller } from 'stimulus'
import { Toast } from 'bootstrap'
// import Toastify from 'toastify-js'

// const TYPES = {
//   notice: "rgba(210, 159, 43, 0.1)",
//   error: "rgba(244, 67, 54, 0.1)",
//   alert: "rgba(210, 159, 43, 0.1)",
//   info: "rgba(53, 163, 186, 0.1)", // rgba(53, 163, 186, 0.1) #35a3ba
//   danger: "rgba(244, 67, 54, 0.1)", // rgba(244, 67, 54, 0.1) #f44336
//   warning: "rgba(210, 159, 43, 0.1)", // rgba(210, 159, 43, 0.1) #d29f2b
//   success: "rgba(84, 175, 99, 0.1)" // rgba(84, 175, 99, 0.1) #54af63
// }

export default class extends Controller {
  // static values = { name: String, message: String }

  connect() {
    new Toast(this.element, {}).show()
  }
}