import {emulator, init} from "@onflow/flow-js-testing"

describe("test setup", () => {
  // Instantiate emulator and path to Cadence files
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence")

    await init(basePath)
    await emulator.start()
  })

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    await emulator.stop()
  })

  test("basic test", async () => {
    // Turn on logging from begining
    emulator.setLogging(true)
    // some asserts and interactions

    // Turn off logging for later calls
    emulator.setLogging(false)
    // more asserts and interactions here
  })
})