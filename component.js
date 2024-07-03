import sanitizeHtml from 'sanitize-html';
// import tbx from '.';

export default class TbxComponent {
    constructor(element, tbx = null) {
        if (!element) {
            console.error("Element cannot be null");
        }
        this.element = element;

        this.tbx = tbx;
    }

    requireComponents(reqs, throwError = true) {
        return this.includeComponents(reqs, true, throwError);
    }

    includeComponents(reqs, mandatory = false, throwError = false) {
        for (const name in reqs) {
            let selector = reqs[name];
            let scope = null;
            if (selector.startsWith('document@')) {
                scope = document;
                selector = selector.replace('document@', '');
            } else {
                scope = this.element;
            }
            let initializedComponents = this.tbx.createComponents(selector, scope, this, 1);
            if (initializedComponents.length > 1) {
                console.log("Found more than 1 component for selector", selector);
            }
            // console.log(this, initializedComponents);
            this[name] = initializedComponents.shift();

            if (mandatory && !this[name]) {
                if (throwError) {
                    console.error("Not all required components found", name, selector);
                }
                return false;
            }
        }
        return true;
    }

    el() {
        return this.element;
    }

    addClass(name) {
        this.element.classList.add(name);
        return this;
    }

    removeClass(name) {
        this.element.classList.remove(name);
        return this;
    }

    hasClass(name) {
        return this.element.classList.contains(name);
    }

    css(prop, value) {
        // console.log(prop, value);
        this.element.style.setProperty(prop, value);
    }

    html(value = null) {
        if (value) {
            this.element.innerHTML = sanitizeHtml(value);
            return this;
        }
        return this.element.innerHTML;
    }

    remove() {
        this.element.remove();
        return this;
    }

    attr(name, value) {
        if (value === undefined) {
            return this.element.getAttribute(name);
        } else {
            this.element.setAttribute(name, value);
            return this;
        }
    }

    data(name, value) {
        name = 'data-' + name;
        if (value === undefined) {
            return this.element.getAttribute(name);
        } else {
            this.element.setAttribute(name, value);
            return this;
        }
    }

    dataJson(name, value) {
        name = 'data-' + name;
        if (value === undefined) {
            return JSON.parse(this.element.getAttribute(name));
        } else {
            this.element.setAttribute(name, JSON.stringify(value));
            return this;
        }
    }

    prop(name) {
        return this.element[name];
    }

    text(value) {
        if (value === undefined) {
            return this.element.innerText;
        } else {
            this.element.innerText = value;
            return this;
        }
    }

    find(selector) {
        return this.element.querySelector(selector);
    }

    findAll(selector) {
        return this.element.querySelectorAll(selector);
    }

    on(eventName, callback) {
        this.element.addEventListener(eventName, callback);
    }

    show() {
        this.removeClass('d-none');
    }

    hide() {
        this.addClass('d-none')
    }

    disable() {
        console.log(this.element, this.element.tagName);
        if (this.element.tagName == 'INPUT') {
            this.attr('disabled', true);
        }
    }

    enable() {
        if (this.element.tagName == 'INPUT') {
            this.element.removeAttribute('disabled');
        }
    }
}
