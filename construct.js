const throughTdb = require('./lib/throughTdb')

function construct ({ query }) {
  return throughTdb(async (db, duplex) => {
    const output = await db.stream.constructQuery(query)

    duplex.setReadable(output)

    return output
  })
}

module.exports = construct
