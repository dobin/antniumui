
export type SrvCmdList2 = SrvCmdBase[]

export interface SrvCmdBase {
  Command: Command
  State: number
  Source: number
  TimeRecorded: string
  TimeSent: string
  TimeAnswered: string
}

export interface Command {
  computerid: string
  packetid: string
  command: string
  response: string
  arguments: any  // Code knows argument layout
}

export interface ClientBase {
  ComputerId: string
  LastSeen: string
}


