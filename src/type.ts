export type TetrisProps = {
  boardWidth: any,
  boardHeight: any
}

export type TetrisState = {
  activeTileX: number,
  activeTileY: number,
  activeTile: number,
  tileRotate: number,
  score: number,
  level: number,
  tileCount: number,
  gameOver: boolean,
  isPaused: boolean,
  field: any[],
  timerId: any,
  tiles: number[][][][]
}

export type TetrisBoardProps = {
  field: any[],
  gameOver: boolean,
  score: number,
  level: number,
  rotate: number
}