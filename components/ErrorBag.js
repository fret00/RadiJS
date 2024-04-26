import TbxComponent from "../component";

export class ErrorBag extends TbxComponent {
    hideTimeout = 7000;

    init() {
        this.btnClose?.on("click", this.hide.bind(this));
    }

    lookupLocaleTranslation(msg) {
        let locale = window.app.translation[window.app.currentLocale];
        if (locale[msg]) {
            return locale[msg];
        }
        if (locale['errors.' + msg]) {
            return locale['errors.' + msg];
        }
        if (locale['error.' + msg]) {
            return locale['error.' + msg];
        }
        return msg;
    }

    show(msg = 'default') {
        // Если текст ошибки пуст, то берем стандартную ошибку
        if (msg == '') {
            msg = 'default';
        }
        
        console.log("Show error", msg);
        if (typeof msg === 'object') {
            let converted = '';
            for (let i in msg) {
                converted += msg[i] + '<br>';
            }
            msg = converted;
        }
        try {
            if (this.find('.' + msg)) {
                msg = this.find('.' + msg).innerHTML;
            } else if (this.find('template[name="' + msg + '"]')) {
                msg = this.find('template[name="' + msg + '"]').innerHTML;
            }
        } catch (e) { }

        msg = this.lookupLocaleTranslation(msg);

        
        if (msg != 'default') {
            this.text = msg;
        }

        if (this.hideTimeout > 0) {
            setTimeout(() => {
                this.hide();
            }, this.hideTimeout);
        }

        super.show();
    }

    hide() {
        this.text = '';
        super.hide();
    }
}
