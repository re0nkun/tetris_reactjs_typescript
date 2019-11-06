import * as React from 'react'
import { TetrisProps, TetrisState } from '../type'
import TetrisBoard from './tetris-board'

class Tetris extends React.Component<TetrisProps, TetrisState> {
  constructor(props: any) {
    super(props)

    let field = []
    for (let y = 0; y< props.boardHeight; y++) {
      let row = []
      for (let x = 0; x< props.boardWidth; x++) {
        row.push(0)
      }
      field.push(row)
    }

    let xStart = Math.floor(parseInt(props.boardWidth) / 2)

    this.state = {
      activeTileX: xStart,
      activeTileY: 1,
      activeTile: 1, // 0,1,2,3,4,5,6,7
      tileRotate: 0,
      // score: 0,
      // level: 1,
      // tileCount: 0,
      // gameOver: false,
      // isPaused: false,
      field: field,
      timerId: null,
      tiles: [
        [ // The default square
          [[0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0]]
        ],
        [ // The cube tile (block 2x2)
          [[0, 0], [1, 0], [0, 1], [1, 1]],
          [[0, 0], [1, 0], [0, 1], [1, 1]],
          [[0, 0], [1, 0], [0, 1], [1, 1]],
          [[0, 0], [1, 0], [0, 1], [1, 1]]
        ],
        [ // The I tile
          [[0, -1], [0, 0], [0, 1], [0, 2]],
          [[-1, 0], [0, 0], [1, 0], [2, 0]],
          [[0, -1], [0, 0], [0, 1], [0, 2]],
          [[-1, 0], [0, 0], [1, 0], [2, 0]]
        ],
        [ // The T tile
          [[0, 0], [-1, 0], [1, 0], [0, -1]],
          [[0, 0], [1, 0], [0, 1], [0, -1]],
          [[0, 0], [-1, 0], [1, 0], [0, 1]],
          [[0, 0], [-1, 0], [0, 1], [0, -1]]
        ],
        [ // The inverse L tile
          [[0, 0], [-1, 0], [1, 0], [-1, -1]],
          [[0, 0], [0, 1], [0, -1], [1, -1]],
          [[0, 0], [1, 0], [-1, 0], [1, 1]],
          [[0, 0], [0, 1], [0, -1], [-1, 1]]
        ],
        [ // The L tile
          [[0, 0], [1, 0], [-1, 0], [1, -1]],
          [[0, 0], [0, 1], [0, -1], [1, 1]],
          [[0, 0], [1, 0], [-1, 0], [-1, 1]],
          [[0, 0], [0, 1], [0, -1], [-1, -1]]
        ],
        [ // The Z tile
          [[0, 0], [1, 0], [0, -1], [-1, -1]],
          [[0, 0], [1, 0], [0, 1], [1, -1]],
          [[0, 0], [1, 0], [0, -1], [-1, -1]],
          [[0, 0], [1, 0], [0, 1], [1, -1]]
        ],
        [ // The inverse Z tile
          [[0, 0], [-1, 0], [0, -1], [1, -1]],
          [[0, 0], [0, -1], [1, 0], [1, 1]],
          [[0, 0], [-1, 0], [0, -1], [1, -1]],
          [[0, 0], [0, -1], [1, 0], [1, 1]]
        ],
      ]
    }
  }

  componentDidMount() {
    let timerId
    timerId = window.setInterval(
      () => this.handleBoardUpdate('down'),
      1000
    )

    this.setState({ timerId })
  }

  componentWillUnmount() {
    window.clearInterval(this.state.timerId)
  }

  handleBoardUpdate(command: string) {
    // let xAdd = 0
    let yAdd = 0
    // let rotateAdd = 0
    let tile = this.state.activeTile

    // if (command === 'left') {
    //   xAdd = -1
    // }
    // if (command === 'right') {
    //   xAdd = 1
    // }
    // if (command === 'rotate') {
    //   rotateAdd = 1
    // }
    if (command === 'down') {
      yAdd = 1
    }

    let field = this.state.field
    let x = this.state.activeTileX
    let y = this.state.activeTileY
    let rotate = this.state.tileRotate
    const tiles = this.state.tiles

    field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = 0
    field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = 0
    field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = 0
    field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = 0

    let yAddIsValid = true
    if (yAdd !== 0) {
      for (let i = 0; i <= 3; i++) {
        if (
          y + yAdd + tiles[tile][rotate][i][1] >= 0 &&
          y + yAdd + tiles[tile][rotate][i][1] < this.props.boardHeight
        ) {
          // if (
          //   field[y + yAdd + tiles[tile][rotate][i][1]][x + tiles[tile][rotate][i][0]] !== 0
          // ) {
          //   yAddIsValid = false
          // }
        } else {
          yAddIsValid = false
        }
      }
    }
    if (yAddIsValid) {
      y += yAdd
    }

    field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = tile
    field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = tile
    field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = tile
    field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = tile

    this.setState({
      field: field,
      activeTileX: x,
      activeTileY: y,
      tileRotate: rotate,
      activeTile: tile
    })
  }

  render() {
    return (
      <div className="tetris">
        <TetrisBoard 
          field={this.state.field}
          // gameOver={this.state.gameOver}
          // score={this.state.score}
          // level={this.state.level}
          rotate={this.state.tileRotate}
        />

        <div className="tetris__block-controls">
          {/* <button className="btn" onClick={()=>this.handleBoardUpdate("left")}>
            Left
          </button> */}
          <button className="btn" onClick={()=>this.handleBoardUpdate("down")}>
            Down
          </button>
          {/* <button className="btn" onClick={()=>this.handleBoardUpdate("right")}>
            Right
          </button> */}
          {/* <button className="btn" onClick={()=>this.handleBoardUpdate("rotate")}>
            Rotate
          </button> */}
        </div>

        <div className="tetris__game-controls">
          {/* <button className="btn" onClick={this.handleNewGameClick}>
            New Game
          </button>

          <button className="btn" onClick={this.handlePauseClick}>
            {this.state.isPaused ? "Resume" : "Pause"}
          </button> */}
        </div>      
      </div>
    )
  }
}

export default Tetris