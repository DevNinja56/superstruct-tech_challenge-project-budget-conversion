module.exports = function roundToDecimalPlaces (num, decimalPlaces = 2) {
  const multiplier = Math.pow(10, decimalPlaces)
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier
}
