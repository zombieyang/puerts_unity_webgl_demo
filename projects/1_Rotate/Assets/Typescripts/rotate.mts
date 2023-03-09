import { speed } from "./config/const.mjs";
class Rotate {
    bindTo: CS.PuertsTest.JsBehaviour

    constructor(bindTo: CS.PuertsTest.JsBehaviour) {
        this.bindTo = bindTo;
        this.bindTo.JsUpdate = () => this.onUpdate();
        this.bindTo.JsOnDestroy = () => this.onDestroy();
    }
    onUpdate() {
        //js不支持操作符重载所以Vector3的乘这么用
        let r = CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.up, 0.016 * speed);
        this.bindTo.transform.Rotate(r);
    }
    onDestroy() {
    }
}
var init = function (bindTo: CS.PuertsTest.JsBehaviour) {
    new Rotate(bindTo);
};
export { init };
