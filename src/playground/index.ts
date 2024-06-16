import {constants, F1TelemetryClient} from '..'
import fs from 'fs'
import path from 'path'

const {PACKETS} = constants;

let lapData: any[] = []

const client = new F1TelemetryClient({
  port: 30500,
  bigintEnabled: false,
});

// client.on(PACKETS.event, console.log)
// client.on(PACKETS.motion, console.log)
// client.on(PACKETS.carSetups, console.log)
client.on(PACKETS.lapData, saveLaps)
// client.on(PACKETS.session, console.log)
// client.on(PACKETS.participants, console.log)
// client.on(PACKETS.carTelemetry, console.log)
// client.on(PACKETS.carStatus, console.log)
// client.on(PACKETS.finalClassification, console.log)
// client.on(PACKETS.lobbyInfo, console.log)
// client.on(PACKETS.carDamage, console.log)
// client.on(PACKETS.sessionHistory, console.log)
// client.on(PACKETS.tyreSets, console.log)
// client.on(PACKETS.motionEx, console.log)

client.start();

// stops the client
[
  'exit',
  'SIGINT',
  'SIGUSR1',
  'SIGUSR2',
  'uncaughtException',
  'SIGTERM',
].forEach(eventType => {
  (process as NodeJS.EventEmitter).on(eventType, () => client.stop())
});

function saveLaps(data: any) {
  console.log(data)
  lapData.push(data)
}

// on client close write the lap data to a file
client.on('close', () => {
  console.log('Writing lap data to file before closing...')
  fs.writeFile('lapData.json', JSON.stringify(lapData), (err) => {
    if (err) {
      console.error('Error writing lap data to file:', err)
    } else {
      console.log('Lap data written to file successfully')
    }
  })
})