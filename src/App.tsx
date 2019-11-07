import * as React from 'react'
import Tetris from './components/tetris'
import './App.css'

class App extends React.Component {
  public render() {
    return (
      <div>
        <Tetris boardWidth="14" boardHeight="20" />
      </div>
    )
  }
}

export default App
