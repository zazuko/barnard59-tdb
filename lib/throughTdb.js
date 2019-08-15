const duplexify = require('duplexify')
const Tdb = require('jena-tdb')
const rdf = require('rdf-ext')
const { finished, PassThrough } = require('readable-stream')
const { promisify } = require('util')

function throughTdb (callback) {
  const input = new PassThrough({ objectMode: true })
  const duplex = duplexify(input, null, { objectMode: true })

  Promise.resolve().then(async () => {
    const db = new Tdb({
      binPath: '/home/bergi/opt/apache-jena/bin',
      factory: rdf
    })

    await db.stream.import(input)

    const output = await callback(db, duplex)

    if (output) {
      await promisify(finished)(output)
    }

    await db.destroy()
  })

  return duplex
}

module.exports = throughTdb
