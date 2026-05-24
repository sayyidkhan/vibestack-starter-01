import 'dotenv/config'
import { startApiServer } from './app'

startApiServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
