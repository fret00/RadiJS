import TbxComponent from "../component";
export class Copy extends TbxComponent {
    init() {
        this.on('click', this.copyToClipboard.bind(this));
    }

    copyToClipboard() {
        let target = document.querySelector(this.attr('target'));
        
        console.log(target.innerText);

        if (navigator.clipboard) {
            navigator.clipboard.writeText(target.innerText);
        } else {
            console.error("Clipboard not available");
        }

        if (this.attr('animation-class')) {
            target.classList.add(this.attr('animation-class'));

            setTimeout(() => {
                target.classList.remove(this.attr('animation-class'));
            }, 1500);
        }

        this.addClass('btn-outline-success');
        this.removeClass('btn-outline-secondary');
        setTimeout(() => {
            this.removeClass('btn-outline-success');
            this.addClass('btn-outline-secondary');
        }, 2500);
    }
}

