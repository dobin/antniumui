
export type SrvCmdList2 = SrvCmdBase[]

export interface SrvCmdBase {
  Command: Command
  State: number
  Source: number
}

export interface Command {
  computerid: string
  packetid: string
  command: string
  response: string
  arguments: string[]
}
