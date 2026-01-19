/**
 * TOWER Ads SDK v3.0
 * Новый дизайн с круговым прогрессом
 */

;(function(window) {
    'use strict';

    function TowerAds(config) {
        this.apiKey = config.apiKey;
        this.placementId = config.placementId;
        this.apiUrl = config.apiUrl || 'https://towerads-backend.onrender.com/api/tower-ads';
        this.loadedAd = null;
        this.impressionId = null;
        
        // Callbacks
        this.onAdLoaded = config.onAdLoaded || (() => {});
        this.onAdShown = config.onAdShown || (() => {});
        this.onAdClosed = config.onAdClosed || (() => {});
        this.onRewardEarned = config.onRewardEarned || (() => {});
    }

    TowerAds.prototype.loadAd = function() {
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
        .then(res => res.json())
        .then(data => {
            if (data.success && data.ad) {
                this.loadedAd = data.ad;
                this.impressionId = data.impression_id;
                this.onAdLoaded('tower');
                return data.ad;
            }
            throw new Error(data.error || 'No ad available');
        });
    };

    TowerAds.prototype.showAd = function() {
        if (!this.loadedAd) {
            return Promise.reject(new Error('No ad loaded'));
        }

        this.onAdShown();

        if (this.loadedAd.ad_type === 'rewarded_video') {
            return this._showVideo();
        } else {
            return this._showImage();
        }
    };

    TowerAds.prototype._showVideo = function() {
        return new Promise((resolve) => {
            // Fullscreen overlay - черный фон
            const overlay = document.createElement('div');
            overlay.style.cssText = 
                'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;' +
                'background:#000;display:flex;align-items:center;justify-content:center;';

            // Video - fullscreen без скруглений, без обрезки
            const video = document.createElement('video');
            video.src = this.loadedAd.media_url;
            video.style.cssText = 
                'width:100%;height:100%;object-fit:contain;';
            video.autoplay = true;
            video.playsInline = true;
            video.controls = false;

            // Прогресс-бар видео - белый внизу
            const progressBar = document.createElement('div');
            progressBar.style.cssText = 
                'position:absolute;bottom:0;left:0;right:0;height:4px;' +
                'background:rgba(255,255,255,0.2);z-index:10;';

            const progressFill = document.createElement('div');
            progressFill.style.cssText = 
                'height:100%;width:0%;background:#fff;' +
                'transition:width 0.1s linear;box-shadow:0 0 10px rgba(255,255,255,0.5);';

            progressBar.appendChild(progressFill);

            // Обновление прогресс-бара
            video.addEventListener('timeupdate', () => {
                if (video.duration) {
                    progressFill.style.width = ((video.currentTime / video.duration) * 100) + '%';
                }
            });

            // Круглая кнопка Skip
            const skipBtn = document.createElement('div');
            skipBtn.style.cssText = 
                'position:absolute;top:20px;right:20px;z-index:20;' +
                'width:60px;height:60px;border-radius:50%;' +
                'background:rgba(0,0,0,0.6);backdrop-filter:blur(20px);' +
                'display:flex;align-items:center;justify-content:center;' +
                'cursor:not-allowed;transition:all 0.3s ease;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.5);';

            // SVG для кругового прогресса
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '60');
            svg.setAttribute('height', '60');
            svg.style.cssText = 'position:absolute;top:0;left:0;transform:rotate(-90deg);';

            const circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circleBg.setAttribute('cx', '30');
            circleBg.setAttribute('cy', '30');
            circleBg.setAttribute('r', '26');
            circleBg.setAttribute('fill', 'none');
            circleBg.setAttribute('stroke', 'rgba(255,255,255,0.2)');
            circleBg.setAttribute('stroke-width', '3');

            const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            progressCircle.setAttribute('cx', '30');
            progressCircle.setAttribute('cy', '30');
            progressCircle.setAttribute('r', '26');
            progressCircle.setAttribute('fill', 'none');
            progressCircle.setAttribute('stroke', '#fff');
            progressCircle.setAttribute('stroke-width', '3');
            progressCircle.setAttribute('stroke-linecap', 'round');

            const circumference = 2 * Math.PI * 26;
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = circumference;

            svg.appendChild(circleBg);
            svg.appendChild(progressCircle);

            // Текст таймера
            const timerText = document.createElement('div');
            timerText.textContent = '5';
            timerText.style.cssText = 
                'position:relative;z-index:1;color:#fff;' +
                'font:700 22px -apple-system,BlinkMacSystemFont,sans-serif;';

            skipBtn.appendChild(svg);
            skipBtn.appendChild(timerText);

            overlay.appendChild(video);
            overlay.appendChild(progressBar);
            overlay.appendChild(skipBtn);
            document.body.appendChild(overlay);

            // Анимация таймера 5 секунд
            let startTime = Date.now();
            const duration = 5000;
            let isActive = false;

            const updateTimer = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const offset = circumference * (1 - progress);
                progressCircle.style.strokeDashoffset = offset;

                const timeLeft = Math.max(0, Math.ceil((duration - elapsed) / 1000));

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

                    skipBtn.onmouseover = () => {
                        skipBtn.style.transform = 'scale(1.1)';
                        skipBtn.style.boxShadow = '0 6px 30px rgba(255,255,255,0.6)';
                    };
                    skipBtn.onmouseout = () => {
                        skipBtn.style.transform = 'scale(1)';
                        skipBtn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
                    };

                    skipBtn.onclick = cleanup;
                }
            };

            requestAnimationFrame(updateTimer);

            const cleanup = () => {
                this._trackComplete();
                document.body.removeChild(overlay);
                this.onAdClosed();
                this.onRewardEarned({ amount: 100, item: 'coins' });
                resolve({ completed: true });
            };

            video.addEventListener('ended', cleanup);
            video.addEventListener('click', () => {
                this._trackClick();
                if (this.loadedAd.click_url) {
                    window.open(this.loadedAd.click_url, '_blank');
                }
            });
        });
    };

    TowerAds.prototype._showImage = function() {
        return new Promise((resolve) => {
            // Fullscreen overlay - черный фон
            const overlay = document.createElement('div');
            overlay.style.cssText = 
                'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;' +
                'background:#000;display:flex;align-items:center;justify-content:center;';

            // Image - fullscreen без скруглений
            const img = document.createElement('img');
            img.src = this.loadedAd.media_url;
            img.style.cssText = 
                'width:100%;height:100%;object-fit:cover;cursor:pointer;';

            // Круглая кнопка Close
            const closeBtn = document.createElement('div');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = 
                'position:absolute;top:20px;right:20px;z-index:20;' +
                'width:60px;height:60px;border-radius:50%;' +
                'background:rgba(0,0,0,0.6);backdrop-filter:blur(20px);' +
                'display:flex;align-items:center;justify-content:center;' +
                'cursor:pointer;transition:all 0.3s ease;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.5);' +
                'color:#fff;font:700 26px -apple-system,BlinkMacSystemFont,sans-serif;';

            closeBtn.onmouseover = () => {
                closeBtn.style.background = '#fff';
                closeBtn.style.color = '#000';
                closeBtn.style.transform = 'scale(1.1)';
                closeBtn.style.boxShadow = '0 6px 30px rgba(255,255,255,0.6)';
            };
            closeBtn.onmouseout = () => {
                closeBtn.style.background = 'rgba(0,0,0,0.6)';
                closeBtn.style.color = '#fff';
                closeBtn.style.transform = 'scale(1)';
                closeBtn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
            };

            overlay.appendChild(img);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);

            const cleanup = () => {
                this._trackComplete();
                document.body.removeChild(overlay);
                this.onAdClosed();
                resolve({ completed: true });
            };

            closeBtn.onclick = cleanup;
            img.addEventListener('click', () => {
                this._trackClick();
                if (this.loadedAd.click_url) {
                    window.open(this.loadedAd.click_url, '_blank');
                }
            });
        });
    };

    TowerAds.prototype._trackComplete = function() {
        if (!this.impressionId) return;
        fetch(this.apiUrl + '/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ impression_id: this.impressionId })
        }).catch(() => {});
    };

    TowerAds.prototype._trackClick = function() {
        if (!this.impressionId) return;
        fetch(this.apiUrl + '/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ impression_id: this.impressionId })
        }).catch(() => {});
    };

    TowerAds.prototype._getDevice = function() {
        const ua = navigator.userAgent;
        if (/mobile/i.test(ua)) return 'mobile';
        if (/tablet/i.test(ua)) return 'tablet';
        return 'desktop';
    };

    TowerAds.prototype._getOS = function() {
        const ua = navigator.userAgent;
        if (/windows/i.test(ua)) return 'windows';
        if (/mac/i.test(ua)) return 'macos';
        if (/linux/i.test(ua)) return 'linux';
        if (/android/i.test(ua)) return 'android';
        if (/ios|iphone|ipad/i.test(ua)) return 'ios';
        return 'unknown';
    };

    window.TowerAds = TowerAds;

})(window);
