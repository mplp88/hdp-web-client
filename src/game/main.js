// import { Boot } from './scenes/Boot';
// import { Game } from './scenes/Game';
// import { GameOver } from './scenes/GameOver';
// import { MainMenu } from './scenes/MainMenu';
// import { Preloader } from './scenes/Preloader';
import Phaser from 'phaser'
import LobbyScene from './scenes/LobbyScene'
import GameScene from './scenes/GameScene'

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#028af8',
  scene: [
    LobbyScene,
    GameScene
    // Boot,
    // Preloader,
    // MainMenu,
    // Game,
    // GameOver
  ]
}

const StartGame = (parent) => {
  return new Phaser.Game({ ...config, parent })
}

export default StartGame
