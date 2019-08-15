/* global describe, expect, it, jest */

jest.setTimeout(10000)

const getStream = require('get-stream')
const { isReadable, isWritable } = require('isstream')
const namespace = require('@rdfjs/namespace')
const rdf = require('rdf-ext')
const { Readable } = require('readable-stream')
const select = require('../select')

const ns = {
  example: namespace('http://example.com/', rdf)
}

describe('select', () => {
  it('is a function', () => {
    expect(typeof select).toBe('function')
  })

  it('returns a duplex stream', async () => {
    const result = select({ query: '' })

    expect(isReadable(result)).toBe(true)
    expect(isWritable(result)).toBe(true)
  })

  it('imports the incoming quad stream and returns the results of the given query as quad stream', async () => {
    const quad = rdf.quad(ns.example.subject, ns.example.predicate, rdf.literal('object0'))
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push(rdf.quad(
          rdf.namedNode('http://example.com/subject'),
          rdf.namedNode('http://example.com/predicate'),
          rdf.literal('object0')
        ))
        input.push(null)
      }
    })

    const selectStream = select({
      query: 'SELECT ?s WHERE { ?s ?p ?o }'
    })

    input.pipe(selectStream)

    const result = await getStream.array(selectStream)

    expect(result.length).toBe(1)
    expect(quad.subject.equals(result[0].s)).toBe(true)
  })
})
