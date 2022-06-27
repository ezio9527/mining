class Type {
  static {
    ['Null', 'Undefined', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'RegExp'].forEach(function (t) {
      Type['is' + t] = function (o) {
        return Type.typeOf(o) === t.toLowerCase()
      }
    })
  }

  static typeOf (o) {
    const s = Object.prototype.toString.call(o)
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
  }

  static install (app, options) {
    app.config.globalProperties.$type = Type
  }
}

export default Type
