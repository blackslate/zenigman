/** script.js **
 *
 *
**/



;(function scriptLoaded(global){
  "use strict"


  let jazyx = global.jazyx

  if (!jazyx) {
    jazyx = global.jazyx = {}
  }

  if (!(jazyx.classes)) {
    jazyx.classes = {}
  }



  ;(function createJXTRElement() {

    // https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox

    const template = document.createElement('template')

    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
          background: #900;
          background-size: contain;
          width: 1em;
          height: 1em;
        }
        :host([hidden]) {
          display: none;
        }
        :host([checked]) {
          background: #090;
          background-size: contain;
        }
        :host([disabled]) {
          background: #966;
          background-size: contain;
        }
        :host([checked][disabled]) {
          background: #696;
          background-size: contain;
        }
      </style>
    `

      class VO2 extends HTMLElement {

        static get observedAttributes() {
          return ['checked', 'disabled'];
        }


        constructor() {
          super()
          this.attachShadow({mode: 'open'})
          this.shadowRoot.appendChild(template.content.cloneNode(true))
        }


        connectedCallback() {
          if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'checkbox');
          }
          if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', 0);
          }

          this._upgradeProperty('checked');
          this._upgradeProperty('disabled');

          this.addEventListener('keyup', this._onKeyUp);
          this.addEventListener('click', this._onClick);
        }


        disconnectedCallback() {
          this.removeEventListener('keyup', this._onKeyUp);
          this.removeEventListener('click', this._onClick);
        }


        _upgradeProperty(prop) {
          if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
          }
        }


        set checked(value) {
          const isChecked = Boolean(value);
          if (isChecked) {
            this.setAttribute('checked', '');
          } else {
            this.removeAttribute('checked');
          }
        }


        get checked() {
          return this.hasAttribute('checked');
        }


        set disabled(value) {
          const isDisabled = Boolean(value);

          if (isDisabled) {
            this.setAttribute('disabled', '');
          } else {
            this.removeAttribute('disabled');
          }
        }


        get disabled() {
          return this.hasAttribute('disabled');
        }


        attributeChangedCallback(name, oldValue, newValue) {
          const hasValue = newValue !== null;

          switch (name) {
            case 'checked':
              this.setAttribute('aria-checked', hasValue);
            break;

            case 'disabled':
              this.setAttribute('aria-disabled', hasValue);
              if (hasValue) {
                this.removeAttribute('tabindex');
                this.blur();

              } else {
                this.setAttribute('tabindex', '0');
              }
            break;
          }
        }


        _onKeyUp(event) {
          if (event.altKey) { return }

          switch (event.keyCode) {
            case KEYCODE.SPACE:
              event.preventDefault();
              this._toggleChecked();
            break;
            default:
              return;
          }
        }


        _onClick(event) {
          this._toggleChecked();
        }


        _toggleChecked() {
          if (this.disabled) { return }

          this.checked = !this.checked;

          this.dispatchEvent (
            new CustomEvent('change'
          , { detail:
              { checked: this.checked }
            , bubbles: true
            }
          ));
        }
      }


    window.customElements.define("jx-tr", VO2)
  })()



  jazyx.classes.Script = class Script {
    constructor() {
      this.divs = [].slice.apply(document.querySelectorAll("div"))
      this.langButtons = this._getElements("aside input")

      let listener = this.treatClick.bind(this)
      document.body.onclick = listener

      listener = this.setVO.bind(this)
      let aside = document.querySelector("aside")
      aside.onchange = listener

      listener()

      listener = this.scroll.bind(this)
      document.body.scroll = listener

      listener = this.windowResize.bind(this)
      window.onresize = listener

      listener = this.treatHashChange.bind(this)
      window.onhashchange = listener

      listener()
    }


    treatClick(event) {
      // event.preventDefault()
      let target = event.target
      if (target.tagName !== "A") {
        return
      }

      let divId = target.href.split("#").pop()


      this._activateDiv(divId)
    }


    treatHashChange(event) {
      let divId = window.location.hash.substring(1)
      if (!divId) {
        divId = "intro"
      }

      this._activateDiv(divId)
    }


    windowResize() {
      this._prepareScrollAction(this.div)
    }


    scroll(event) {
      let scrollTop = event.target.scrollTop
      let scrollBottom = this.height - scrollTop
      let fullScroll = !(scrollBottom > window.innerHeight)
      this._showFullScrollState(fullScroll)
    }


    setVO(event) {
      let htmlElement = document.querySelector("html")
      let target
        , id
        , input

      if (event) {
        target = event.target
        if (target.tagName !== "INPUT") { return }

        id = target.id
        htmlElement.setAttribute("lang", id)

      } else {
        id = htmlElement.getAttribute("lang") || "en"
        this.langButtons[id].checked = true
      }

      console.log(htmlElement.getAttribute("lang"))
    }


    _getElements(selector) {
      let elements = {}
      let array = [].slice.call(document.querySelectorAll(selector))

      array.forEach(element => {
        elements[element.id] = element
      })

      return elements
    }


    _activateDiv(divId) {
      if (this.header) {
        this.header.onscroll = null
      }

      this.divs.forEach(div => {
        if (div.id === divId) {
          div.classList.add("active")
          this._prepareScrollAction(div)

        } else {
          div.classList.remove("active")
        }
      })
    }


    _prepareScrollAction(div) {
      this.div = div
      let header = this.header = div.querySelector("header")
      this.footer = div.querySelector("footer")

      // The bottom padding should always be the same, but let's
      // recalculate to be sure
      let style = getComputedStyle(header, null)
      let padding = style.getPropertyValue('padding-bottom')
      padding = parseFloat(padding, 10)
      console.log(padding)

      let top  = header.firstElementChild.getBoundingClientRect().top
      let last  = header.lastElementChild
      let height = last.getBoundingClientRect().bottom - top
      this.height = height + padding

      let listener = this.scroll.bind(this)
      header.onscroll = listener

      listener({ target: header })
    }


    _showFullScrollState(isFullScroll) {
      if (isFullScroll) {
        this.footer.classList.add("full")
      } else {
        this.footer.classList.remove("full")
      }
    }
  }


  jazyx.script = new jazyx.classes.Script()

})(window)