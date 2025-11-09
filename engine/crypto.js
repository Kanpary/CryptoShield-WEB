class SecureCore {
    constructor() {
        this.algo = 'AES-GCM';
        this.keyLength = 256;
        this.chunkSize = 64 * 1024; // 64KB chunks
    }

    // Gera chave AES-256 a partir de senha
    async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );
        
        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 200000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: this.algo, length: this.keyLength },
            false,
            ["encrypt", "decrypt"]
        );
    }

    // Criptografa arquivo grande em chunks
    async encryptFile(file) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const password = await this.generatePassword();

        const key = await this.deriveKey(password, salt);

        let reader = file.stream().getReader();
        let writer = new WritableStream();
        let chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Padding randômico
            const padded = this.addJunk(value);
            const encrypted = await crypto.subtle.encrypt(
                { name: this.algo, iv },
                key,
                padded
            );

            chunks.push(new Uint8Array(encrypted));
        }

        // Concatena salt + iv + payload
        const blob = new Blob([
            salt,
            iv,
            ...chunks
        ]);

        return { blob, password: btoa(String.fromCharCode(...new Uint8Array(password))) };
    }

    // Adiciona junk data pra confundir scan de assinatura
    addJunk(data) {
        const pre = crypto.getRandomValues(new Uint8Array(32));
        const pos = crypto.getRandomValues(new Uint8Array(32));
        return this.concatBytes(pre, data, pos);
    }

    concatBytes(...arrays) {
        let total = arrays.reduce((acc, arr) => acc + arr.length, 0);
        let result = new Uint8Array(total);
        let offset = 0;
        for (let arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    async generatePassword() {
        return crypto.getRandomValues(new Uint8Array(32));
    }
}
