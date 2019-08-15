# barnard59-tdb

SPARQL data processing support for Barnard59 Linked Data pipelines using [Jena TDB](https://jena.apache.org/documentation/tdb/commands.html).
All operations provide a readable and writable stream interface.
The Writable stream expects RDFJS quads.
All incoming quads will be written to a temporary TDB database.
A database dump or the result of the query will be written to the readable stream.

## Operations

### construct

Runs a construct query and returns the result as a RDFJS quad stream.

- `query`: The SPARQL construct query as a string.

### select

Runs a select query and returns each row of the results as single chunk object.
The chunk object contains key-value pairs for each variable of the select query. 

- `query`: The SPARQL select query as a string.

### update

Runs multiple update queries and returns a database dump as a RDFJS quad stream.

- `queries`: SPARQL update queries as an array of strings.

## Examples

### update

The example pipeline in `examples/update.ttl` parses the pipeline description in the `update.ttl` file and feeds it to the TDB `update` operation.
Two queries are used.
All `examples/update.ttl` literals are updated to `examples/outdated.ttl` in the first query.
And again changed to `examples/update.ttl` in the second query.
The TDB data is then serialized to N-Triples and the `barnard59` command line tool writes it to `stdout`.   
The example can be run with the following command:

```bash
./node_modules/.bin/barnard59 run --format=text/turtle --pipeline=http://example.org/pipeline#pipeline --verbose examples/update.ttl
```
