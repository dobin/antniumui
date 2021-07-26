
export interface PacketInfo {
  Command: Packet
  State: number
  ClientIp: string
  TimeRecorded: string
  TimeSent: string
  TimeAnswered: string
}

export interface Packet {
  computerid: string
  packetid: string
  command: string
  arguments: { [id: string]: string }
  response: { [id: string]: string }
}

export interface ClientInfo {
  ComputerId: string
  LastSeen: string
  LastIp: string
}

export interface Campaign {
  ApiKey:      string
  AdminApiKey: string
  EncKey:      string
  WithZip:     boolean
  WithEnc:     boolean

  ServerUrl: string

  CommandSendPath:         string
  CommandGetPath:          string
  CommandFileUploadPath:   string
  CommandFileDownloadPath: string
}