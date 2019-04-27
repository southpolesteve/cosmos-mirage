import { CosmosClient, Item } from '@azure/cosmos'

interface Options {
  endpoint: string
  masterKey: string
}

export function CosmosMirage(options: Options) {
  const { endpoint, masterKey } = options
  const client = new CosmosClient({
    endpoint,
    auth: {
      masterKey
    }
  })

  return {
    items: (db, container) => query(client, db, container)
  }
}

async function query(client: CosmosClient, db: string, conatiner: string) {
  const container = client.database(db).container(conatiner)
  const response = await container.items.readAll().fetchAll()

  return response.resources.map(
    resource => new Proxy(resource, handler(container.item(resource.id)))
  )
}

function handler(item: Item) {
  let inProgress = 0
  return {
    get: function(obj, prop) {
      return obj[prop]
    },
    set: function(obj, prop, value) {
      obj[prop] = value
      inProgress++
      item
        .replace(obj)
        .then(() => console.log('Synced item to server', item.id))
      return true
    }
  }
}
