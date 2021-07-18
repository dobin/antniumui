
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
  arguments: { [id: string]: string }
  response: { [id: string]: string }
}

export interface ClientBase {
  ComputerId: string
  LastSeen: string
}


