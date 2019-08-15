/* global describe, expect, it, jest */

jest.setTimeout(10000)

const getStream = require('get-stream')
const { isReadable, isWritable } = require('isstream')
const namespace = require('@rdfjs/namespace')
const rdf = require('rdf-ext')
const { Readable } = require('readable-stream')
const construct = require('../construct')

const ns = {
  example: namespace('http://example.org/', rdf),
  exampleCom: namespace('http://example.com/', rdf)
}

describe('construct', () => {
  it('is a function', () => {
    expect(typeof construct).toBe('function')
  })

  it('returns a duplex stream', async () => {
    const result = construct({ query: '' })

    expect(isReadable(result)).toBe(true)
    expect(isWritable(result)).toBe(true)
  })

  it('imports the incoming quad stream and returns the results of the given query as quad stream', async () => {
    const quadInput = rdf.quad(ns.example.subject, ns.example.predicate, rdf.literal('object0'))
    const quadOutput = rdf.quad(quadInput.predicate, quadInput.subject, quadInput.object)
    const expected = rdf.dataset([quadOutput])
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push(quadInput)
        input.push(null)
      }
    })

    const constructStream = construct({
      query: 'CONSTRUCT { ?p ?s ?o. } WHERE { ?s ?p ?o. }'
    })

    input.pipe(constructStream)

    const result = await getStream.array(constructStream)
    const actual = rdf.dataset(result)

    expect(actual.toCanonical()).toBe(expected.toCanonical())
  })
})
