import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['days', 'hours', 'minutes', 'seconds']
  static value = {
    endAt: String
  }

  connect() {
    let interval = setInterval(() => {
      this.daysTarget.classList.remove("changing")
      this.hoursTarget.classList.remove("changing")
      this.minutesTarget.classList.remove("changing")
      this.secondsTarget.classList.remove("changing")

      let countdown = this.calculateCountdown()

      this.data.set('day', countdown.days)
      this.data.set('hour', countdown.hours)
      this.data.set('min', countdown.minutes)
      this.data.set('sec', countdown.seconds)

      const daysChanged = this.daysTarget.innerHTML != countdown.days 
      const hoursChanged = this.hoursTarget.innerHTML != countdown.hours 
      const minutesChanged = this.minutesTarget.innerHTML != countdown.minutes 
      const secondsChanged = this.secondsTarget.innerHTML != countdown.seconds

      this.daysTarget.innerHTML = this.addLeadingZeros(countdown.days)
      this.hoursTarget.innerHTML = this.addLeadingZeros(countdown.hours)
      this.minutesTarget.innerHTML = this.addLeadingZeros(countdown.minutes)
      this.secondsTarget.innerHTML = this.addLeadingZeros(countdown.seconds)

      if (daysChanged) { this.daysTarget.classList.add("changing") }
      if (hoursChanged) { this.hoursTarget.classList.add("changing") }
      if (minutesChanged) { this.minutesTarget.classList.add("changing") }
      if (secondsChanged) { this.secondsTarget.classList.add("changing") }

      if (this.distance < 0) {
        clearInterval(interval)
      }
    }, 1000)
  }

  calculateCountdown() {
    const targetDate = new Date("Jul 5, 2021 08:00:00").getTime()
    const now = new Date().getTime();
    this.distance = targetDate - now
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }

    timeLeft.days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
    timeLeft.hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    timeLeft.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
    timeLeft.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
    return timeLeft
  }

  addLeadingZeros(value) {
    let tempValue = String(value)
    while (tempValue.length < 2) {
      tempValue = '0' + value
    }
    return tempValue
  }
}
