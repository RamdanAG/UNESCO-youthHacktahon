// AnimationEngine
// Handles transition/animation sequencing (scene fades, sprite movement, dice roll fx).
// Placeholder implementation - fill in real logic during development.

export class AnimationEngine {

  constructor() {
    // TODO: inject dependencies (stores, other engines)
  }

  init(): void {
    // TODO: setup initial state
    console.log("[AnimationEngine] init");
  }

  start(): void {
    // TODO: start engine logic
    console.log("[AnimationEngine] start");
  }

  pause(): void {
    // TODO: pause engine logic
    console.log("[AnimationEngine] pause");
  }

  resume(): void {
    // TODO: resume engine logic
    console.log("[AnimationEngine] resume");
  }

  stop(): void {
    // TODO: cleanup / teardown
    console.log("[AnimationEngine] stop");
  }

  playTransition(name: string): Promise<void> {
    // TODO: play named transition, resolve when finished
    return Promise.resolve();
  }

}

export default AnimationEngine;
