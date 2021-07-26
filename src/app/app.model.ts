
export interface PacketInfo {
  Packet: Packet
  State: number
  ClientIp: string
  TimeRecorded: string
  TimeSent: string
  TimeAnswered: string

  Hostname: string
  LocalIps: string[]
}

export interface Packet {
  computerid: string
  packetid: string
  packetType: string
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

  PacketSendPath:   string
  PacketGetPath:    string
  FileUploadPath:   string
  FileDownloadPath: string
}