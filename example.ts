import { CosmosMirage } from '.'

if (!process.env.ENDPOINT) throw new Error('Set ENDPOINT')
if (!process.env.MASTER_KEY) throw new Error('Set MASTER_KEY')

const client = CosmosMirage({
  endpoint: process.env.ENDPOINT,
  masterKey: process.env.MASTER_KEY
})

async function run() {
  const items = await client.items('test', 'test')
  const item = items[0]
  item.foo = 'bar'
  item.baz = 'boom'
}

run().catch(err => console.log(err))
