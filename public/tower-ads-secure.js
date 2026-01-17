/**
 * TOWER Ads SDK v3.0 - Secure Client
 * Version: 3.0.0
 * 
 * ⚠️ ВАЖНО: Вся бизнес-логика на сервере!
 * SDK только показывает рекламу и отправляет события.
 * 
 * Базовое использование:
 * <script src="https://cdn.usl.app/sdk/v3/tower-ads.js"></script>
 * <script>
 *   const ads = new TowerAds({
 *     appId: 'app_xxxxx',  // Публичный ID приложения
 *     onAdLoaded: (network) => console.log('Loaded from:', network),
 *     onRewardEarned: (reward) => giveUserReward(reward)
 *   });
 *   
 *   // Показать рекламу
 *   ads.show('main_banner');
 * </script>
 */

;(function(window) {
    'use strict';

    // ============================================
    // КОНФИГУРАЦИЯ
    // ============================================
    const CONFIG = {
        API_URL: 'https://api.usl.app/v1',
        VERSION: '3.0.0',
        TIMEOUT: 10000, // 10 секунд
    };

    // ============================================
    // TOWER ADS SDK
    // ============================================
    class TowerAds {
        constructor(config) {
            if (!config.appId) {
                throw new Error('TowerAds: appId is required');
            }

            this.appId = config.appId;
            this.apiUrl = config.apiUrl || CONFIG.API_URL;
            this.sessionId = this._generateSessionId();
            this.loadedAd = null;

            // Callbacks
            this.onAdLoaded = config.onAdLoaded || (() => {});
            this.onAdShown = config.onAdShown || (() => {});
            this.onAdClosed = config.onAdClosed || (() => {});
            this.onAdClicked = config.onAdClicked || (() => {});
            this.onRewardEarned = config.onRewardEarned || (() => {});
            this.onError = config.onError || ((error) => console.error('TowerAds Error:', error));

            this._init();
        }

        _init() {
            console.log(`[TowerAds v${CONFIG.VERSION}] Initialized for app: ${this.appId}`);
        }

        /**
         * Загрузить рекламу
         * @param {string} placement - Название места размещения
         * @returns {Promise}
         */
        async load(placement) {
            try {
                const response = await this._fetchWithTimeout(`${this.apiUrl}/ads/request`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        app_id: this.appId,
                        placement: placement,
                        session_id: this.sessionId,
                        device_info: this._getDeviceInfo(),
                        page_url: window.location.href,
                    })
                });

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error || 'Failed to load ad');
                }

                // Сервер вернул:
                // - network: какую сеть выбрал
                // - ad_data: данные креатива
                // - impression_token: одноразовый токен для подтверждения
                this.loadedAd = {
                    network: data.network,
                    adData: data.ad_data,
                    impressionToken: data.impression_token,
                    placement: placement,
                };

                // Предзагрузка медиа
                if (data.ad_data.media_url) {
                    await this._preloadMedia(data.ad_data.media_url, data.ad_data.type);
                }

                this.onAdLoaded(data.network);
                return true;

            } catch (error) {
                this.onError(error.message);
                return false;
            }
        }

        /**
         * Показать загруженную рекламу
         * @returns {Promise}
         */
        async show(placement) {
            // Если реклама не загружена, загружаем
            if (!this.loadedAd || this.loadedAd.placement !== placement) {
                const loaded = await this.load(placement);
                if (!loaded) {
                    throw new Error('Failed to load ad');
                }
            }

            if (!this.loadedAd) {
                throw new Error('No ad loaded');
            }

            try {
                // Показываем рекламу (только UI)
                const result = await this._renderAd(this.loadedAd.adData);

                // Подтверждаем показ на сервере
                await this._confirmImpression(this.loadedAd.impressionToken, result);

                this.onAdShown(this.loadedAd.network);

                // Очищаем загруженную рекламу
                this.loadedAd = null;

                return result;

            } catch (error) {
                this.onError(error.message);
                throw error;
            }
        }

        /**
         * Отрисовка рекламы (только UI)
         */
        async _renderAd(adData) {
            return new Promise((resolve, reject) => {
                const type = adData.type;

                if (type === 'rewarded_video') {
                    this._showRewardedVideo(adData, resolve, reject);
                } else if (type === 'interstitial') {
                    this._showInterstitial(adData, resolve, reject);
                } else if (type === 'banner') {
                    this._showBanner(adData, resolve, reject);
                } else {
                    reject(new Error('Unknown ad type: ' + type));
                }
            });
        }

        /**
         * Rewarded Video
         */
        _showRewardedVideo(adData, resolve, reject) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 999999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;

            const video = document.createElement('video');
            video.src = adData.media_url;
            video.style.cssText = `
                max-width: 90%;
                max-height: 80%;
                border-radius: 8px;
            `;
            video.controls = false;
            video.autoplay = true;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Пропустить (5)';
            closeBtn.style.cssText = `
                margin-top: 20px;
                padding: 12px 24px;
                background: #666;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: not-allowed;
                font-size: 16px;
                opacity: 0.5;
            `;
            closeBtn.disabled = true;

            overlay.appendChild(video);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);

            let countdown = 5;
            let completed = false;

            const timer = setInterval(() => {
                countdown--;
                closeBtn.textContent = `Пропустить (${countdown})`;
                if (countdown <= 0) {
                    clearInterval(timer);
                    closeBtn.textContent = 'Закрыть';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.style.background = '#10b981';
                    closeBtn.style.opacity = '1';
                    closeBtn.disabled = false;
                }
            }, 1000);

            video.addEventListener('ended', () => {
                completed = true;
                clearInterval(timer);
                document.body.removeChild(overlay);
                this.onAdClosed();
                if (adData.reward) {
                    this.onRewardEarned(adData.reward);
                }
                resolve({ completed: true, clicked: false });
            });

            closeBtn.addEventListener('click', () => {
                if (!closeBtn.disabled) {
                    clearInterval(timer);
                    document.body.removeChild(overlay);
                    this.onAdClosed();
                    if (completed && adData.reward) {
                        this.onRewardEarned(adData.reward);
                    }
                    resolve({ completed, clicked: false });
                }
            });

            video.addEventListener('click', () => {
                if (adData.click_url) {
                    this.onAdClicked();
                    window.open(adData.click_url, '_blank');
                }
            });
        }

        /**
         * Interstitial
         */
        _showInterstitial(adData, resolve, reject) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            const img = document.createElement('img');
            img.src = adData.media_url;
            img.style.cssText = `
                max-width: 90%;
                max-height: 80%;
                border-radius: 8px;
                cursor: pointer;
            `;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
            `;

            overlay.appendChild(img);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);

            let clicked = false;

            img.addEventListener('click', () => {
                if (adData.click_url) {
                    clicked = true;
                    this.onAdClicked();
                    window.open(adData.click_url, '_blank');
                }
            });

            closeBtn.addEventListener('click', () => {
                document.body.removeChild(overlay);
                this.onAdClosed();
                resolve({ completed: true, clicked });
            });
        }

        /**
         * Banner
         */
        _showBanner(adData, resolve, reject) {
            // Баннер можно встроить в указанный контейнер
            const containerId = adData.container_id || 'tower-ad-banner';
            const container = document.getElementById(containerId);

            if (!container) {
                reject(new Error('Banner container not found: ' + containerId));
                return;
            }

            const banner = document.createElement('div');
            banner.style.cssText = `
                width: 100%;
                text-align: center;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 8px;
            `;

            const img = document.createElement('img');
            img.src = adData.media_url;
            img.style.cssText = `
                max-width: 100%;
                cursor: pointer;
                border-radius: 4px;
            `;

            banner.appendChild(img);
            container.appendChild(banner);

            let clicked = false;

            img.addEventListener('click', () => {
                if (adData.click_url) {
                    clicked = true;
                    this.onAdClicked();
                    window.open(adData.click_url, '_blank');
                }
            });

            this.onAdClosed();
            resolve({ completed: true, clicked });
        }

        /**
         * Подтверждение показа на сервере
         */
        async _confirmImpression(impressionToken, result) {
            try {
                await this._fetchWithTimeout(`${this.apiUrl}/ads/impression`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        impression_token: impressionToken,
                        session_id: this.sessionId,
                        completed: result.completed,
                        clicked: result.clicked,
                    })
                });
            } catch (error) {
                console.error('Failed to confirm impression:', error);
            }
        }

        /**
         * Предзагрузка медиа
         */
        async _preloadMedia(url, type) {
            return new Promise((resolve, reject) => {
                if (type === 'rewarded_video') {
                    const video = document.createElement('video');
                    video.src = url;
                    video.onloadeddata = () => resolve();
                    video.onerror = () => reject(new Error('Failed to load video'));
                } else {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error('Failed to load image'));
                }
            });
        }

        /**
         * Fetch с таймаутом
         */
        async _fetchWithTimeout(url, options) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

            try {
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal
                });
                clearTimeout(timeout);
                return response;
            } catch (error) {
                clearTimeout(timeout);
                throw error;
            }
        }

        /**
         * Генерация session ID
         */
        _generateSessionId() {
            return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        /**
         * Информация об устройстве
         */
        _getDeviceInfo() {
            return {
                user_agent: navigator.userAgent,
                screen: `${screen.width}x${screen.height}`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                platform: navigator.platform,
            };
        }
    }

    // Экспорт в глобальную область
    window.TowerAds = TowerAds;

})(window);
