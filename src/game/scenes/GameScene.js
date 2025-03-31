import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  init(data) {
    this.lobbyCode = data.lobbyCode
    this.players = data.players
  }

  create() {
    this.add.text(400, 50, 'Pantalla de Juego', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5)
    this.add
      .text(700, 50, 'Volver al lobby')
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('LobbyScene', { lobbyCode: this.lobbyCode, players: this.players })
      })
    this.players.forEach((player, index) => {
      const x = Phaser.Math.Between(100, 700)
      const y = Phaser.Math.Between(150, 500)
      this.add.text(x, y, player.name, { fontSize: '24px', fill: '#0f0' }).setOrigin(0.5)
    })
  }
}
