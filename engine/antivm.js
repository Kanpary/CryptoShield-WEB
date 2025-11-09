class AntiAnalysis {
    constructor() {
        this.indicators = [
            /HeadlessChrome/i,
            /Chrome\s+\d/i,
            /phantomjs/i,
            /selenium/i
        ];
    }

    detectVM() {
        return (
            this.checkUserAgent() ||
            this.checkWebGL() ||
            this.checkPlugins() ||
            this.checkTiming()
        );
    }

    checkUserAgent() {
        const ua = navigator.userAgent;
        return this.indicators.some(i => i.test(ua));
    }

    checkWebGL() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        const debugInfo = gl.getParameter(gl.DEBITUG_RENDERER_INFO);
        return debugInfo.includes('Google');
    }

    checkPlugins() {
        // VMs têm menos plugins
        return navigator.plugins.length < 5;
    }

    checkTiming() {
        const start = performance.now();
        crypto.subtle.digest('SHA-256', new Uint8Array(1000000));
        const duration = performance.now() - start;
        
        // VMs têm latency maior
        return duration > 500;
    }
}
