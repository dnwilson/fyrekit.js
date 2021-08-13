import { Controller } from 'stimulus'
const debounce = require('lodash.debounce')

export default class extends Controller {
  static targets = ['input', 'hidden', 'results']

  connect() {
    this.toggleDropDown(true)

    this.inputTarget.setAttribute('autocomplete', 'off')
    this.inputTarget.setAttribute('spellcheck', 'false')

    this.mouseDown = false

    this.onInputChange = debounce(this.onInputChange.bind(this), 300)
    this.onResultsClick = this.onResultsClick.bind(this)
    this.onResultsMouseDown = this.onResultsMouseDown.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.onKeydown = this.onKeydown.bind(this)

    this.inputTarget.addEventListener('keydown', this.onKeydown)
    this.inputTarget.addEventListener('blur', this.onInputBlur)
    this.inputTarget.addEventListener('input', this.onInputChange)
    this.resultsTarget.addEventListener('mousedown', this.onResultsMouseDown)
    this.resultsTarget.addEventListener('click', this.onResultsClick)
  }

  disconnect() {
    this.inputTarget.removeEventListener('keydown', this.onKeydown)
    this.inputTarget.removeEventListener('focus', this.onInputFocus)
    this.inputTarget.removeEventListener('blur', this.onInputBlur)
    this.inputTarget.removeEventListener('input', this.onInputChange)
    this.resultsTarget.removeEventListener('mousedown', this.onResultsMouseDown)
    this.resultsTarget.removeEventListener('click', this.onResultsClick)
  }

  sibling(next) {
    const options = Array.from(
      this.resultsTarget.querySelectorAll('[role="option"]')
    )
    const selected = this.resultsTarget.querySelector('[aria-selected="true"]')
    const index = options.indexOf(selected)
    const sibling = next ? options[index + 1] : options[index - 1]
    const def = next ? options[0] : options[options.length - 1]
    return sibling || def
  }

  select(target) {
    for (const el of this.resultsTarget.querySelectorAll(
      '[aria-selected="true"]'
    )) {
      el.removeAttribute('aria-selected')
      el.classList.remove('active')
    }
    target.setAttribute('aria-selected', 'true')
    target.classList.add('active')
    this.inputTarget.setAttribute('aria-activedescendant', target.id)
  }

  onKeydown(event) {
    switch (event.key) {
      case 'Escape':
        if (!this.resultsTarget.hidden) {
          this.toggleDropDown(true)
          event.stopPropagation()
          event.preventDefault()
        }
        break
      case 'ArrowDown':
        {
          const item = this.sibling(true)
          if (item) this.select(item)
          event.preventDefault()
        }
        break
      case 'ArrowUp':
        {
          const item = this.sibling(false)
          if (item) this.select(item)
          event.preventDefault()
        }
        break
      case 'Tab':
        {
          const selected = this.resultsTarget.querySelector(
            '[aria-selected="true"]'
          )
          if (selected) {
            this.commit(selected)
          }
        }
        break
      case 'Enter':
        {
          const selected = this.resultsTarget.querySelector(
            '[aria-selected="true"]'
          )
          if (selected && !this.resultsTarget.hidden) {
            this.commit(selected)
            event.preventDefault()
          }
        }
        break
    }
  }

  onInputFocus() {
    this.fetchResults()
  }

  onInputBlur() {
    if (this.mouseDown) return
    this.toggleDropDown(true)
  }

  commit(selected) {
    if (selected.getAttribute('aria-disabled') === 'true') return
    if (selected instanceof HTMLAnchorElement) {
      selected.click()
      this.hiddenTarget.value = selected.dataset.autocompleteValue
      this.inputTarget.value = selected.innerHTML
      this.toggleDropDown(true)
      return
    }

    const textValue = selected.textContent.trim()
    const value = selected.getAttribute('data-autocomplete-value') || textValue
    this.inputTarget.value = textValue

    if (this.hiddenTarget) {
      this.hiddenTarget.value = value
    } else {
      this.inputTarget.value = value
    }

    this.element.dispatchEvent(
      new CustomEvent('autocomplete.change', {
        bubbles: true,
        detail: { value: value, textValue: textValue },
      })
    )

    this.inputTarget.focus()
    this.toggleDropDown(true)
  }

  onResultsClick(event) {
    event.preventDefault()
    if (!(event.target instanceof Element)) return
    const selected = event.target.closest('[role="option"]')
    if (selected) this.commit(selected)
  }

  onResultsMouseDown() {
    this.mouseDown = true
    this.resultsTarget.addEventListener(
      'mouseup',
      () => (this.mouseDown = false),
      { once: true }
    )
  }

  onInputChange(event) {
    this.hiddenTarget.value = event.target.value
    this.element.removeAttribute('value')
    this.fetchResults()
  }

  identifyOptions() {
    let id = 0
    for (const el of this.resultsTarget.querySelectorAll(
      '[role="option"]:not([id])'
    )) {
      el.id = `option-${id++}`
    }
  }

  fetchResults() {
    const query = this.inputTarget.value.trim()
    if (!query) {
      this.toggleDropDown(true)
      return
    }
    if (query.length < this.minLength) {
      this.toggleDropDown(true)
      return
    }

    if (this.items) {
      this.filterItemResults(query)
      this.identifyOptions()
      const hasResults = !!this.resultsTarget.querySelector('[role="option"]')
      this.toggleDropDown(!hasResults)
      this.element.dispatchEvent(new CustomEvent('load'))
      this.element.dispatchEvent(new CustomEvent('loadend'))
      return
    }

    const url = new URL(this.src, window.location.href)
    const params = new URLSearchParams(url.search.slice(1))
    params.append('query', query)
    url.search = params.toString()

    this.element.dispatchEvent(new CustomEvent('loadstart'))

    fetch(url.toString())
      .then((response) => response.text())
      .then((html) => {
        this.resultsTarget.innerHTML = html
        this.identifyOptions()
        const hasResults = !!this.resultsTarget.querySelector('[role="option"]')
        this.toggleDropDown(!hasResults)
        this.element.dispatchEvent(new CustomEvent('load'))
        this.element.dispatchEvent(new CustomEvent('loadend'))
      })
      .catch(() => {
        this.element.dispatchEvent(new CustomEvent('error'))
        this.element.dispatchEvent(new CustomEvent('loadend'))
      })
  }

  toggleDropDown(hidden) {
    hidden ? this.inputTarget.classList.remove("is-open") : this.inputTarget.classList.add("is-open")
    this.resultsTarget.hidden = hidden
  }

  // open() {
  //   if (!this.resultsTarget.hidden) return
  //   this.resultsTarget.hidden = false
  //   this.element.setAttribute('aria-expanded', 'true')
  //   this.element.dispatchEvent(
  //     new CustomEvent('toggle', {
  //       detail: { input: this.input, results: this.results },
  //     })
  //   )
  // }

  // close() {
  //   if (this.resultsTarget.hidden) return
  //   this.resultsTarget.hidden = true
  //   this.inputTarget.removeAttribute('aria-activedescendant')
  //   this.element.setAttribute('aria-expanded', 'false')
  //   this.element.dispatchEvent(
  //     new CustomEvent('toggle', {
  //       detail: { input: this.input, results: this.results },
  //     })
  //   )
  // }

  filterItemResults(query) {
    const array = JSON.parse(this.items)
    this.resultsTarget.innerHTML = ''
    const results = array.filter(
      (word) =>
        word.substr(0, query.length).toUpperCase() == query.toUpperCase()
    )
    results.forEach((item, index) => {
      const html = `<li class="autocomplete-result" id="option-${index}" role="option" data-autocomplete-value="${index}">${item}</li>`
      this.resultsTarget.innerHTML += html
    })
  }

  get src() {
    return this.data.get('url')
  }

  get items() {
    return this.data.get('items')
  }

  get value() {
    return this.data.get('value')
  }

  get minLength() {
    const minLength = this.data.get('min-length')
    if (!minLength) {
      return 0
    }
    return parseInt(minLength, 10)
  }
}
