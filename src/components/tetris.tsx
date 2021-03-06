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
      score: 0,
      level: 1,
      tileCount: 0,
      gameOver: false,
      isPaused: false,
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
    window.document.onkeydown = event => {
      switch (event.key) {
        case 'ArrowDown':
            this.handleBoardUpdate('down')
            break
        case 'ArrowLeft':
            this.handleBoardUpdate('left')
            break
        case 'ArrowRight':
            this.handleBoardUpdate('right')
            break
        case 'ArrowUp':
            this.handleBoardUpdate('rotate')
            break
        default:
          console.log('?')
      }
    }
    window.addEventListener("keydown", event => {
      if (event.key === "Shift") {
        this.handleBoardUpdate('rotate')
      }
    })

    let timerId
    timerId = window.setInterval(
      () => this.handleBoardUpdate('down'),
      1000 - (this.state.level * 10 > 600 ? 600 : this.state.level * 10)
    )

    this.setState({ timerId })
  }

  componentWillUnmount() {
    window.clearInterval(this.state.timerId)
  }

  handleBoardUpdate(command: string) {
    if (this.state.gameOver || this.state.isPaused) {
      return
    }

    let xAdd = 0
    let yAdd = 0
    let rotateAdd = 0
    let tile = this.state.activeTile

    if (command === 'left') {
      xAdd = -1
    }
    if (command === 'right') {
      xAdd = 1
    }
    if (command === 'rotate') {
      rotateAdd = 1
    }
    if (command === 'down') {
      yAdd = 1
    }

    let field = this.state.field
    let x = this.state.activeTileX
    let y = this.state.activeTileY
    let rotate = this.state.tileRotate
    const tiles = this.state.tiles

    // 進行元を消去
    field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = 0
    field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = 0
    field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = 0
    field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = 0

    // 横移動の判定
    let xAddIsValid = true
    if (xAdd !== 0) {
      for (let i = 0; i <= 3; i++) {
        if (　//進行先が横枠内にある
          x + xAdd + tiles[tile][rotate][i][0] >= 0 &&
          x + xAdd + tiles[tile][rotate][i][0] < this.props.boardWidth
        ) {
          if ( //進行先でタイルが重なる
            field[y + tiles[tile][rotate][i][1]][x + xAdd + tiles[tile][rotate][i][0]] !== 0
          ) {
            xAddIsValid = false
          }
        } else {
          xAddIsValid = false
        }
      }
    }
    if (xAddIsValid) {
      x += xAdd
    }

    //回転の判定
    let newRotate = rotate + rotateAdd > 3 ? 0 : rotate + rotateAdd
    let rotateIsValid = true
    if (rotateAdd !== 0) {
      for (let i = 0; i <= 3; i++) {
        if ( //回転してもフィールド枠内
          x + tiles[tile][newRotate][i][0] >= 0 &&
          x + tiles[tile][newRotate][i][0] < this.props.boardWidth &&
          y + tiles[tile][newRotate][i][1] >= 0 &&
          y + tiles[tile][newRotate][i][1] < this.props.boardHeight
        ) {
          if (
            field[y + tiles[tile][newRotate][i][1]][x + tiles[tile][newRotate][i][0]] !== 0
          ) {
            rotateIsValid = false
          }
        } else {
          rotateIsValid = false
        }
      }
    }
    if (rotateIsValid) {
      rotate = newRotate
    }

    // 縦移動の判定
    let yAddIsValid = true
    if (yAdd !== 0) {
      for (let i = 0; i <= 3; i++) {
        if (//進行先が縦枠内
          y + yAdd + tiles[tile][rotate][i][1] >= 0 &&
          y + yAdd + tiles[tile][rotate][i][1] < this.props.boardHeight
        ) {
          if (//進行先でタイルが重なる
            field[y + yAdd + tiles[tile][rotate][i][1]][x + tiles[tile][rotate][i][0]] !== 0
          ) {
            yAddIsValid = false
          }
        } else {
          yAddIsValid = false
        }
      }
    }
    if (yAddIsValid) {
      y += yAdd
    }

    // 進行先を変更
    field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = tile
    field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = tile
    field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = tile
    field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = tile

    // 進行先に進めなかった場合
    if (!yAddIsValid) {
      // 19~0
      for (let row = this.props.boardHeight - 1; row >= 0; row--) {
        let isLineComplete = true
        // 0~13
        for (let col = 0; col < this.props.boardWidth; col++) {
          if (field[row][col] === 0) {　// 横列が埋まってない
            isLineComplete = false
          }
        }
        // 横列が埋まってたら消す
        if (isLineComplete) {
          // 横列が埋まった所から上の横列
          for (let yRowSrc = row; yRowSrc > 0; yRowSrc-- ) { 
            for (let col = 0; col < this.props.boardWidth; col++) {
              // 一つ上のマスで上書き
              field[yRowSrc][col] = field[yRowSrc - 1 ][col]
            }
          }
          // rowのループをリセット（boardHeightー1)から始まる
          row = this.props.boardHeight
        }
      }

      this.setState(prev => ({
        score: prev.score + 1 * prev.level,
        tileCount: prev.tileCount + 1,
        level: 1 + Math.floor(prev.tileCount / 10)
      }))

      let timerId
      clearInterval(this.state.timerId)
      timerId = setInterval(
        () => this.handleBoardUpdate('down'),
        1000 - (this.state.level * 10 > 600 ? 600 : this.state.level * 10)
      )
      this.setState({ timerId })


      tile = Math.floor(Math.random() * 7 + 1)
      x = parseInt(this.props.boardWidth) / 2
      y = 1
      rotate = 0

      if ( //タイルが重なったら（天井）
        field[y+tiles[tile][rotate][0][1]][x+tiles[tile][rotate][0][0]] !== 0 ||
        field[y+tiles[tile][rotate][1][1]][x+tiles[tile][rotate][1][0]] !== 0 ||
        field[y+tiles[tile][rotate][2][1]][x+tiles[tile][rotate][2][0]] !== 0 ||
        field[y+tiles[tile][rotate][3][1]][x+tiles[tile][rotate][3][0]] !== 0 
      ) {
        this.setState({
          gameOver: true
        })
      } else {
        field[y+tiles[tile][rotate][0][1]][x+tiles[tile][rotate][0][0]] = tile
        field[y+tiles[tile][rotate][1][1]][x+tiles[tile][rotate][1][0]] = tile
        field[y+tiles[tile][rotate][2][1]][x+tiles[tile][rotate][2][0]] = tile
        field[y+tiles[tile][rotate][3][1]][x+tiles[tile][rotate][3][0]] = tile 
      }
    }

    this.setState({
      field: field,
      activeTileX: x,
      activeTileY: y,
      tileRotate: rotate,
      activeTile: tile
    })
  }

  handlePauseClick = () => {
    this.setState(prev => ({
      isPaused: !prev.isPaused
    }))
  }

  handleNewGameClick = () => {
    let field: any[] = []
    for (let y = 0 ; y < this.props.boardHeight; y++) {
      let row = []
      for (let x = 0; x < this.props.boardWidth; x++) {
        row.push(0)
      }
      field.push(row)
    }
    let xStart = Math.floor(parseInt(this.props.boardWidth) / 2)

    this.setState({
      activeTileX: xStart,
      activeTileY: 1,
      activeTile: 2,
      tileRotate: 0,
      score: 0,
      level: 1,
      tileCount: 0,
      gameOver: false,
      field: field,
    })
  }  

  render() {
    return (
      <div className="tetris">
        <div className="tetris__board">
          <TetrisBoard 
            field={this.state.field}
            gameOver={this.state.gameOver}
            score={this.state.score}
            level={this.state.level}
            rotate={this.state.tileRotate}
          />
        </div>

        <div className="tetris__block-controls">
          <button className="btn" onClick={()=>this.handleBoardUpdate("left")}>
            Left
          </button>
          <button className="btn" onClick={()=>this.handleBoardUpdate("down")}>
            Down
          </button>
          <button className="btn" onClick={()=>this.handleBoardUpdate("right")}>
            Right
          </button>
          <button className="btn" onClick={()=>this.handleBoardUpdate("rotate")}>
            Rotate
          </button>
        </div>

        <div className="tetris__game-controls">
          <button className="btn" onClick={this.handleNewGameClick}>
            New Game
          </button>

          <button className="btn" onClick={this.handlePauseClick}>
            {this.state.isPaused ? "Resume" : "Pause"}
          </button>
        </div>      
      </div>
    )
  }
}

export default Tetris