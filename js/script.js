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



  jazyx.classes.Script = class Script {
    constructor() {
      this.divs = [].slice.apply(document.querySelectorAll("div"))

      let listener = this.treatClick.bind(this)
      document.body.onclick = listener

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