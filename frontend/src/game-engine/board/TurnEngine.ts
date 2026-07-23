// TurnEngine
// Tracks whose turn it is among up to 4 players and advances turn order.
// Placeholder implementation - fill in real logic during development.

export class TurnEngine {

  constructor() {
    // TODO: inject dependencies (stores, other engines)
  }

  init(): void {
    // TODO: setup initial state
    console.log("[TurnEngine] init");
  }

  start(): void {
    // TODO: start engine logic
    console.log("[TurnEngine] start");
  }

  pause(): void {
    // TODO: pause engine logic
    console.log("[TurnEngine] pause");
  }

  resume(): void {
    // TODO: resume engine logic
    console.log("[TurnEngine] resume");
  }

  stop(): void {
    // TODO: cleanup / teardown
    console.log("[TurnEngine] stop");
  }

  nextTurn(): string {
    // TODO: rotate to next player id
    return "";
  }

}

export default TurnEngine;
