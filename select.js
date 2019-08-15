const throughTdb = require('./lib/throughTdb')

function select ({ query }) {
  return throughTdb(async (db, duplex) => {
    const output = await db.stream.selectQuery(query)

    duplex.setReadable(output)

    return output
  })
}

module.exports = select
