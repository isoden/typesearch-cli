declare module 'visualwidth' {
  interface VisualWidth {
    (string: string): number
    width(string: string, terminal?: boolean): number
    truncate(string: string, length: number, suffix: string, terminal?: boolean): string
    substr(string: string, start: number, length: number, terminal?: boolean): string
    substring(string: string, start: number, end: number, terminal?: boolean): string
    indexOf(string: string, searchStr: string, startIndex?: number, terminal?: boolean): number
    lastIndexOf(string: string, searchStr: string, startIndex?: number, terminal?: boolean): number
  }

  const vw: VisualWidth

  export = vw
}

declare module 'ttys' {
  import * as tty from 'tty'
  interface Ttys {
    stdin: tty.ReadStream
    stdout: tty.WriteStream
  }

  const ttys: Ttys

  export = ttys
}
