export class TouchUI {
    constructor() {
        this.setupTouchEvents();
        this.setupDropzone();
        this.progress = 0;
    }

    setupTouchEvents() {
        // Botões touch responsivos
        document.addEventListener('touchstart', (e) => {
            e.target.style.transform = 'scale(0.95)';
        });

        document.addEventListener('touchend', (e) => {
            e.target.style.transform = 'scale(1)';
        });

        // Previne zoom no double-tap
        let lastTouch = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouch <= 300) e.preventDefault();
            lastTouch = now;
        });
    }

    setupDropzone() {
        const dropzone = document.getElementById('dropzone');

        // Drag & Drop touch
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            dropzone.addEventListener(event, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(event => {
            dropzone.addEventListener(event, () => {
                dropzone.classList.add('dropzone-active');
            });
        });

        ['dragleave', 'drop'].forEach(event => {
            dropzone.addEventListener(event, () => {
                dropzone.classList.remove('dropzone-active');
            });
        });
    }

    updateProgress(percent, status) {
        const progress = document.getElementById('progress');
        const bar = progress.querySelector('progress');
        const text = document.getElementById('status');

        progress.style.display = 'block';
        bar.value = percent;
        text.textContent = `${status}... ${percent}%`;

        if (percent === 100) {
            setTimeout(() => progress.style.display = 'none', 2000);
        }
    }

    showNotification(message) {
        // Notificação nativa
        if ('Notification' in window) {
            Notification.requestPermission().then(() => {
                new Notification('CryptoShield', { body: message });
            });
        } else {
            alert(message);
        }
    }

    vibrate(duration = 200) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }

    handleFileSelect(file) {
        this.vibrate(100);
        this.updateProgress(0, 'Pronto para criptografar ' + file.name);
    }

    hideKeyboard() {
        // Esconde teclado virtual
        document.activeElement?.blur();
    }
}
