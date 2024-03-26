class TbxGroupComponent extends Array {
    
    callMethod (method, args) {
        for (let i in this) {
            this[i][method](...args);
        }
    }

    addClass(name) {
        this.callMethod('addClass', arguments);
        return this;
    }

    removeClass(name) {
        this.callMethod('removeClass', arguments);
        return this;
    }

    css(prop, value) {
        this.callMethod('css', arguments);
        return this;
    }

    html(value) {
        this.callMethod('html', arguments);
    }

    remove() {
        this.callMethod('remove', arguments);
    }

    attr(name, value) {
        this.callMethod('attr', arguments);
    }

    text(value) {
        this.callMethod('text', arguments);
    }

    // on(eventName, callback) {
    //     this.element.addEventListener(eventName, callback);
    // }

    show() {
        this.callMethod('show', arguments);
    }

    hide() {
        this.callMethod('hide', arguments);
    }

    disable() {
        this.callMethod('disable', arguments);
    }

    enable() {
        this.callMethod('enable', arguments);
    }
}


export default TbxGroupComponent;

