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
    this.countTurn = this.count * this.opts.interval
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
        let initAngle = child.initAngle
        // 是否是第一页在最后一段
        let isFirstPageInLast = child.index === 0 && turn > this.countTurn - this.opts.interval
        if (isFirstPageInLast) initAngle = child.initAngle + this.countTurn

        if (initAngle >= turn - 90 && initAngle <= turn + 90) {
          if (isFirstPageInLast) {
            child.angle = (initAngle - turn + this.countTurn) % this.countTurn
          } else {
            child.angle = initAngle - turn
          }
          child.angle %= 360

          if (child.angle <= 90 || child >= -90) {
            const styles = {
              transform: rotateY(child.angle),
              display: child.defaultStyle.display,
            }
            if (isFirstPageInLast) {
              styles.zIndex = 0
            } else {
              styles.zIndex = this.count - child.index
            }
            setStyle(child.el, styles)
            return
          }
        }
        // 不用显示
        setStyle(child.el, {
          display: 'none',
        })
      })
      turn %= this.countTurn
    }, 1000 / 60)
  }
}

export default Jelly
