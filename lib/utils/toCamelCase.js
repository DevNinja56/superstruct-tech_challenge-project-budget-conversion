module.exports = function toCamelCase (str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
