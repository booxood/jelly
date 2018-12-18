function setStyle (element, styles) {
  Object.assign(element.style, styles)
}
function rotateY (degrees) {
  return ' perspective(100em) rotateY(' + degrees + 'deg) '
}

class Jelly {
  constructor (id, options) {
    this.parentNode = id
    if (!(this.parentNode instanceof HTMLElement)) {
      this.parentNode = document.getElementById(id)
    }
    if (!this.parentNode) {
      throw new Error(`No found element, document.getElementById: ${id}`)
    }
    this.opts = Object.assign({
      interval: 90, // deg
    }, options)

    this.init()
  }
  init () {
    this.count = this.parentNode.childElementCount
    this.childs = Array.from(this.parentNode.children).map((el, i) => ({
      index: i,
      el,
      initAngle: this.opts.interval * i,
      angle: this.opts.interval * i,
      defaultStyle: { display: el.style.display },
    }))

    setStyle(this.parentNode, { position: 'relative' })
    this.childs.forEach(child => {
      const styles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: this.count - child.index,
        transformOrigin: 'left center',
      }
      if (child.initAngle < 90) {
        styles['transform'] = rotateY(child.initAngle)
      } else {
        styles['display'] = 'none'
      }
      setStyle(child.el, styles)
    })
  }
  run () {
    let turn = 0
    setInterval(() => {
      turn += 1
      this.childs.forEach(child => {
        if (
          child.initAngle > turn - 90 &&
          child.initAngle < turn + 90
        ) {
          child.angle = child.initAngle - turn
          child.angle %= 360

          if (child.angle < 90 || child > -90) {
            setStyle(child.el, {
              transform: rotateY(child.angle),
              display: child.defaultStyle.display,
            })
          } else {
            setStyle(child.el, {
              display: 'none',
            })
          }
        }
      })
      turn %= this.count * this.opts.interval
    }, 1000 / 60)
  }
}

export default Jelly
