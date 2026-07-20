// BoardEngine
// Owns the grid map state: tiles, NPC/player positions.
// Placeholder implementation - fill in real logic during development.

export class BoardEngine {

  constructor() {
    // TODO: inject dependencies (stores, other engines)
  }

  init(): void {
    // TODO: setup initial state
    console.log("[BoardEngine] init");
  }

  start(): void {
    // TODO: start engine logic
    console.log("[BoardEngine] start");
  }

  pause(): void {
    // TODO: pause engine logic
    console.log("[BoardEngine] pause");
  }

  resume(): void {
    // TODO: resume engine logic
    console.log("[BoardEngine] resume");
  }

  stop(): void {
    // TODO: cleanup / teardown
    console.log("[BoardEngine] stop");
  }

  getTile(x: number, y: number): unknown {
    // TODO: return tile data at coordinate
    return null;
  }

}

export default BoardEngine;
