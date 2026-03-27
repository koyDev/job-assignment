const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

let eventBuffer = []
const MAX_EVENTS = 5

function evictEvent() {
  let idx = eventBuffer.findIndex(e => e.priority === 'low')
  if (idx !== -1) {
    return eventBuffer.splice(idx, 1)
  }

  idx = eventBuffer.findIndex(e => e.priority === 'normal')
  if (idx !== -1) {
    return eventBuffer.splice(idx, 1)
  }
  
  return null
}

function broadcast(event) {
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'new_event', data: event }))
    }
  })
}

app.post('/events', (req, res) => {
  const { type, message, priority } = req.body
  if (!type || !message || !priority) {
    return res.status(400).json({ error: 'Missing fields.' })
  }
  const event = {
    id: Date.now() + Math.random(),
    type,
    message,
    priority,
    timestamp: Date.now()
  }
  if (eventBuffer.length >= MAX_EVENTS) {
    const onlyHigh = eventBuffer.every(e => e.priority === 'high')
    if (onlyHigh) {
      return res.status(429).json({ error: 'Feed full of high-priority events.' })
    }
    evictEvent()
  }
  eventBuffer.push(event)
  broadcast(event)
  return res.status(201).json(event)
})

app.get('/events', (req, res) => {
  const sorted = [...eventBuffer].sort((a, b) => b.timestamp - a.timestamp)
  res.json(sorted)
})

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'init', data: eventBuffer }))
})

server.listen(3000, () => console.log('Listening on http://localhost:3000'))
