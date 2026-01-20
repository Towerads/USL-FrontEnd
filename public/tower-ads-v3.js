/**
 * TOWER Ads SDK v3.1
 * Mediation support + Anti-spam + Loading screen
 * Supported providers: tower, adsonar, adexium, nygma, tads
 */

;(function(window) {
    'use strict';

    // ============== ANTI-SPAM LOCK ==============
    var __towerAdsLock = false;
    var __towerAdsLoadingLock = false;

    // ============== SCRIPT LOADER ==============
    function loadScript(src) {
        return new Promise(function(resolve, reject) {
            if (document.querySelector('script[src="' + src + '"]')) {
                return resolve();
            }
            var s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = function() { resolve(); };
            s.onerror = function() { reject(new Error('Failed to load: ' + src)); };
            document.body.appendChild(s);
        });
    }

    // ============== NYGMA CONFIG ==============
    var NYGMA_BLOCK_ID = "s1av3y3phfqnuwnihtphpst9";

    // ============== CONSTRUCTOR ==============
    function TowerAds(config) {
        this.apiKey = config.apiKey;
        this.placementId = config.placementId;
        this.apiUrl = config.apiUrl || 'https://towerads-backend.onrender.com/api/tower-ads';
        this.loadedAd = null;
        this.impressionId = null;
        this.provider = null;
        this.logoUrl = config.logoUrl || null;
        
        // TEST MODE: установи провайдер для тестирования
        // Варианты: 'tower', 'adsonar', 'adexium', 'nygma', 'tads', null (авто с бэка)
        this.testProvider = config.testProvider || null;
        
        // URL для iframe с партнёрскими SDK (должен быть на tower.ru в проде)
        this.adFrameUrl = config.adFrameUrl || './ad-frame.html';
        
        // Callbacks
        this.onAdLoaded = config.onAdLoaded || function() {};
        this.onAdShown = config.onAdShown || function() {};
        this.onAdClosed = config.onAdClosed || function() {};
        this.onRewardEarned = config.onRewardEarned || function() {};
        this.onError = config.onError || function() {};
        this.onProviderSelected = config.onProviderSelected || function() {};
    }
    
    // Метод для переключения провайдера в тест-режиме
    TowerAds.prototype.setTestProvider = function(provider) {
        this.testProvider = provider;
        console.log('[TowerAds] 🧪 Test provider set to:', provider || 'AUTO (from backend)');
    };

    // ============== LOADING SCREEN ==============
    TowerAds.prototype._showLoadingScreen = function() {
        var self = this;
        
        var overlay = document.createElement('div');
        overlay.id = 'tower-ads-loading';
        overlay.style.cssText = 
            'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999998;' +
            'background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;';

        // Logo container
        var logoContainer = document.createElement('div');
        logoContainer.style.cssText = 
            'width:120px;height:120px;margin-bottom:30px;display:flex;align-items:center;justify-content:center;';

        if (this.logoUrl) {
            var logo = document.createElement('img');
            logo.src = this.logoUrl;
            logo.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;';
            logoContainer.appendChild(logo);
        } else {
            // Default TOWER logo
            var defaultLogo = document.createElement('div');
            defaultLogo.innerHTML = 
                '<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="80" height="80" rx="16" fill="#1a1a1a"/>' +
                '<path d="M20 55V25h8v30h-8zm12-30h20v8H40v22h-8V25zm24 0h8v30h-8V25z" fill="#fff"/>' +
                '</svg>';
            logoContainer.appendChild(defaultLogo);
        }

        // Spinner
        var spinner = document.createElement('div');
        spinner.style.cssText = 
            'width:40px;height:40px;border:3px solid rgba(255,255,255,0.2);' +
            'border-top-color:#fff;border-radius:50%;animation:tower-spin 1s linear infinite;';

        // Loading text
        var loadingText = document.createElement('div');
        loadingText.textContent = 'Loading ad...';
        loadingText.style.cssText = 
            'color:rgba(255,255,255,0.6);font:400 14px -apple-system,BlinkMacSystemFont,sans-serif;margin-top:20px;';

        // Animation keyframes
        var style = document.createElement('style');
        style.textContent = '@keyframes tower-spin{to{transform:rotate(360deg)}}';
        document.head.appendChild(style);

        overlay.appendChild(logoContainer);
        overlay.appendChild(spinner);
        overlay.appendChild(loadingText);
        document.body.appendChild(overlay);

        return overlay;
    };

    TowerAds.prototype._hideLoadingScreen = function() {
        var loading = document.getElementById('tower-ads-loading');
        if (loading && loading.parentNode) {
            loading.parentNode.removeChild(loading);
        }
    };

    // ============== LOAD AD (with anti-spam) ==============
    TowerAds.prototype.loadAd = function() {
        var self = this;

        // Anti-spam: check if already loading
        if (__towerAdsLoadingLock) {
            console.warn('[TowerAds] Request already in progress, skipping...');
            return Promise.reject(new Error('Request already in progress'));
        }

        __towerAdsLoadingLock = true;

        return fetch(this.apiUrl + '/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_key: this.apiKey,
                placement_id: this.placementId,
                user_data: {
                    ip: 'client',
                    device: this._getDevice(),
                    os: this._getOS()
                }
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            __towerAdsLoadingLock = false;

            if (!data.success) {
                throw new Error(data.error || 'No ad available');
            }

            // Store provider (or use testProvider override)
            if (self.testProvider) {
                self.provider = self.testProvider;
                console.log('[TowerAds] 🧪 TEST MODE: Using provider:', self.provider);
            } else {
                self.provider = data.provider || 'tower';
                console.log('[TowerAds] Provider selected:', self.provider);
            }
            self.onProviderSelected(self.provider);

            // If tower provider - store ad data
            if (self.provider === 'tower' && data.ad) {
                self.loadedAd = data.ad;
                self.impressionId = data.impression_id;
                self.onAdLoaded('tower');
                return { provider: 'tower', ad: data.ad };
            }

            // For other providers - just return provider info
            self.onAdLoaded(self.provider);
            return { provider: self.provider, ad: null };
        })
        .catch(function(error) {
            __towerAdsLoadingLock = false;
            self.onError(error);
            throw error;
        });
    };

    // ============== SHOW AD (with anti-spam + mediation) ==============
    TowerAds.prototype.showAd = function() {
        var self = this;

        // Anti-spam: check if ad is already showing
        if (__towerAdsLock) {
            console.warn('[TowerAds] Ad already showing, skipping...');
            return Promise.reject(new Error('Ad already showing'));
        }

        // Check if we have provider
        if (!this.provider) {
            return Promise.reject(new Error('No ad loaded. Call loadAd() first.'));
        }

        __towerAdsLock = true;
        this.onAdShown();

        // Route to correct provider
        var showPromise;
        switch (this.provider) {
            case 'tower':
                if (!this.loadedAd) {
                    __towerAdsLock = false;
                    return Promise.reject(new Error('No tower ad loaded'));
                }
                showPromise = this._showTowerAd();
                break;
            case 'adsonar':
                showPromise = this._showAdSonar();
                break;
            case 'adexium':
                showPromise = this._showAdexium();
                break;
            case 'nygma':
            case 'nigma':
                showPromise = this._showNygma();
                break;
            case 'tads':
                showPromise = this._showTADS();
                break;
            default:
                __towerAdsLock = false;
                return Promise.reject(new Error('Unknown provider: ' + this.provider));
        }

        return showPromise
            .then(function(result) {
                __towerAdsLock = false;
                return result;
            })
            .catch(function(error) {
                __towerAdsLock = false;
                self.onError(error);
                throw error;
            });
    };

    // ============== TOWER AD DISPLAY ==============
    TowerAds.prototype._showTowerAd = function() {
        if (this.loadedAd.ad_type === 'rewarded_video') {
            return this._showVideo();
        } else {
            return this._showImage();
        }
    };

    TowerAds.prototype._showVideo = function() {
        var self = this;
        
        return new Promise(function(resolve) {
            // Show loading screen first
            var loadingOverlay = self._showLoadingScreen();

            // Fullscreen overlay - черный фон
            var overlay = document.createElement('div');
            overlay.style.cssText = 
                'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;' +
                'background:#000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s;';

            // Video - fullscreen без скруглений, без обрезки
            var video = document.createElement('video');
            video.src = self.loadedAd.media_url;
            video.style.cssText = 
                'width:100%;height:100%;object-fit:contain;';
            video.autoplay = true;
            video.playsInline = true;
            video.controls = false;
            video.muted = false;

            // Прогресс-бар видео - белый внизу
            var progressBar = document.createElement('div');
            progressBar.style.cssText = 
                'position:absolute;bottom:0;left:0;right:0;height:4px;' +
                'background:rgba(255,255,255,0.2);z-index:10;';

            var progressFill = document.createElement('div');
            progressFill.style.cssText = 
                'height:100%;width:0%;background:#fff;' +
                'transition:width 0.1s linear;box-shadow:0 0 10px rgba(255,255,255,0.5);';

            progressBar.appendChild(progressFill);

            // Обновление прогресс-бара
            video.addEventListener('timeupdate', function() {
                if (video.duration) {
                    progressFill.style.width = ((video.currentTime / video.duration) * 100) + '%';
                }
            });

            // Круглая кнопка Skip
            var skipBtn = document.createElement('div');
            skipBtn.style.cssText = 
                'position:absolute;top:20px;right:20px;z-index:20;' +
                'width:60px;height:60px;border-radius:50%;' +
                'background:rgba(0,0,0,0.6);backdrop-filter:blur(20px);' +
                'display:flex;align-items:center;justify-content:center;' +
                'cursor:not-allowed;transition:all 0.3s ease;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.5);';

            // SVG для кругового прогресса
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '60');
            svg.setAttribute('height', '60');
            svg.style.cssText = 'position:absolute;top:0;left:0;transform:rotate(-90deg);';

            var circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circleBg.setAttribute('cx', '30');
            circleBg.setAttribute('cy', '30');
            circleBg.setAttribute('r', '26');
            circleBg.setAttribute('fill', 'none');
            circleBg.setAttribute('stroke', 'rgba(255,255,255,0.2)');
            circleBg.setAttribute('stroke-width', '3');

            var progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            progressCircle.setAttribute('cx', '30');
            progressCircle.setAttribute('cy', '30');
            progressCircle.setAttribute('r', '26');
            progressCircle.setAttribute('fill', 'none');
            progressCircle.setAttribute('stroke', '#fff');
            progressCircle.setAttribute('stroke-width', '3');
            progressCircle.setAttribute('stroke-linecap', 'round');

            var circumference = 2 * Math.PI * 26;
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = circumference;

            svg.appendChild(circleBg);
            svg.appendChild(progressCircle);

            // Текст таймера
            var timerText = document.createElement('div');
            timerText.textContent = '5';
            timerText.style.cssText = 
                'position:relative;z-index:1;color:#fff;' +
                'font:700 22px -apple-system,BlinkMacSystemFont,sans-serif;';

            skipBtn.appendChild(svg);
            skipBtn.appendChild(timerText);

            overlay.appendChild(video);
            overlay.appendChild(progressBar);
            overlay.appendChild(skipBtn);

            // Wait for video to be ready
            video.addEventListener('canplay', function onCanPlay() {
                video.removeEventListener('canplay', onCanPlay);
                // Hide loading, show video
                self._hideLoadingScreen();
                document.body.appendChild(overlay);
                setTimeout(function() { overlay.style.opacity = '1'; }, 10);
                video.play().catch(function() {});
                startTimer();
            });

            video.addEventListener('error', function() {
                self._hideLoadingScreen();
                self.onError(new Error('Video failed to load'));
                resolve({ completed: false, error: 'Video load failed' });
            });

            // Анимация таймера 5 секунд
            var startTime;
            var duration = 5000;
            var isActive = false;

            function startTimer() {
                startTime = Date.now();
                requestAnimationFrame(updateTimer);
            }

            function updateTimer() {
                var elapsed = Date.now() - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var offset = circumference * (1 - progress);
                progressCircle.style.strokeDashoffset = offset;

                var timeLeft = Math.max(0, Math.ceil((duration - elapsed) / 1000));

                if (timeLeft > 0) {
                    timerText.textContent = timeLeft;
                    requestAnimationFrame(updateTimer);
                } else if (!isActive) {
                    isActive = true;
                    // Кнопка активна
                    timerText.textContent = '✕';
                    timerText.style.fontSize = '26px';
                    skipBtn.style.cursor = 'pointer';
                    skipBtn.style.background = '#fff';
                    timerText.style.color = '#000';
                    progressCircle.style.stroke = '#000';

                    skipBtn.onmouseover = function() {
                        skipBtn.style.transform = 'scale(1.1)';
                        skipBtn.style.boxShadow = '0 6px 30px rgba(255,255,255,0.6)';
                    };
                    skipBtn.onmouseout = function() {
                        skipBtn.style.transform = 'scale(1)';
                        skipBtn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
                    };

                    skipBtn.onclick = cleanup;
                }
            }

            function cleanup() {
                self._trackComplete();
                if (overlay.parentNode) {
                    document.body.removeChild(overlay);
                }
                self.onAdClosed();
                self.onRewardEarned({ amount: 100, item: 'coins', provider: 'tower' });
                resolve({ completed: true, provider: 'tower' });
            }

            video.addEventListener('ended', cleanup);
            video.addEventListener('click', function() {
                self._trackClick();
                if (self.loadedAd.click_url) {
                    window.open(self.loadedAd.click_url, '_blank');
                }
            });

            // Timeout fallback for loading
            setTimeout(function() {
                if (loadingOverlay.parentNode) {
                    self._hideLoadingScreen();
                    self.onError(new Error('Video load timeout'));
                    resolve({ completed: false, error: 'Timeout' });
                }
            }, 15000);
        });
    };

    TowerAds.prototype._showImage = function() {
        var self = this;
        
        return new Promise(function(resolve) {
            // Show loading screen first
            var loadingOverlay = self._showLoadingScreen();

            // Fullscreen overlay - черный фон
            var overlay = document.createElement('div');
            overlay.style.cssText = 
                'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;' +
                'background:#000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s;';

            // Image - fullscreen без скруглений
            var img = document.createElement('img');
            img.src = self.loadedAd.media_url;
            img.style.cssText = 
                'width:100%;height:100%;object-fit:cover;cursor:pointer;';

            // Круглая кнопка Close
            var closeBtn = document.createElement('div');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = 
                'position:absolute;top:20px;right:20px;z-index:20;' +
                'width:60px;height:60px;border-radius:50%;' +
                'background:rgba(0,0,0,0.6);backdrop-filter:blur(20px);' +
                'display:flex;align-items:center;justify-content:center;' +
                'cursor:pointer;transition:all 0.3s ease;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.5);' +
                'color:#fff;font:700 26px -apple-system,BlinkMacSystemFont,sans-serif;';

            closeBtn.onmouseover = function() {
                closeBtn.style.background = '#fff';
                closeBtn.style.color = '#000';
                closeBtn.style.transform = 'scale(1.1)';
                closeBtn.style.boxShadow = '0 6px 30px rgba(255,255,255,0.6)';
            };
            closeBtn.onmouseout = function() {
                closeBtn.style.background = 'rgba(0,0,0,0.6)';
                closeBtn.style.color = '#fff';
                closeBtn.style.transform = 'scale(1)';
                closeBtn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
            };

            overlay.appendChild(img);
            overlay.appendChild(closeBtn);

            // Wait for image to load
            img.onload = function() {
                self._hideLoadingScreen();
                document.body.appendChild(overlay);
                setTimeout(function() { overlay.style.opacity = '1'; }, 10);
            };

            img.onerror = function() {
                self._hideLoadingScreen();
                self.onError(new Error('Image failed to load'));
                resolve({ completed: false, error: 'Image load failed' });
            };

            function cleanup() {
                self._trackComplete();
                if (overlay.parentNode) {
                    document.body.removeChild(overlay);
                }
                self.onAdClosed();
                resolve({ completed: true, provider: 'tower' });
            }

            closeBtn.onclick = cleanup;
            img.addEventListener('click', function() {
                self._trackClick();
                if (self.loadedAd.click_url) {
                    window.open(self.loadedAd.click_url, '_blank');
                }
            });

            // Timeout fallback
            setTimeout(function() {
                if (loadingOverlay.parentNode) {
                    self._hideLoadingScreen();
                    self.onError(new Error('Image load timeout'));
                    resolve({ completed: false, error: 'Timeout' });
                }
            }, 15000);
        });
    };

    // ============== IFRAME-BASED PARTNER ADS ==============
    TowerAds.prototype._showPartnerViaIframe = function(providerName) {
        var self = this;
        
        return new Promise(function(resolve, reject) {
            console.log('[TowerAds] Opening iframe for:', providerName);
            
            // Create fullscreen iframe
            var iframe = document.createElement('iframe');
            var frameUrl = self.adFrameUrl + '?provider=' + providerName + '&origin=' + encodeURIComponent(window.location.origin);
            iframe.src = frameUrl;
            iframe.id = 'tower-ads-iframe';
            iframe.style.cssText = 
                'position:fixed;top:0;left:0;width:100%;height:100%;' +
                'z-index:999999;border:none;background:#000;';
            
            var resolved = false;
            
            // Listen for messages from iframe
            function onMessage(event) {
                // В проде проверять origin: if (event.origin !== 'https://tower.ru') return;
                var data = event.data;
                if (!data || !data.type) return;
                
                console.log('[TowerAds] Iframe message:', data.type, data);
                
                switch (data.type) {
                    case 'adComplete':
                        if (resolved) return;
                        resolved = true;
                        cleanup();
                        self.onAdClosed();
                        self.onRewardEarned(data.reward || { amount: 100, item: 'coins', provider: providerName });
                        resolve({ completed: true, provider: providerName });
                        break;
                        
                    case 'adClosed':
                        if (resolved) return;
                        resolved = true;
                        cleanup();
                        self.onAdClosed();
                        resolve({ completed: false, provider: providerName, reason: 'closed' });
                        break;
                        
                    case 'adError':
                        if (resolved) return;
                        resolved = true;
                        cleanup();
                        reject(new Error(data.error || 'Partner ad error'));
                        break;
                }
            }
            
            function cleanup() {
                window.removeEventListener('message', onMessage);
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            }
            
            window.addEventListener('message', onMessage);
            document.body.appendChild(iframe);
            
            // Timeout
            setTimeout(function() {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    reject(new Error(providerName + ' iframe timeout'));
                }
            }, 30000);
        });
    };

    // ============== ADSONAR PROVIDER ==============
    TowerAds.prototype._showAdSonar = function() {
        return this._showPartnerViaIframe('adsonar');
    };

    // ============== ADEXIUM PROVIDER ==============
    TowerAds.prototype._showAdexium = function() {
        return this._showPartnerViaIframe('adexium');
    };

    // ============== NYGMA PROVIDER ==============
    TowerAds.prototype._showNygma = function() {
        return this._showPartnerViaIframe('nygma');
    };

    // ============== TADS PROVIDER ==============
    TowerAds.prototype._showTADS = function() {
        return this._showPartnerViaIframe('tads');
    };

    // ============== TRACKING ==============
    TowerAds.prototype._trackComplete = function() {
        if (!this.impressionId) return;
        fetch(this.apiUrl + '/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ impression_id: this.impressionId })
        }).catch(function() {});
    };

    TowerAds.prototype._trackClick = function() {
        if (!this.impressionId) return;
        fetch(this.apiUrl + '/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ impression_id: this.impressionId })
        }).catch(function() {});
    };

    // ============== HELPERS ==============
    TowerAds.prototype._getDevice = function() {
        var ua = navigator.userAgent;
        if (/mobile/i.test(ua)) return 'mobile';
        if (/tablet/i.test(ua)) return 'tablet';
        return 'desktop';
    };

    TowerAds.prototype._getOS = function() {
        var ua = navigator.userAgent;
        if (/windows/i.test(ua)) return 'windows';
        if (/mac/i.test(ua)) return 'macos';
        if (/linux/i.test(ua)) return 'linux';
        if (/android/i.test(ua)) return 'android';
        if (/ios|iphone|ipad/i.test(ua)) return 'ios';
        return 'unknown';
    };

    // ============== CONVENIENCE METHOD ==============
    TowerAds.prototype.loadAndShow = function() {
        var self = this;
        return this.loadAd().then(function() {
            return self.showAd();
        });
    };

    // ============== STATUS HELPERS ==============
    TowerAds.prototype.isLoading = function() {
        return __towerAdsLoadingLock;
    };

    TowerAds.prototype.isShowing = function() {
        return __towerAdsLock;
    };

    TowerAds.prototype.getProvider = function() {
        return this.provider;
    };

    TowerAds.prototype.reset = function() {
        this.loadedAd = null;
        this.impressionId = null;
        this.provider = null;
    };

    // Export
    window.TowerAds = TowerAds;

})(window);
