import components from "./components/index.js";
import TbxComponent from "./component";
import TbxGroupComponent from "./group.js";

let initializedComponents = {};
let initializedComponentsIndex = 0;
let initQueue = [];

class Tbx {
    getComponentClass(element) {
        if (components[element.getAttribute('data-tbx-component')]) {
            return components[element.getAttribute('data-tbx-component')];
        }
        if (element.getAttribute('data-tbx-component') && !components[element.getAttribute('data-tbx-component')]) {
            console.warn("Component class not found", element.getAttribute('data-tbx-component'));
        }

        return TbxComponent;
    }

    registerComponents(list) {
        for (let i in list) {
            components[i] = list[i];
        }
    }

    createComponent(element, parent = null) {
        // console.log(element, parent);
        if (element.getAttribute('tbx-id')) {
            return initializedComponents[element.getAttribute('tbx-id')];
        }

        let name = element.getAttribute('data-tbx-name');
        let componentClass = this.getComponentClass(element);
        let component = new componentClass(element);
        component.uid = 'uid_' + initializedComponentsIndex++;
        initializedComponents[component.uid] = component;
        if (name) {
            // console.log("Init component", component.uid, name, element.getAttribute('data-tbx-init'), element);
        }
        element.setAttribute('tbx-id', component.uid);
        if (parent && name) {
            if (name.endsWith('[]')) {
                name = name.substr(0, name.length - 2);
                if (!parent[name]) {
                    parent[name] = new TbxGroupComponent;
                }
                parent[name].push(component);
            } else {
                parent[name] = component;
            }
        }
        // Children
        if (element.getAttribute('data-tbx-transparent') === null) { // Прозрачный элемент не инициализирует дочерние, чтобы не мешать элементу выше
            this.createComponents(null, component.element, component);
        } else {
            this.createComponents(null, component.element, parent);
        }

        // Если у компонента нет родителя, то передаем компонент из которого он был инициализирован
        if (parent && !component.parent) {
            component.parent = parent;
        }

        // Ищем UI vars
        this.recursiveMap("[bind]", element, (el) => {
            let bindVarName = el.getAttribute('bind');
            // console.log(component, el, name, bindVarName);

            Object.defineProperty(component, bindVarName, {
                get: () => {
                    return el.innerHTML;
                },
                set: (val) => {
                    el.innerHTML = val;
                }
            });

            el.setAttribute('binded', bindVarName)
            el.removeAttribute('bind', true)
        });

        // Attrs bind
        for (var i = 0, atts = element.attributes, n = atts.length; i < n; i++) {

            let att = atts[i];

            let value = att.nodeValue;
            if (att.nodeName.startsWith(':')) {
                // console.log(att, component, att.nodeName.substr(1), value);
                Object.defineProperty(component, att.nodeName.substr(1), {
                    get: () => {
                        return value;
                    },
                    set: (val) => {
                        value = val;
                    }
                });
            }

        }

        // Запуск функции инициализации компонента (кастомизация в каждом компоненте)
        if (component.init) {
            this.queueForInit(component);
        }

        return component;
    }

    createComponents(selector = null, scope = null, parent = null, maxLevel = null) {
        if (!selector) {
            selector = '[data-tbx-name],[data-tbx-component]';
        }
        if (scope === null) {
            scope = document;
        }

        let initialized = [];
        this.recursiveMap(selector, scope, (element) => {
            initialized.push(this.createComponent(element, parent));
        }, maxLevel);

        return initialized;
        
    }  

    /**
     * Инициализирует компоненты которые должны быть инициализированы автоматически
     */
    init() {
        this.createComponents();
        // console.log(initializedComponents);
        this.initQueued();
    }

    queueForInit(component) {
        initQueue.push(component);
    }

    initQueued() {
        initQueue.forEach( element => element.init() );
        initQueue = [];
    }

    recursiveMap(selector, scope, callback, maxLevel = null) {
        // if (scope.children) {
        // console.log(scope.children);
        if (maxLevel === 0) { return; }

        for (let index = 0; index < scope.children.length; index++) {
            let element = scope.children.item(index);

            if (element.matches(selector)) {
                callback(element);
            }
            
            this.recursiveMap(selector, element, callback, (maxLevel)?maxLevel--:null);
        }

    }

    getComponentByElement(element) {
        if (!element.getAttribute('tbx-id')) {
            return;
        }

        return initializedComponents[element.getAttribute('tbx-id')];
    }
}

export default new Tbx;