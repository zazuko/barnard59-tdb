const throughTdb = require('./lib/throughTdb')

function update ({ queries }) {
  return throughTdb(async (db, duplex) => {
    for (const query of queries) {
      await db.updateQuery(query)
    }

    const output = await db.stream.dump()

    duplex.setReadable(output)

    return output
  })
}

module.exports = update
