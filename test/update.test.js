/* global describe, expect, it, jest */

jest.setTimeout(10000)

const getStream = require('get-stream')
const { isReadable, isWritable } = require('isstream')
const namespace = require('@rdfjs/namespace')
const rdf = require('rdf-ext')
const { Readable } = require('readable-stream')
const update = require('../update')

const ns = {
  example: namespace('http://example.org/', rdf)
}

describe('update', () => {
  it('is a function', () => {
    expect(typeof update).toBe('function')
  })

  it('returns a duplex stream', async () => {
    const result = update({ queries: [] })

    expect(isReadable(result)).toBe(true)
    expect(isWritable(result)).toBe(true)
  })

  it('imports the incoming quad stream and exports the result as quad stream', async () => {
    const quad = rdf.quad(ns.example.subject, ns.example.predicate, rdf.literal('object0'))
    const expected = rdf.dataset([quad])
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push(quad)
        input.push(null)
      }
    })

    const updateStream = update({ queries: [] })

    input.pipe(updateStream)

    const result = await getStream.array(updateStream)
    const actual = rdf.dataset(result)

    expect(actual.toCanonical()).toBe(expected.toCanonical())
  })

  it('runs the given query', async () => {
    const quad0 = rdf.quad(ns.example.subject, ns.example.predicate, rdf.literal('object0'))
    const quad1 = rdf.quad(ns.example.subject, ns.example.predicate, rdf.literal('object1'))
    const expected = rdf.dataset([quad0, quad1])
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push(quad0)
        input.push(null)
      }
    })

    const updateStream = update({
      queries: [
        `INSERT DATA { ${quad1.toString()} }`
      ]
    })

    input.pipe(updateStream)

    const result = await getStream.array(updateStream)
    const actual = rdf.dataset(result)

    expect(actual.toCanonical()).toBe(expected.toCanonical())
  })

  it('runs the given queries', async () => {
    const quad0 = rdf.quad(ns.example.subject, ns.example.predicate, rdf.literal('object0'))
    const quad1 = rdf.quad(ns.example.subject, ns.example.predicate, rdf.literal('object1'))
    const quad2 = rdf.quad(ns.example.subject, ns.example.predicate, rdf.literal('object2'))
    const expected = rdf.dataset([quad0, quad1, quad2])
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push(quad0)
        input.push(null)
      }
    })

    const updateStream = update({
      queries: [
        `INSERT DATA { ${quad1.toString()} }`,
        `INSERT DATA { ${quad2.toString()} }`
      ]
    })

    input.pipe(updateStream)

    const result = await getStream.array(updateStream)
    const actual = rdf.dataset(result)

    expect(actual.toCanonical()).toBe(expected.toCanonical())
  })
})
