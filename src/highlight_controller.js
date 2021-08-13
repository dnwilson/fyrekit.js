import { Controller } from 'stimulus'
import highlightJs from 'highlight.js'

export default class extends Controller {
  connect() {
    document.querySelectorAll('pre code').forEach((block) => {
      highlightJs.highlightBlock(block);
    });
  }
}
