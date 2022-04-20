import { JSGameManager } from "./JSGameManager";
import { JSBallBehaviour } from "./JSBallBehaviour";
function makeFactory(cls) {
    return function (...args) {
        return new cls(...args);
    };
}
const JSBallBehaviourFactory = makeFactory(JSBallBehaviour);
const JSGameManagerFactory = makeFactory(JSGameManager);
export { JSBallBehaviourFactory as JSBallBehaviour, JSGameManagerFactory as JSGameManager };
//# sourceMappingURL=entry.js.map