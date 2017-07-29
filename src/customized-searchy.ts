import * as Charm   from 'charm'
import * as vw      from 'visualwidth'
import * as ttys    from 'ttys'
import { Deferred } from 'ts-deferred'

interface State {
  query: string
  height: number
  matches: string[]
}

export interface Listener {
  (query: string): string[] | Promise<string[]>
}

enum KeyCodes {
  DOWN      = '27.91.66',
  UP        = '27.91.65',
  BACKSPACE = '127',
  CTRL_C    = '3',
  CTRL_D    = '4',
  CTRL_K    = '11',
  CTRL_J    = '10',
  CTRL_L    = '12',
  CTRL_N    = '14',
  CTRL_P    = '16',
  ENTER     = '13',
}

export const onInput = (listener: Listener): Promise<string> => {
  const charm = Charm()
  const defer = new Deferred<string>()

  charm.pipe(ttys.stdout)
  charm.reset()
  charm.cursor(true)
  charm.foreground('white')
  ttys.stdin.setRawMode(true)

  const state: State = {
    query  : '',
    height : 0,
    matches: []
  }

  ttys.stdin.on('data', chunk => {
    if (state.height < 0) {
      state.height = 0
    }

    if (vw.width(chunk.toString()) === 0) {
      return
    }

    const { rows, columns } = ttys.stdout

    charm.cursor(false)

    if (chunk[0] === +KeyCodes.BACKSPACE && chunk.length > 1) {
      return chunk.forEach(() => ttys.stdin.emit('data', [KeyCodes.BACKSPACE]))
    }

    const keyCode = chunk.join('.')

    switch (keyCode) {
      case KeyCodes.UP:
      case KeyCodes.CTRL_P:
      case KeyCodes.CTRL_K: {
        const { height } = state

        state.height = Math.max(0, state.height - 1)
        drawRow(charm, columns, state.height, state.matches, height)
        drawRow(charm, columns, state.height, state.matches, state.height)

        break
      }

      case KeyCodes.DOWN:
      case KeyCodes.CTRL_N:
      case KeyCodes.CTRL_J: {
        const { height } = state

        state.height = Math.min(rows, state.matches.length - 1, state.height + 1)
        drawRow(charm, columns, state.height, state.matches, height)
        drawRow(charm, columns, state.height, state.matches, state.height)

        break
      }

      case KeyCodes.CTRL_C:
      case KeyCodes.CTRL_D: {
        cleanupScreen(charm)
        process.exit()

        break
      }

      case KeyCodes.ENTER: {
        cleanupScreen(charm)

        if (state.matches.length > 0) {
          defer.resolve(state.matches[state.height].toString())
        }

        break
      }

      case KeyCodes.BACKSPACE: {
        state.height = 0

        if (state.query.length > 0) {
          state.query = state.query.substr(0, state.query.length - 1)
        }

        drawQuery(charm, state.query)
        update(state, charm, rows, columns, listener)

        break
      }

      case KeyCodes.CTRL_L: {
        drawQuery(charm, state.query)
        update(state, charm, rows, columns, listener)

        break
      }

      default: {
        if (!keyCode.startsWith('27.91.')) {
          state.query  = state.query + chunk
          state.height = 0
        }

        drawQuery(charm, state.query)
        update(state, charm, rows, columns, listener)
      }
    }
  })

  ttys.stdin.emit('data', [KeyCodes.CTRL_L])

  return defer.promise
}

const update = async (state: State, charm: Charm.CharmInstance, rows: number, cols: number, listener: Listener) => {
  state.matches = await Promise.resolve(listener(state.query))
  drawScreen(charm, rows, cols, state.query, state.height, state.matches)
}

const cleanupScreen = (charm: Charm.CharmInstance) => {
  charm.display('reset')
  charm.erase('up')
  charm.erase('down')
  charm.position(1, 1)
  charm.cursor(true)
  charm.end()
  ttys.stdin.setRawMode(false)

  return ttys.stdin.end()
}

const drawQuery = (charm: Charm.CharmInstance, query: string) => {
  charm.display('reset')
  charm.position(1, 1)
  charm.erase('line')

  return charm.write(`query: ${ query }`)
}

const drawScreen = (charm: Charm.CharmInstance, rows: number, columns: number, query: string, selRow: number, matches: State['matches']) => {
  drawQuery(charm, query)

  return Array.from(Array(rows - 1), (_, row) => drawRow(charm, columns, selRow, matches, row))
}

const drawRow = (charm: Charm.CharmInstance, columns: number, selRow: number, matches: State['matches'], row: number) => {
  charm.display('reset')

  if (row < 0) {
    return
  }

  charm.position(1, row + 2)

  if (row >= matches.length) {
    return charm.erase('line')
  }

  if (row === selRow) {
    charm.display('reverse')
  }

  const text      = matches[row].toString()
  const padLength = Math.max(0, columns - vw.width(text))

  return charm.write(vw.truncate(text + ' '.repeat(padLength), columns - 1, ''))
}
