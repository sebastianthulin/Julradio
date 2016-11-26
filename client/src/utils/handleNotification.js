const handlersByType = {}

exports.isSeen = (type, value) => {
  return handlersByType[type] && handlersByType[type](value)
}

exports.on = (type, handler) => {
  handlersByType[type] = handler
}
