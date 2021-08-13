import { Controller } from 'stimulus'

export default class extends Controller {
  static values = { url: String, id: String }

  open(event) {
    fetch(this.urlValue)
      .then((response) => response.text())
      .then((data) => {
        document.body.innerHTML += data
        this.modal = new bootstrap.Modal(document.getElementById(this.idValue), {})
        this.modal.show()
      })
      .catch((err) => {
        console.log('modal:error', err)
        // let toastBody = `
        //   <div class="toast toast-timeout d-flex align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
        //     <div class="toast-body">Unable to process session timeout modal.</div>
        //     <button type="button" class="btn-close btn-close-white ms-auto me-2" data-bs-dismiss="toast" aria-label="Close"></button>
        //   </div>
        // `
        // document.body.innerHTML += toastBody
        // const toastEl = document.querySelector('.toast-timeout')
        // const toast = new bootstrap.Toast(toastEl, { autohide: true })
        // toast.show()
      })
  }
}
