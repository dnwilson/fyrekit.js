import { Controller } from 'stimulus'
import { Modal, Toast } from 'bootstrap'
export default class extends Controller {
  connect() {
    // this.resetTimeout()
  }

  get path() {
    return this.data.get('path')
  }

  resetTimeout() {
    clearTimeout(this.heartbeat)
    this.timeout = new Date().getTime() + this.data.get('timeout') * 1000
    this.startHeartbeat()
  }

  startHeartbeat() {
    this.heartbeat = setTimeout(() => this.heartbeatCheck(), 5000)
  }

  heartbeatCheck() {
    const now = new Date().getTime()
    if (now > this.timeout) {
      if (document.getElementById('timeout-modal')) {
        return
      } else {
        this.fetchSessionTimeout()
      }
    } else {
      this.startHeartbeat()
    }
  }

  fetchSessionTimeout() {
    fetch(this.path, {
      method: 'get',
    })
      .then((response) => response.text())
      .then((data) => {
        document.body.innerHTML += data
        this.modal = Modal(
          document.getElementById('timeout-modal'),
          {
            keyboard: false,
            focus: true,
            backdrop: 'static',
          }
        )
        this.modal.show()
      })
      .finally(() => clearTimeout(this.heartbeat))
      .catch((err) => {
        console.log('fetchSessionTimeout:error', err)
        let toastBody = `
          <div class="toast toast-timeout d-flex align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">Unable to process session timeout modal.</div>
            <button type="button" class="btn-close btn-close-white ms-auto me-2" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        `
        document.body.innerHTML += toastBody
        const toastEl = document.querySelector('.toast-timeout')
        const toast = new Toast(toastEl, { autohide: true })
        toast.show()
      })
  }

  success(event) {
    if (event.detail.success) {
      let element = document.getElementById('timeout-modal')
      let modal = Modal.getInstance(element)
      modal.toggle()
      element.remove()
      this.resetTimeout()
    } else {
      document.querySelector('#timeout-modal .alert').classList.remove('d-none')
      document.getElementById('user_password').value = ''
    }
  }
}
