export const throbber = () => {
  let index = 0
  const timerId = setInterval(() => index = write(index), 100)

  return () => {
    clearInterval(timerId)
    process.stdout.write('\b')
  }
}

const write = (index: number): number => {
  const chars   = ['|', '\\', '-', '/', '|', '\\', '-', '/']
  const message = `Installing: ` + chars[index]

  process.stdout.write(`Installing: ` + chars[index])
  process.stdout.write('\b'.repeat(message.length))

  return index + 1 === chars.length ? 0 : index + 1
}
