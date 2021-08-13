import { Controller } from 'stimulus'

const KEY_ARROW_UP = "ArrowUp"
const KEY_ARROW_DOWN = "ArrowDown"
const KEY_ENTER = "Enter"
const KEY_ESCAPE = "Escape"
export default class extends Controller {
  static targets = ["input", "button", "list"]
  static values = { submit: Boolean }

  initialize() {
    this.reset()
  }

  connect() {
    this.defaultText = this.inputTarget.options[this.inputTarget.selectedIndex]?.text
    this.buttonTarget.innerText = this.defaultText
    this.selectedItem = this.listTarget.querySelector(`[data-text='${this.defaultText}']`)

    document.addEventListener('click', (event) => {
      if (!this.element.contains(event.target) && this.listTarget.classList.contains("show")) {
        this.toggle(event);
      }
    });
  }

  disconnect() {
    this.defaultText = null
    this.selectedItem = null
  }

  toggle(event) {
    event.preventDefault()
    const list = this.listTarget
    list.classList.toggle("show")
    this.buttonTarget.setAttribute("aria-expanded", list.classList.contains("show"))
  }

  keyPressed(event) {
    switch (event.key) {
      case KEY_ARROW_UP:
        this.focusNextListItem(event.key);
        break;
      case KEY_ARROW_DOWN:
        this.focusNextListItem(event.key);
        break;
      case KEY_ENTER:
        this.submitForm(this.listTarget.querySelector('li.focused').dataset.id)
        break;
      case KEY_ESCAPE:
        this.close()
        break;
    
      default:
        break;
    }
  }

  focusNextListItem(direction) {
    let activeElement = this.listTarget.querySelector(
      `li#${this.listTarget.getAttribute("aria-activedescendant")}`
    )
    const activeIndex = Array.prototype.indexOf.call(this.listTarget.childNodes, activeElement)
    let modifier;
    
    if (direction === KEY_ARROW_DOWN && activeIndex < this.listTarget.childElementCount - 1) {
      modifier = 1
    } else if (direction === KEY_ARROW_UP && activeIndex > 0) {
      modifier = -1
    } else {
      return
    }

    activeElement = this.listTarget.children[activeIndex + modifier]
    this.listTarget.querySelector('li.focused').classList.remove('focused')
    activeElement.classList.add('focused')
    this.listTarget.setAttribute("aria-activedescendant", activeElement.id)
    activeElement.focus()
  }

  itemSelected(event) {
    this.buttonTarget.innerText = event.target.dataset.text
    this.toggle(event)
    this.inputTarget.dispatchEvent(
      new CustomEvent('select:value-changed', {
        detail: { data: event.target.dataset, origin: event.target }
      })
    )
    this.submitForm(event.target.dataset.id)
  }

  submitForm(id) {
    const form = this.element.closest('form')
    this.inputTarget.value = id
    if (this.submitValue && form) {
      form.requestSubmit()
    }
  }

  close() {
    this.listTarget.classList.toggle("show")
    this.buttonTarget.setAttribute("aria-expanded", this.listTarget.classList.contains("show"))
    this.listTarget.querySelector('li.focused').classList.remove('focused')
    this.reset()
  }

  reset() {
    this.buttonTarget.setAttribute("aria-expanded", this.listTarget.classList.contains("open"))
    const selectedValue = this.inputTarget.options[this.inputTarget.selectedIndex].value
    this.listTarget.setAttribute("aria-activedescendant", `option-${selectedValue}`)
    this.listTarget.querySelector(`li#option-${selectedValue}`)?.classList?.add('focused')
  }
}