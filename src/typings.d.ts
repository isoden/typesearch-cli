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

declare module 'npm-install-package' {
  interface Options {
    /** save a value to dependencies. Defaults to false */
    save: boolean

    /** save a value to devDependencies. Defaults to false */
    saveDev: boolean

    /** attempt to get packages from the local cache first. Defaults to false */
    cache: boolean

    /** install packages silently without writing to stdout. Defaults to false */
    silent: boolean
  }
  
  interface NpmInstallPackage {
    (deps: string | string[], opts?: Partial<Options>, cb?: (err: Error) => void): void
  }

  const npmInstallPackage: NpmInstallPackage

  export = npmInstallPackage
}
