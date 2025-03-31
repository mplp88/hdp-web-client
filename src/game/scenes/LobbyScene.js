import Phaser from 'phaser'
import pusher from '@/utils/pusher'
import axios from 'axios'

const playerId = crypto.randomUUID().slice(0, 6)

export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LobbyScene' })
  }

  init(data) {
    this.player = {
      id: playerId,
      name: `Jugador ${playerId}`
    }
    this.lobbyCode = data.lobbyCode || ''
    this.players = data.players || []
    this.channel = null
  }

  preload() {
    // Cargar recursos si es necesario
  }

  create() {
    this.nameText = this.add.text(200, 50, `Nombre: ${this.player.name}`, {
      fontSize: '24px',
      fill: '#fff'
    })
    this.add
      .text(200, 75, 'Cambiar nombre', { fontSize: '24px', fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.changeName())
      .setVisible(true)
    this.add.text(200, 150, 'Lobby', { fontSize: '32px', fill: '#fff' })
    this.lobbyText = this.add.text(200, 200, '', { fontSize: '24px', fill: '#fff' })
    this.add
      .text(320, 160, 'Crear', { fontSize: '18px', fill: '#00f' })
      .setInteractive()
      .on('pointerdown', () => this.createLobby())
    this.add
      .text(400, 160, 'Unirse', { fontSize: '18px', fill: '#00f' })
      .setInteractive()
      .on('pointerdown', () => this.promptJoinLobby())
    this.playersText = this.add.text(200, 250, 'Jugadores:', { fontSize: '20px', fill: '#fff' })
    this.startButton = this.add
      .text(200, 450, 'Iniciar Partida', { fontSize: '24px', fill: '#0f0' })
      .setInteractive()
      .on('pointerdown', () => this.startGame())
      .setVisible(false)

    const lobbyCode = location.pathname.split('/')[1]
    if (lobbyCode) {
      this.joinLobby(lobbyCode)
    }
  }

  async createLobby() {
    try {
      this.lobbyCode = crypto.randomUUID().slice(0, 6)
      this.lobbyText.setText(`Código: ${this.lobbyCode}`).setInteractive()
      this.lobbyText.off('pointerdown')
      this.lobbyText.on('pointerdown', () => {
        navigator.clipboard.writeText(`http://${location.host}/${this.lobbyCode}`)
        alert('Vínculo copiado!')
      })

      await this.listenForPlayers()
      await axios.post(`${import.meta.env.VITE_API_URL}/create-lobby`, {
        lobbyCode: this.lobbyCode,
        player: this.player
      })
    } catch (error) {
      console.error('Error creando lobby:', error)
    }
  }

  async promptJoinLobby() {
    const lobbyCode = prompt('Lobby code', this.lobbyCode)
    this.joinLobby(lobbyCode)
  }

  async joinLobby(lobbyCode) {
    try {
      if (!lobbyCode) return
      this.lobbyCode = lobbyCode
      this.lobbyText.setText(`Código: ${this.lobbyCode}`)
      await this.listenForPlayers()
      await axios.post(`${import.meta.env.VITE_API_URL}/join-lobby`, {
        lobbyCode: lobbyCode,
        player: this.player
      })
    } catch (error) {
      alert('El lobby no existe')
      location.href = '/'
    }
  }

  async listenForPlayers() {
    this.channel = pusher.subscribe(`lobby-${this.lobbyCode}`)
    this.channel.bind('player-joined', (data) => {
      const { players: lobbyPlayers, host } = data
      this.players = []

      lobbyPlayers.forEach((player) => {
        this.players.push(player)
      })

      this.printNames()
      if (this.players.length >= 3 && this.player.id == host) {
        this.startButton.setVisible(true)
      }
    })
    this.channel.bind('player-changed-name', (data) => {
      console.log('player-changed-name', data)
      const { player } = data
      this.players.find((p) => p.id == player.id).name = player.name
      this.printNames()
    })
    this.channel.bind('update-players', (data) => {
      const { players } = data
      this.players = []
      players.forEach((player) => {
        this.players.push(player)
      })
    })
  }

  printNames() {
    const playerNames = this.players.map((player) => player.name)
    this.playersText.setText(`Jugadores: \n${playerNames.join('\n')}`)
  }

  startGame() {
    this.scene.start('GameScene', { lobbyCode: this.lobbyCode, players: this.players })
  }

  async changeName() {
    const name = prompt('Nombre', this.player.name)
    if (!name) return
    this.player.name = name
    this.nameText.setText(`Nombre: ${this.player.name}`)
    await axios.post(`${import.meta.env.VITE_API_URL}/change-name/${this.lobbyCode}`, {
      player: this.player
    })
  }
}
