module.exports = function isInsertUpdateDeleteQuery (query) {
  const trimmedQuery = query.trim().toLowerCase()
  return trimmedQuery.startsWith('insert') ||
           trimmedQuery.startsWith('update') ||
           trimmedQuery.startsWith('delete')
}
