import TbxComponent from "../component";

export class Button extends TbxComponent {
    init() {
        this.spinner = this.element.querySelector('.spinner-border');
    }

    disable() {
        this.element.setAttribute('disabled', true);
        if (this.spinner) {
            this.spinner.classList.remove('d-none');
        }
    }

    enable() {
        this.element.removeAttribute('disabled');
        if (this.spinner) {
            this.spinner.classList.add('d-none');
        }
    }
}
