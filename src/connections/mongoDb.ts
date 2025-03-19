import { MongoClient, ServerApiVersion } from "mongodb"

// const mongoUser = process.env.MONGO_USER
// const mongoPass = process.env.MONGO_PASS
const mongoDb = process.env.MONGO_DB
// const mongoUrl = process.env.MONGO_URL
// const uri = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoUrl}/${mongoDb}?retryWrites=false&w=majority`
const uri = `mongodb://mongodb/${mongoDb}?retryWrites=false&w=majority`

const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

process.on("SIGINT", () => {
  mongoClient.close().then(() => {
    process.exit(0)
  })
})
process.on("SIGTERM", () => {
  mongoClient.close().then(() => {
    process.exit(0)
  })
})

export default mongoClient
