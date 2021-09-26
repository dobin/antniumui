
export interface PacketInfo {
  Packet: Packet
  State: number
  ClientIp: string
  User: string
  TimeRecorded: string
  TimeSent: string
  TimeAnswered: string
}

export interface Packet {
  computerid: string
  packetid: string
  packetType: string
  arguments: { [id: string]: string }
  response: { [id: string]: string }
  downstreamId: string
}

export interface ClientInfo {
  ComputerId: string
  LastSeen: string
  FirstSeen: string
  LastIp: string

  Hostname: string
  LocalIps: string[]
  Arch: string
  Processes: string[]
  isElevated: string
  isAdmin: string
  WorkingDir: string
}

export interface Campaign {
  ApiKey:      string
  AdminApiKey: string
  EncKey:      string
  WithZip:     boolean
  WithEnc:     boolean

  ServerUrl: string

  PacketSendPath:   string
  PacketGetPath:    string
  FileUploadPath:   string
  FileDownloadPath: string
}

export const PacketState = {
	RECORDED: 0,
	SENT: 1,
	ANSWERED: 2,
	CLIENT: 3,
}

/* Client defined, Not defined on server */

export interface DownstreamInfo {
  Name: string
  Info: string
}

export interface DirEntry {
  name: string
  size: number
  mode: string
  modified: string
  isDir: boolean
}
