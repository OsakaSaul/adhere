
export default function log(message: any) {
  const timestamp = new Date()
  console.log(`[${timestamp.toUTCString()}] ${message}`)
}

export function lerror(message: any) {
  const timestamp = new Date()
  console.error(`[${timestamp.toUTCString()}] ERROR: ${message}`)
}
