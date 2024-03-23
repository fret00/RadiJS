import TbxComponent from "../component";

let currentModal;

export class Modal extends TbxComponent {
    init() {
        this.bsModal = new bootstrap.Modal(this.element);
        // console.log(this.bsModal);
        this.find('.btn-close').addEventListener('click', () => { this.onCloseBtnClick() });
    }

    onCloseBtnClick() {

    }

    show() {
        if (currentModal) {
            currentModal.hide();
        }
        console.log(this);
        this.bsModal.show();
        currentModal = this;
    }

    hide() {
        this.bsModal.hide();
        if (currentModal == this) {
            currentModal = null;
        }
    }   
}

export function isAnyModalOpen () {
    return !!currentModal;
}
