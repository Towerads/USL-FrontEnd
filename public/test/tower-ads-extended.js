/**
 * TOWER Ads SDK - Extended Version with All Current Networks
 * Version: 2.1.0
 * 
 * Includes adapters for:
 * - Tower (native)
 * - Telegram Ads
 * - Adextra
 * - AdSonar
 * - Nygma
 * - Adexium
 * - Gigapub
 * - Monetag
 * - Yandex
 */

;(function(window) {
    'use strict';

    // ============================================
    // BASE ADAPTER CLASS
    // ============================================
    class AdNetworkAdapter {
        constructor(name, config) {
            this.name = name;
            this.config = config || {};
            this.isReady = false;
            this.priority = config.priority || 0;
            this.loadedAd = null;
        }

        async init() {
            return Promise.resolve();
        }

        async loadAd(placementId) {
            throw new Error('loadAd must be implemented');
        }

        async showAd() {
            throw new Error('showAd must be implemented');
        }

        getName() {
            return this.name;
        }

        isAdReady() {
            return this.isReady && this.loadedAd !== null;
        }

        destroy() {
            this.loadedAd = null;
            this.isReady = false;
        }

        _loadScript(src) {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    return resolve();
                }
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Failed to load: ${src}`));
                document.body.appendChild(script);
            });
        }

        _ensureAdSlot() {
            const SLOT_ID = 'tower-ad-slot';
            let el = document.getElementById(SLOT_ID);
            if (!el) {
                el = document.createElement('div');
                el.id = SLOT_ID;
                el.setAttribute('video-slot', '');
                Object.assign(el.style, {
                    position: 'fixed',
                    inset: '0',
                    zIndex: '2147483647',
                    pointerEvents: 'none'
                });
                document.body.appendChild(el);
            }
            return el;
        }
    }

    // ============================================
    // TOWER NETWORK ADAPTER (Native)
    // ============================================
    class TowerNetworkAdapter extends AdNetworkAdapter {
        constructor(config) {
            super('tower', config);
            this.apiKey = config.apiKey;
            this.placementId = config.placementId;
            this.apiBaseUrl = config.apiUrl || window.location.origin + '/api/tower-ads';
            this.impressionId = null;
            this.isReady = true;
            this.mockMode = config.mockMode !== false; // По умолчанию включен
        }

        async loadAd(placementId) {
            // MOCK MODE - для тестирования без бэкенда
            if (this.mockMode) {
                console.log('[Tower] 🎭 Mock mode enabled - using demo ads');
                return this._loadMockAd(placementId);
            }

            // REAL MODE - запрос к бэкенду
            const response = await fetch(this.apiBaseUrl + '/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    placement_id: placementId || this.placementId,
                    user_data: {
                        device: this._getDeviceInfo(),
                        os: this._getOS()
                    }
                })
            });

            const data = await response.json();
            
            if (data.success && data.ad) {
                this.loadedAd = data.ad;
                this.impressionId = data.impression_id;

                if (data.ad.ad_type === 'rewarded_video') {
                    await this._preloadVideo(data.ad.media_url);
                } else {
                    await this._preloadImage(data.ad.media_url);
                }
                
                return this.loadedAd;
            }
            
            throw new Error(data.error || 'No ad available');
        }

        async _loadMockAd(placementId) {
            // Симуляция задержки сети
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

            this.impressionId = 'mock_' + Date.now();

            // Случайный выбор типа рекламы
            const adType = Math.random() > 0.5 ? 'rewarded_video' : 'interstitial';

            if (adType === 'rewarded_video') {
                // Mock видео реклама
                this.loadedAd = {
                    ad_id: 'mock_video_' + Date.now(),
                    ad_type: 'rewarded_video',
                    media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                    click_url: 'https://tower-ton.com',
                    duration: 30,
                    title: 'Tower Ads Demo Video',
                    description: 'Это демо-реклама для тестирования'
                };
            } else {
                // Mock изображение реклама
                this.loadedAd = {
                    ad_id: 'mock_image_' + Date.now(),
                    ad_type: 'interstitial',
                    media_url: 'https://picsum.photos/800/600?random=' + Date.now(),
                    click_url: 'https://tower-ton.com',
                    title: 'Tower Ads Demo Image',
                    description: 'Это демо-реклама для тестирования'
                };
            }

            console.log('[Tower] 🎭 Mock ad loaded:', this.loadedAd.ad_type);
            return this.loadedAd;
        }

        async showAd() {
            if (!this.loadedAd) throw new Error('No ad loaded');
            
            if (this.loadedAd.ad_type === 'rewarded_video') {
                return this._showRewardedVideo();
            }
            return this._showInterstitial();
        }

        _showRewardedVideo() {
            return new Promise((resolve) => {
                const overlay = this._createOverlay();
                
                // Fullscreen video container
                const videoContainer = document.createElement('div');
                videoContainer.style.cssText = 
                    'position:relative;width:100%;height:100%;' +
                    'display:flex;align-items:center;justify-content:center;' +
                    'background:#000;';
                
                const video = document.createElement('video');
                video.src = this.loadedAd.media_url;
                video.style.cssText = 
                    'width:100%;height:100%;object-fit:contain;';
                video.controls = false;
                video.autoplay = true;
                
                videoContainer.appendChild(video);
                
                // Skip button with circular timer (Telegram style)
                const skipBtn = document.createElement('button');
                skipBtn.style.cssText = 
                    'position:absolute;top:16px;right:16px;' +
                    'width:80px;height:32px;' +
                    'background:rgba(0,0,0,0.6);' +
                    'color:#fff;border:none;' +
                    'border-radius:16px;font-size:13px;font-weight:500;' +
                    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
                    'cursor:not-allowed;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);' +
                    'display:flex;align-items:center;justify-content:center;gap:6px;' +
                    'transition:all 0.2s ease;opacity:0.6;';
                
                // Circular progress (SVG)
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '16');
                svg.setAttribute('height', '16');
                svg.style.cssText = 'transform:rotate(-90deg);';
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', '8');
                circle.setAttribute('cy', '8');
                circle.setAttribute('r', '6');
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', 'rgba(255,255,255,0.3)');
                circle.setAttribute('stroke-width', '2');
                
                const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                progressCircle.setAttribute('cx', '8');
                progressCircle.setAttribute('cy', '8');
                progressCircle.setAttribute('r', '6');
                progressCircle.setAttribute('fill', 'none');
                progressCircle.setAttribute('stroke', '#fff');
                progressCircle.setAttribute('stroke-width', '2');
                progressCircle.setAttribute('stroke-linecap', 'round');
                const circumference = 2 * Math.PI * 6;
                progressCircle.style.strokeDasharray = circumference;
                progressCircle.style.strokeDashoffset = circumference;
                progressCircle.style.transition = 'stroke-dashoffset 0.1s linear';
                
                svg.appendChild(circle);
                svg.appendChild(progressCircle);
                
                const btnText = document.createElement('span');
                btnText.textContent = '5';
                
                skipBtn.appendChild(svg);
                skipBtn.appendChild(btnText);
                
                videoContainer.appendChild(skipBtn);
                overlay.appendChild(videoContainer);
                document.body.appendChild(overlay);
                
                // Progress animation
                let timeLeft = 5;
                const startTime = Date.now();
                const duration = 5000;
                
                const updateProgress = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Update circular progress
                    const offset = circumference * (1 - progress);
                    progressCircle.style.strokeDashoffset = offset;
                    
                    timeLeft = Math.max(0, Math.ceil((duration - elapsed) / 1000));
                    
                    if (timeLeft > 0) {
                        btnText.textContent = timeLeft;
                        requestAnimationFrame(updateProgress);
                    } else {
                        // Enable skip
                        svg.remove();
                        btnText.textContent = 'Skip';
                        skipBtn.disabled = false;
                        skipBtn.style.cursor = 'pointer';
                        skipBtn.style.opacity = '1';
                        skipBtn.style.background = 'rgba(255,255,255,0.9)';
                        skipBtn.style.color = '#000';
                        
                        skipBtn.onmouseover = () => {
                            skipBtn.style.background = '#fff';
                        };
                        skipBtn.onmouseout = () => {
                            skipBtn.style.background = 'rgba(255,255,255,0.9)';
                        };
                    }
                };
                
                requestAnimationFrame(updateProgress);

                const cleanup = () => {
                    this._trackComplete();
                    document.body.removeChild(overlay);
                    resolve({ network: 'tower', completed: true });
                };

                video.addEventListener('ended', cleanup);
                skipBtn.addEventListener('click', () => {
                    if (!skipBtn.disabled) cleanup();
                });
                video.addEventListener('click', () => this._trackClick());
            });
        }

        _showInterstitial() {
            return new Promise((resolve) => {
                const overlay = this._createOverlay();
                
                // Image container with shadow
                const imgContainer = document.createElement('div');
                imgContainer.style.cssText = 
                    'position:relative;max-width:90%;max-height:80%;' +
                    'border-radius:16px;overflow:hidden;' +
                    'box-shadow:0 20px 60px rgba(0,0,0,0.5);' +
                    'animation:slideUp 0.3s ease;cursor:pointer;' +
                    'transition:transform 0.2s ease;';
                
                const img = document.createElement('img');
                img.src = this.loadedAd.media_url;
                img.style.cssText = 'width:100%;height:100%;display:block;';
                
                imgContainer.appendChild(img);
                
                // Hover effect
                imgContainer.onmouseover = () => {
                    imgContainer.style.transform = 'scale(1.02)';
                };
                imgContainer.onmouseout = () => {
                    imgContainer.style.transform = 'scale(1)';
                };

                const closeBtn = this._createCloseButton('Close', false);
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '20px';
                closeBtn.style.right = '20px';
                closeBtn.style.margin = '0';

                overlay.appendChild(imgContainer);
                overlay.appendChild(closeBtn);
                document.body.appendChild(overlay);

                imgContainer.addEventListener('click', () => this._trackClick());
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(overlay);
                    resolve({ network: 'tower', completed: true });
                });
            });
        }

        _createOverlay() {
            const overlay = document.createElement('div');
            overlay.style.cssText = 
                'position:fixed;top:0;left:0;width:100%;height:100%;' +
                'background:rgba(0,0,0,0.96);z-index:999999;' +
                'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
                'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);' +
                'animation:fadeIn 0.2s ease;';
            
            // Add fade-in animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            return overlay;
        }

        _createCloseButton(text, disabled) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.disabled = disabled;
            btn.style.cssText = 
                'margin-top:20px;padding:14px 32px;' +
                'background:' + (disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)') + ';' +
                'color:' + (disabled ? 'rgba(255,255,255,0.5)' : '#1a1a1a') + ';' +
                'border:none;border-radius:12px;font-size:15px;font-weight:600;' +
                'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
                'transition:all 0.2s ease;' +
                'box-shadow:0 4px 12px rgba(0,0,0,0.15);' +
                'animation:slideUp 0.3s ease 0.1s both;' +
                (disabled ? 'cursor:not-allowed;' : 'cursor:pointer;');
            
            if (!disabled) {
                btn.onmouseover = () => {
                    btn.style.background = '#ffffff';
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                };
                btn.onmouseout = () => {
                    btn.style.background = 'rgba(255,255,255,0.95)';
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                };
                btn.onmousedown = () => {
                    btn.style.transform = 'scale(0.96)';
                };
                btn.onmouseup = () => {
                    btn.style.transform = 'translateY(-2px)';
                };
            }
            
            return btn;
        }

        async _trackComplete() {
            if (!this.impressionId) return;
            try {
                await fetch(this.apiBaseUrl + '/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ impression_id: this.impressionId })
                });
            } catch (e) {
                console.error('[Tower] Track complete failed:', e);
            }
        }

        async _trackClick() {
            if (!this.impressionId) return;
            try {
                await fetch(this.apiBaseUrl + '/click', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ impression_id: this.impressionId })
                });
                if (this.loadedAd.click_url) {
                    window.open(this.loadedAd.click_url, '_blank');
                }
            } catch (e) {
                console.error('[Tower] Track click failed:', e);
            }
        }

        _preloadVideo(url) {
            return new Promise((resolve, reject) => {
                const video = document.createElement('video');
                video.src = url;
                video.preload = 'auto';
                video.addEventListener('loadeddata', resolve);
                video.addEventListener('error', reject);
            });
        }

        _preloadImage(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = url;
                img.onload = resolve;
                img.onerror = reject;
            });
        }

        _getDeviceInfo() {
            const ua = navigator.userAgent;
            if (/mobile/i.test(ua)) return 'mobile';
            if (/tablet/i.test(ua)) return 'tablet';
            return 'desktop';
        }

        _getOS() {
            const ua = navigator.userAgent;
            if (/windows/i.test(ua)) return 'Windows';
            if (/mac/i.test(ua)) return 'MacOS';
            if (/linux/i.test(ua)) return 'Linux';
            if (/android/i.test(ua)) return 'Android';
            if (/ios|iphone|ipad/i.test(ua)) return 'iOS';
            return 'Unknown';
        }
    }

    // ============================================
    // ADEXTRA ADAPTER
    // ============================================
    class AdextraAdapter extends AdNetworkAdapter {
        constructor(config) {
            super('adextra', config);
            this.scriptUrl = 'https://ad.adextra.click/adextra.js';
        }

        async init() {
            await this._loadScript(this.scriptUrl);
            if (typeof window.p_adextra === 'function') {
                this.isReady = true;
            } else {
                throw new Error('Adextra SDK not loaded');
            }
        }

        async loadAd(placementId) {
            this.loadedAd = { ready: true };
            return this.loadedAd;
        }

        async showAd() {
            return new Promise((resolve, reject) => {
                window.p_adextra(
                    () => resolve({ network: 'adextra', completed: true }),
                    (e) => reject(new Error('Adextra failed: ' + e))
                );
            });
        }
    }

    // ============================================
    // ADSONAR ADAPTER
    // ============================================
    class AdSonarAdapter extends AdNetworkAdapter {
        constructor(config) {
            super('adsonar', config);
            this.scriptUrl = 'https://ad.adsonar.click/adsonar.js';
        }

        async init() {
            await this._loadScript(this.scriptUrl);
            if (window.Sonar && window.Sonar.show) {
                this.isReady = true;
            } else {
                throw new Error('AdSonar SDK not loaded');
            }
        }

        async loadAd(placementId) {
            this.loadedAd = { ready: true };
            return this.loadedAd;
        }

        async showAd() {
            const slot = this._ensureAdSlot();
            const result = await window.Sonar.show({ slotId: slot.id });
            
            if (result.status === 'ok') {
                return { network: 'adsonar', completed: true };
            }
            throw new Error('AdSonar: ' + (result.message || 'no-fill'));
        }
    }

    // ============================================
    // NYGMA ADAPTER
    // ============================================
    class NygmaAdapter extends AdNetworkAdapter {
        constructor(config) {
            super('nygma', config);
            this.blockId = config.blockId || 's1av3y3phfqnuwnihtphpst9';
            this.scriptUrl = 'https://static.nigma.smbadmin.tech/sdk/index.min.js';
            this.controller = null;
        }

        async init() {
            await this._loadScript(this.scriptUrl);
            
            if (!window.NigmaSDK) {
                throw new Error('Nygma SDK not loaded');
            }

            this.controller = window.NigmaSDK.init({ blockId: this.blockId });
            
            // Wait for controller to be ready
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Nygma init timeout')), 5000);
                const checkReady = setInterval(() => {
                    if (this.controller && this.controller.getBlockState) {
                        clearInterval(checkReady);
                        clearTimeout(timeout);
                        resolve();
                    }
                }, 100);
            });

            this.isReady = true;
        }

        async loadAd(placementId) {
            if (!this.controller) throw new Error('Nygma not initialized');
            
            const state = this.controller.getBlockState();
            if (state !== 1) { // 1 = RENDERED
                throw new Error('Nygma block not ready: ' + state);
            }

            this.loadedAd = { ready: true };
            return this.loadedAd;
        }

        async showAd() {
            if (!this.controller) throw new Error('Nygma not initialized');
            
            const result = await this.controller.showAd();
            
            if (result.status === 'ok') {
                return { network: 'nygma', completed: true };
            }
            throw new Error('Nygma show failed: ' + result.message);
        }

        destroy() {
            if (this.controller && this.controller.destroy) {
                this.controller.destroy();
            }
            super.destroy();
        }
    }

    // ============================================
    // ADEXIUM ADAPTER
    // ============================================
    class AdexiumAdapter extends AdNetworkAdapter {
        constructor(config) {
            super('adexium', config);
            this.scriptUrl = 'https://ad.adexium.click/adexium.js';
            this.widget = null;
        }

        async init() {
            await this._loadScript(this.scriptUrl);
            if (!window.AdexiumWidget) {
                throw new Error('Adexium SDK not loaded');
            }
            this.isReady = true;
        }

        async loadAd(placementId) {
            const slot = this._ensureAdSlot();
            this.widget = new window.AdexiumWidget({ slotId: slot.id });
            this.loadedAd = { ready: true };
            return this.loadedAd;
        }

        async showAd() {
            if (!this.widget) throw new Error('Adexium widget not created');
            
            await this.widget.show();
            return { network: 'adexium', completed: true };
        }

        destroy() {
            if (this.widget && this.widget.destroy) {
                this.widget.destroy();
            }
            super.destroy();
        }
    }

    // ============================================
    // GIGAPUB ADAPTER
    // ============================================
    class GigapubAdapter extends AdNetworkAdapter {
        constructor(config) {
            super('gigapub', config);
        }

        async init() {
            if (typeof window.showGiga === 'function') {
                this.isReady = true;
            } else {
                throw new Error('Gigapub not available');
            }
        }

        async loadAd(placementId) {
            this.loadedAd = { ready: true };
            return this.loadedAd;
        }

        async showAd() {
            await window.showGiga();
            return { network: 'gigapub', completed: true };
        }
    }

    // ============================================
    // TELEGRAM ADS ADAPTER
    // ============================================
    class TelegramAdsAdapter extends AdNetworkAdapter {
        constructor(config) {
            super('telegram', config);
            this.blockId = config.blockId;
            this.controller = null;
        }

        async init() {
            if (!window.TelegramAdsController) {
                throw new Error('TelegramAdsController not found');
            }

            this.controller = new window.TelegramAdsController();
            await this.controller.initialize({ blockId: this.blockId });
            this.isReady = true;
        }

        async loadAd(placementId) {
            this.loadedAd = { ready: true };
            return this.loadedAd;
        }

        async showAd() {
            await this.controller.triggerInterstitialVideo();
            return { network: 'telegram', completed: true };
        }
    }

    // ============================================
    // MONETAG ADAPTER
    // ============================================
    class MonetagAdapter extends AdNetworkAdapter {
        constructor(config) {
            super('monetag', config);
            this.zone = config.zone;
            this.sdk = config.sdk;
        }

        async init() {
            if (!window[this.sdk]) {
                throw new Error('Monetag SDK not found: ' + this.sdk);
            }
            this.isReady = true;
        }

        async loadAd(placementId) {
            this.loadedAd = { ready: true };
            return this.loadedAd;
        }

        async showAd() {
            await window[this.sdk]();
            return { network: 'monetag', completed: true };
        }
    }

    // ============================================
    // YANDEX ADAPTER
    // ============================================
    class YandexAdapter extends AdNetworkAdapter {
        constructor(config) {
            super('yandex', config);
            this.blockId = config.blockId;
        }

        async init() {
            if (!window.Ya || !window.Ya.Context || !window.Ya.Context.AdvManager) {
                throw new Error('Yandex Ads not found');
            }
            this.isReady = true;
        }

        async loadAd(placementId) {
            this.loadedAd = { ready: true };
            return this.loadedAd;
        }

        async showAd() {
            return new Promise((resolve, reject) => {
                const platform = this._getPlatform();
                const renderParams = {
                    blockId: this.blockId,
                    type: 'rewarded',
                    platform: platform,
                    onRewarded: (reward) => {
                        resolve({ network: 'yandex', completed: true, reward });
                    },
                    onError: (error) => {
                        reject(new Error('Yandex error: ' + JSON.stringify(error)));
                    }
                };

                window.yaContextCb = window.yaContextCb || [];
                window.yaContextCb.push(() => {
                    window.Ya.Context.AdvManager.render(renderParams, () => {
                        reject(new Error('Yandex fallback'));
                    });
                });
            });
        }

        _getPlatform() {
            try {
                return window.Ya.Context.AdvManager.getPlatform();
            } catch (e) {
                return /mobile/i.test(navigator.userAgent) ? 'touch' : 'desktop';
            }
        }
    }

    // ============================================
    // MEDIATION MANAGER
    // ============================================
    class MediationManager {
        constructor(config) {
            this.config = config || {};
            this.networks = [];
            this.waterfall = config.waterfall || ['tower'];
            this.currentNetwork = null;
            this.currentAd = null;
            this.analytics = {
                attempts: [],
                lastShow: null
            };
        }

        registerNetwork(adapter) {
            this.networks.push(adapter);
            console.log('[Mediation] Registered:', adapter.getName());
        }

        async initNetworks() {
            const results = await Promise.allSettled(
                this.networks.map(async (network) => {
                    try {
                        await network.init();
                        console.log('[Mediation] ✅ Initialized:', network.getName());
                    } catch (error) {
                        console.warn('[Mediation] ❌ Failed:', network.getName(), error.message);
                        throw error;
                    }
                })
            );
            
            return results;
        }

        async loadAd(placementId) {
            this.analytics.attempts = [];
            const startTime = Date.now();

            for (const networkName of this.waterfall) {
                const network = this.networks.find(n => n.getName() === networkName);

                if (!network) {
                    console.warn('[Mediation] Network not found:', networkName);
                    continue;
                }

                if (!network.isReady) {
                    console.warn('[Mediation] Network not ready:', networkName);
                    this.analytics.attempts.push({
                        network: networkName,
                        status: 'not_ready',
                        time: 0
                    });
                    continue;
                }

                try {
                    const attemptStart = Date.now();
                    console.log('[Mediation] 🔄 Trying:', networkName);

                    const ad = await network.loadAd(placementId);

                    if (ad) {
                        this.currentNetwork = network;
                        this.currentAd = ad;
                        const loadTime = Date.now() - attemptStart;

                        this.analytics.attempts.push({
                            network: networkName,
                            status: 'success',
                            time: loadTime
                        });

                        console.log('[Mediation] ✅ Loaded from:', networkName, `(${loadTime}ms)`);
                        return { network: networkName, ad: ad };
                    }
                } catch (error) {
                    const loadTime = Date.now() - attemptStart;
                    console.warn('[Mediation] ❌ Failed:', networkName, error.message);

                    this.analytics.attempts.push({
                        network: networkName,
                        status: 'error',
                        error: error.message,
                        time: loadTime
                    });
                }
            }

            const totalTime = Date.now() - startTime;
            console.error('[Mediation] ❌ No ads available. Total time:', totalTime + 'ms');
            throw new Error('No ads available from any network');
        }

        async showAd() {
            if (!this.currentNetwork || !this.currentAd) {
                throw new Error('No ad loaded. Call loadAd() first.');
            }

            const showStart = Date.now();
            const networkName = this.currentNetwork.getName();

            try {
                console.log('[Mediation] 📺 Showing:', networkName);
                const result = await this.currentNetwork.showAd();

                const showTime = Date.now() - showStart;
                this.analytics.lastShow = {
                    network: networkName,
                    status: 'success',
                    time: showTime,
                    timestamp: Date.now()
                };

                console.log('[Mediation] ✅ Shown:', networkName, `(${showTime}ms)`);
                return result;
            } catch (error) {
                const showTime = Date.now() - showStart;
                this.analytics.lastShow = {
                    network: networkName,
                    status: 'error',
                    error: error.message,
                    time: showTime,
                    timestamp: Date.now()
                };

                console.error('[Mediation] ❌ Show failed:', networkName, error.message);
                throw error;
            }
        }

        isReady() {
            return this.currentNetwork !== null && this.currentAd !== null;
        }

        getCurrentNetwork() {
            return this.currentNetwork ? this.currentNetwork.getName() : null;
        }

        getAnalytics() {
            return this.analytics;
        }

        destroy() {
            this.networks.forEach(network => network.destroy());
            this.currentNetwork = null;
            this.currentAd = null;
        }
    }

    // ============================================
    // TOWER ADS MAIN CLASS
    // ============================================
    function TowerAds(config) {
        this.config = config || {};
        this.apiKey = config.apiKey;
        this.placementId = config.placementId;
        this.apiBaseUrl = config.apiUrl || window.location.origin + '/api/tower-ads';
        this.useMediationMode = config.mediation && config.mediation.enabled;

        // Callbacks
        this.onAdLoaded = config.onAdLoaded || (() => {});
        this.onAdFailedToLoad = config.onAdFailedToLoad || (() => {});
        this.onAdShown = config.onAdShown || (() => {});
        this.onAdClosed = config.onAdClosed || (() => {});
        this.onAdClicked = config.onAdClicked || (() => {});
        this.onRewardEarned = config.onRewardEarned || (() => {});

        if (!this.apiKey || !this.placementId) {
            console.error('[TowerAds] apiKey and placementId are required');
        }

        if (this.useMediationMode) {
            this._initMediation(config);
        }
    }

    TowerAds.prototype._initMediation = function(config) {
        const mediationConfig = config.mediation || {};
        
        this.mediation = new MediationManager({
            waterfall: mediationConfig.waterfall || ['tower']
        });

        // Register Tower network
        const towerAdapter = new TowerNetworkAdapter({
            apiKey: this.apiKey,
            placementId: this.placementId,
            apiUrl: this.apiBaseUrl,
            mockMode: config.mockMode !== false // Передаем mockMode
        });
        this.mediation.registerNetwork(towerAdapter);

        // Register external networks
        const networks = mediationConfig.networks || {};

        if (networks.adextra) {
            this.mediation.registerNetwork(new AdextraAdapter(networks.adextra));
        }

        if (networks.adsonar) {
            this.mediation.registerNetwork(new AdSonarAdapter(networks.adsonar));
        }

        if (networks.nygma) {
            this.mediation.registerNetwork(new NygmaAdapter(networks.nygma));
        }

        if (networks.adexium) {
            this.mediation.registerNetwork(new AdexiumAdapter(networks.adexium));
        }

        if (networks.gigapub) {
            this.mediation.registerNetwork(new GigapubAdapter(networks.gigapub));
        }

        if (networks.telegram) {
            this.mediation.registerNetwork(new TelegramAdsAdapter(networks.telegram));
        }

        if (networks.monetag) {
            this.mediation.registerNetwork(new MonetagAdapter(networks.monetag));
        }

        if (networks.yandex) {
            this.mediation.registerNetwork(new YandexAdapter(networks.yandex));
        }

        // Initialize all networks
        this.mediation.initNetworks().catch((error) => {
            console.warn('[TowerAds] Mediation init warning:', error);
        });
    };

    TowerAds.prototype.loadAd = function() {
        if (this.useMediationMode && this.mediation) {
            return this.mediation.loadAd(this.placementId)
                .then((result) => {
                    this.onAdLoaded(result.network);
                    return result;
                })
                .catch((error) => {
                    this.onAdFailedToLoad(error);
                    throw error;
                });
        }

        // Legacy mode - Tower only
        const towerAdapter = new TowerNetworkAdapter({
            apiKey: this.apiKey,
            placementId: this.placementId,
            apiUrl: this.apiBaseUrl
        });

        return towerAdapter.loadAd(this.placementId)
            .then((ad) => {
                this.currentAd = ad;
                this.onAdLoaded('tower');
            })
            .catch((error) => {
                this.onAdFailedToLoad(error);
                throw error;
            });
    };

    TowerAds.prototype.showAd = function() {
        if (this.useMediationMode && this.mediation) {
            this.onAdShown();
            
            return this.mediation.showAd()
                .then((result) => {
                    this.onAdClosed();
                    
                    if (result.completed) {
                        this.onRewardEarned(result.reward || { amount: 100, item: 'coins' });
                    }
                    
                    return result;
                })
                .catch((error) => {
                    console.error('[TowerAds] Show failed:', error);
                    throw error;
                });
        }

        return Promise.reject(new Error('No ad loaded'));
    };

    TowerAds.prototype.isReady = function() {
        if (this.useMediationMode && this.mediation) {
            return this.mediation.isReady();
        }
        return false;
    };

    TowerAds.prototype.getCurrentNetwork = function() {
        if (this.useMediationMode && this.mediation) {
            return this.mediation.getCurrentNetwork();
        }
        return 'tower';
    };

    TowerAds.prototype.getAnalytics = function() {
        if (this.useMediationMode && this.mediation) {
            return this.mediation.getAnalytics();
        }
        return null;
    };

    TowerAds.prototype.destroy = function() {
        if (this.useMediationMode && this.mediation) {
            this.mediation.destroy();
        }
    };

    // Export to global scope
    window.TowerAds = TowerAds;

    // Export adapters for advanced usage
    window.TowerAds.Adapters = {
        Tower: TowerNetworkAdapter,
        Adextra: AdextraAdapter,
        AdSonar: AdSonarAdapter,
        Nygma: NygmaAdapter,
        Adexium: AdexiumAdapter,
        Gigapub: GigapubAdapter,
        Telegram: TelegramAdsAdapter,
        Monetag: MonetagAdapter,
        Yandex: YandexAdapter
    };

    console.log('[TowerAds] SDK v2.1.0 loaded');

})(window);
