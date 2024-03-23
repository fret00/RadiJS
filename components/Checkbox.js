import TbxComponent from "../component";

export class Checkbox extends TbxComponent {
    isChecked() {
        return this.element.checked;
    }

    shake(interval, distance, times) {
        interval = typeof interval == "undefined" ? 15 : interval;
        distance = typeof distance == "undefined" ? 5 : distance;
        times = typeof times == "undefined" ? 5 : times;
        var target = this.element;
        target.style.position = 'relative';
        var iter = 0
        let intervalHandler = setInterval(() => {
            target.style.left = ((iter % 2 == 0 ? distance : distance * -1)) + 'px';
            if (iter > times) {
                target.style.left = 0;
                clearInterval(intervalHandler);
            }
            iter++;

        }, interval);
        
    }


}
