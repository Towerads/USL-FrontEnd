/**
 * TOWER Ads - Standalone JavaScript SDK with Mediation
 * Version: 2.0.0
 *
 * Basic Usage:
 * <script src="https://your-domain.com/tower-ads.js"></script>
 * <script>
 *   const ad = new TowerAds({
 *     apiKey: 'tower_xxx',
 *     placementId: 'placement_xxx',
 *     onRewardEarned: function(reward) {
 *       console.log('Earned:', reward);
 *     }
 *   });
 *
 *   ad.loadAd().then(() => ad.showAd());
 * </script>
 *
 * Advanced Usage with Mediation:
 * <script>
 *   const ad = new TowerAds({
 *     apiKey: 'tower_xxx',
 *     placementId: 'main',
 *     
 *     // Enable mediation
 *     mediation: {
 *       enabled: true,
 *       waterfall: ['tower', 'telegram', 'monetag', 'yandex'],
 *       networks: {
 *         telegram: {
 *           blockId: 'your-block-id'
 *         },
 *         monetag: {
 *           zone: 123456,
 *           sdk: 'show_123456'
 *         },
 *         yandex: {
 *           blockId: 'R-A-123456-1'
 *         }
 *       }
 *     },
 *     
 *     onAdLoaded: function(network) {
 *       console.log('Ad loaded from:', network);
 *     }
 *   });
 * </script>
 */

; ((window) => {
    // ============================================
    // BASE ADAPTER CLASS
    // ============================================
    class AdNetworkAdapter {
        constructor(name, config) {
            this.name = name
            this.config = config || {}
            this.isReady = false
            this.priority = config.priority || 0
            this.loadedAd = null
        }

        async init() {
            return Promise.resolve()
        }

        async loadAd(placementId) {
            throw new Error("loadAd must be implemented")
        }

        async showAd() {
            throw new Error("showAd must be implemented")
        }

        getName() {
            return this.name
        }

        isAdReady() {
            return this.isReady && this.loadedAd !== null
        }

        destroy() {
            this.loadedAd = null
            this.isReady = false
        }
    }

    // ============================================
    // TOWER NETWORK ADAPTER (Native)
    // ============================================
    class TowerNetworkAdapter extends AdNetworkAdapter {
        constructor(config) {
            super("tower", config)
            this.apiKey = config.apiKey
            this.placementId = config.placementId
            this.apiBaseUrl = config.apiUrl || window.location.origin + "/api/tower-ads"
            this.impressionId = null
            this.isReady = true
        }

        async loadAd(placementId) {
            return fetch(this.apiBaseUrl + "/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    placement_id: placementId || this.placementId,
                    user_data: {
                        ip: "client",
                        device: this._getDeviceInfo(),
                        os: this._getOS(),
                    },
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success && data.ad) {
                        this.loadedAd = data.ad
                        this.impressionId = data.impression_id || null

                        if (data.ad.ad_type === "rewarded_video") {
                            return this._preloadVideo(data.ad.media_url)
                        } else {
                            return this._preloadImage(data.ad.media_url)
                        }
                    } else {
                        throw new Error(data.error || "No ad available")
                    }
                })
                .then(() => this.loadedAd)
        }

        async showAd() {
            if (!this.loadedAd) {
                throw new Error("No ad loaded")
            }

            if (this.loadedAd.ad_type === "rewarded_video") {
                return this._showRewardedVideo()
            } else if (this.loadedAd.ad_type === "interstitial") {
                return this._showInterstitial()
            }
        }

        _showRewardedVideo() {
            return new Promise((resolve) => {
                var overlay = document.createElement("div")
                overlay.style.cssText =
                    "position:fixed;top:0;left:0;width:100%;height:100%;" +
                    "background:rgba(0,0,0,0.95);z-index:999999;" +
                    "display:flex;flex-direction:column;align-items:center;justify-content:center;"

                var video = document.createElement("video")
                video.src = this.loadedAd.media_url
                video.style.cssText = "max-width:90%;max-height:80%;border-radius:8px;"
                video.controls = false
                video.autoplay = true

                var closeBtn = document.createElement("button")
                closeBtn.textContent = "Skip (5s)"
                closeBtn.style.cssText =
                    "margin-top:20px;padding:12px 24px;background:#666;color:white;" +
                    "border:none;border-radius:6px;cursor:not-allowed;font-size:16px;opacity:0.5;"
                closeBtn.disabled = true

                overlay.appendChild(video)
                overlay.appendChild(closeBtn)
                document.body.appendChild(overlay)

                setTimeout(() => {
                    closeBtn.textContent = "Close"
                    closeBtn.style.cursor = "pointer"
                    closeBtn.style.background = "#10b981"
                    closeBtn.style.opacity = "1"
                    closeBtn.disabled = false
                }, 5000)

                video.addEventListener("ended", () => {
                    this._handleAdComplete()
                    document.body.removeChild(overlay)
                    resolve({ network: "tower", completed: true })
                })

                closeBtn.addEventListener("click", () => {
                    if (!closeBtn.disabled) {
                        this._handleAdComplete()
                        document.body.removeChild(overlay)
                        resolve({ network: "tower", completed: true })
                    }
                })

                video.addEventListener("click", () => {
                    this._handleAdClick()
                    if (this.loadedAd.click_url) {
                        window.open(this.loadedAd.click_url, "_blank")
                    }
                })
            })
        }

        _showInterstitial() {
            return new Promise((resolve) => {
                var overlay = document.createElement("div")
                overlay.style.cssText =
                    "position:fixed;top:0;left:0;width:100%;height:100%;" +
                    "background:rgba(0,0,0,0.95);z-index:999999;" +
                    "display:flex;flex-direction:column;align-items:center;justify-content:center;"

                var img = document.createElement("img")
                img.src = this.loadedAd.media_url
                img.style.cssText = "max-width:90%;max-height:80%;border-radius:8px;cursor:pointer;"

                var closeBtn = document.createElement("button")
                closeBtn.textContent = "Close"
                closeBtn.style.cssText =
                    "position:absolute;top:20px;right:20px;padding:12px 24px;" +
                    "background:#10b981;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px;"

                overlay.appendChild(img)
                overlay.appendChild(closeBtn)
                document.body.appendChild(overlay)

                img.addEventListener("click", () => {
                    this._handleAdClick()
                    if (this.loadedAd.click_url) {
                        window.open(this.loadedAd.click_url, "_blank")
                    }
                })

                closeBtn.addEventListener("click", () => {
                    document.body.removeChild(overlay)
                    resolve({ network: "tower", completed: true })
                })
            })
        }

        _handleAdComplete() {
            if (!this.impressionId) return

            fetch(this.apiBaseUrl + "/complete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    impression_id: this.impressionId,
                }),
            }).catch((error) => {
                console.error("[TowerAds] Failed to track completion:", error)
            })
        }

        _handleAdClick() {
            if (!this.impressionId) return

            fetch(this.apiBaseUrl + "/click", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    impression_id: this.impressionId,
                }),
            }).catch((error) => {
                console.error("[TowerAds] Failed to track click:", error)
            })
        }

        _preloadVideo(url) {
            return new Promise((resolve, reject) => {
                var video = document.createElement("video")
                video.src = url
                video.preload = "auto"
                video.addEventListener("loadeddata", resolve)
                video.addEventListener("error", reject)
            })
        }

        _preloadImage(url) {
            return new Promise((resolve, reject) => {
                var img = new Image()
                img.src = url
                img.onload = resolve
                img.onerror = reject
            })
        }

        _getDeviceInfo() {
            var ua = navigator.userAgent
            if (/mobile/i.test(ua)) return "mobile"
            if (/tablet/i.test(ua)) return "tablet"
            return "desktop"
        }

        _getOS() {
            var ua = navigator.userAgent
            if (/windows/i.test(ua)) return "Windows"
            if (/mac/i.test(ua)) return "MacOS"
            if (/linux/i.test(ua)) return "Linux"
            if (/android/i.test(ua)) return "Android"
            if (/ios|iphone|ipad/i.test(ua)) return "iOS"
            return "Unknown"
        }
    }

    // ============================================
    // TELEGRAM ADS ADAPTER
    // ============================================
    class TelegramAdsAdapter extends AdNetworkAdapter {
        constructor(config) {
            super("telegram", config)
            this.blockId = config.blockId
            this.controller = null
        }

        async init() {
            if (!window.TelegramAdsController) {
                throw new Error("TelegramAdsController not found. Load the script first.")
            }

            this.controller = new window.TelegramAdsController()
            await this.controller.initialize({
                blockId: this.blockId
            })
            this.isReady = true
        }

        async loadAd(placementId) {
            if (!this.controller) {
                throw new Error("Telegram Ads not initialized")
            }
            this.loadedAd = { ready: true }
            return this.loadedAd
        }

        async showAd() {
            if (!this.controller) {
                throw new Error("Telegram Ads not initialized")
            }
            await this.controller.triggerInterstitialVideo()
            return { network: "telegram", completed: true }
        }
    }

    // ============================================
    // MONETAG ADAPTER
    // ============================================
    class MonetagAdapter extends AdNetworkAdapter {
        constructor(config) {
            super("monetag", config)
            this.zone = config.zone
            this.sdk = config.sdk
        }

        async init() {
            if (!window[this.sdk]) {
                throw new Error("Monetag SDK method not found: " + this.sdk)
            }
            this.isReady = true
        }

        async loadAd(placementId) {
            this.loadedAd = { ready: true }
            return this.loadedAd
        }

        async showAd() {
            if (!window[this.sdk]) {
                throw new Error("Monetag SDK not found")
            }
            await window[this.sdk]()
            return { network: "monetag", completed: true }
        }
    }

    // ============================================
    // YANDEX ADAPTER
    // ============================================
    class YandexAdapter extends AdNetworkAdapter {
        constructor(config) {
            super("yandex", config)
            this.blockId = config.blockId
        }

        async init() {
            if (!window.Ya || !window.Ya.Context || !window.Ya.Context.AdvManager) {
                throw new Error("Yandex Ads not found")
            }
            this.isReady = true
        }

        async loadAd(placementId) {
            this.loadedAd = { ready: true }
            return this.loadedAd
        }

        async showAd() {
            return new Promise((resolve, reject) => {
                const platform = this._getPlatform()
                const renderParams = {
                    blockId: this.blockId,
                    type: "rewarded",
                    platform: platform,
                    onRewarded: (reward) => {
                        resolve({ network: "yandex", completed: true, reward })
                    },
                    onError: (error) => {
                        reject(new Error("Yandex ad error: " + JSON.stringify(error)))
                    }
                }

                window.yaContextCb = window.yaContextCb || []
                window.yaContextCb.push(() => {
                    window.Ya.Context.AdvManager.render(renderParams, () => {
                        reject(new Error("Yandex fallback triggered"))
                    })
                })
            })
        }

        _getPlatform() {
            try {
                return window.Ya.Context.AdvManager.getPlatform()
            } catch (e) {
                const ua = navigator.userAgent
                if (/mobile/i.test(ua)) return "touch"
                return "desktop"
            }
        }
    }

    // ============================================
    // MEDIATION MANAGER
    // ============================================
    class MediationManager {
        constructor(config) {
            this.config = config || {}
            this.networks = []
            this.waterfall = config.waterfall || ["tower"]
            this.currentNetwork = null
            this.currentAd = null
            this.analytics = {
                attempts: [],
                lastShow: null
            }
        }

        registerNetwork(adapter) {
            this.networks.push(adapter)
            console.log("[Mediation] Registered network:", adapter.getName())
        }

        async initNetworks() {
            const initPromises = this.networks.map(async (network) => {
                try {
                    await network.init()
                    console.log("[Mediation] Initialized:", network.getName())
                } catch (error) {
                    console.warn("[Mediation] Failed to init " + network.getName() + ":", error.message)
                }
            })

            await Promise.allSettled(initPromises)
        }

        async loadAd(placementId) {
            this.analytics.attempts = []
            const startTime = Date.now()

            for (let networkName of this.waterfall) {
                const network = this.networks.find(n => n.getName() === networkName)

                if (!network) {
                    console.warn("[Mediation] Network not found:", networkName)
                    continue
                }

                if (!network.isReady) {
                    console.warn("[Mediation] Network not ready:", networkName)
                    this.analytics.attempts.push({
                        network: networkName,
                        status: "not_ready",
                        time: 0
                    })
                    continue
                }

                try {
                    const attemptStart = Date.now()
                    console.log("[Mediation] Trying to load ad from:", networkName)

                    const ad = await network.loadAd(placementId)

                    if (ad) {
                        this.currentNetwork = network
                        this.currentAd = ad
                        const loadTime = Date.now() - attemptStart

                        this.analytics.attempts.push({
                            network: networkName,
                            status: "success",
                            time: loadTime
                        })

                        console.log("[Mediation] Ad loaded from:", networkName, "in", loadTime + "ms")
                        return { network: networkName, ad: ad }
                    }
                } catch (error) {
                    const loadTime = Date.now() - attemptStart
                    console.warn("[Mediation] Failed to load from " + networkName + ":", error.message)

                    this.analytics.attempts.push({
                        network: networkName,
                        status: "error",
                        error: error.message,
                        time: loadTime
                    })
                }
            }

            const totalTime = Date.now() - startTime
            console.error("[Mediation] No ads available from any network. Total time:", totalTime + "ms")
            throw new Error("No ads available from any network")
        }

        async showAd() {
            if (!this.currentNetwork || !this.currentAd) {
                throw new Error("No ad loaded. Call loadAd() first.")
            }

            const showStart = Date.now()
            const networkName = this.currentNetwork.getName()

            try {
                console.log("[Mediation] Showing ad from:", networkName)
                const result = await this.currentNetwork.showAd()

                const showTime = Date.now() - showStart
                this.analytics.lastShow = {
                    network: networkName,
                    status: "success",
                    time: showTime,
                    timestamp: Date.now()
                }

                console.log("[Mediation] Ad shown successfully from:", networkName, "in", showTime + "ms")
                return result
            } catch (error) {
                const showTime = Date.now() - showStart
                this.analytics.lastShow = {
                    network: networkName,
                    status: "error",
                    error: error.message,
                    time: showTime,
                    timestamp: Date.now()
                }

                console.error("[Mediation] Failed to show ad from " + networkName + ":", error.message)
                throw error
            }
        }

        isReady() {
            return this.currentNetwork !== null && this.currentAd !== null
        }

        getCurrentNetwork() {
            return this.currentNetwork ? this.currentNetwork.getName() : null
        }

        getAnalytics() {
            return this.analytics
        }

        destroy() {
            this.networks.forEach(network => network.destroy())
            this.currentNetwork = null
            this.currentAd = null
        }
    }

    // ============================================
    // TOWER ADS MAIN CLASS
    // ============================================
    function TowerAds(config) {
        this.config = config || {}
        this.apiKey = config.apiKey
        this.placementId = config.placementId
        this.apiBaseUrl = config.apiUrl || window.location.origin + "/api/tower-ads"
        this.currentAd = null
        this.impressionId = null
        this.isLoading = false
        this.isShowing = false
        this.useMediationMode = config.mediation && config.mediation.enabled

        // Callbacks
        this.onAdLoaded = config.onAdLoaded || (() => { })
        this.onAdFailedToLoad = config.onAdFailedToLoad || (() => { })
        this.onAdShown = config.onAdShown || (() => { })
        this.onAdClosed = config.onAdClosed || (() => { })
        this.onAdClicked = config.onAdClicked || (() => { })
        this.onRewardEarned = config.onRewardEarned || (() => { })

        if (!this.apiKey || !this.placementId) {
            console.error("[TowerAds] apiKey and placementId are required")
        }

        // Initialize mediation if enabled
        if (this.useMediationMode) {
            this._initMediation(config)
        }
    }

    TowerAds.prototype._initMediation = function (config) {
        const mediationConfig = config.mediation || {}
        
        this.mediation = new MediationManager({
            waterfall: mediationConfig.waterfall || ["tower"]
        })

        // Always register Tower network first
        const towerAdapter = new TowerNetworkAdapter({
            apiKey: this.apiKey,
            placementId: this.placementId,
            apiUrl: this.apiBaseUrl
        })
        this.mediation.registerNetwork(towerAdapter)

        // Register external networks
        const networks = mediationConfig.networks || {}

        if (networks.telegram) {
            const telegramAdapter = new TelegramAdsAdapter(networks.telegram)
            this.mediation.registerNetwork(telegramAdapter)
        }

        if (networks.monetag) {
            const monetagAdapter = new MonetagAdapter(networks.monetag)
            this.mediation.registerNetwork(monetagAdapter)
        }

        if (networks.yandex) {
            const yandexAdapter = new YandexAdapter(networks.yandex)
            this.mediation.registerNetwork(yandexAdapter)
        }

        // Initialize all networks
        this.mediation.initNetworks().then(() => {
            console.log("[TowerAds] Mediation initialized")
        }).catch((error) => {
            console.warn("[TowerAds] Mediation init warning:", error)
        })
    }

    TowerAds.prototype.loadAd = function () {
        if (this.isLoading) {
            console.warn("[TowerAds] Ad is already loading")
            return Promise.resolve()
        }

        this.isLoading = true

        // Use mediation if enabled
        if (this.useMediationMode && this.mediation) {
            return this.mediation.loadAd(this.placementId)
                .then((result) => {
                    this.isLoading = false
                    this.currentAd = result.ad
                    this.onAdLoaded(result.network)
                    return result
                })
                .catch((error) => {
                    console.error("[TowerAds] Failed to load ad:", error)
                    this.isLoading = false
                    this.onAdFailedToLoad(error)
                    throw error
                })
        }

        // Legacy mode - direct Tower network only
        return fetch(this.apiBaseUrl + "/request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_key: this.apiKey,
                placement_id: this.placementId,
                user_data: {
                    ip: "client",
                    device: this._getDeviceInfo(),
                    os: this._getOS(),
                },
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.ad) {
                    this.currentAd = data.ad
                    this.impressionId = data.impression_id || null

                    // Preload media
                    if (data.ad.ad_type === "rewarded_video") {
                        return this._preloadVideo(data.ad.media_url)
                    } else {
                        return this._preloadImage(data.ad.media_url)
                    }
                } else {
                    throw new Error(data.error || "No ad available")
                }
            })
            .then(() => {
                this.isLoading = false
                this.onAdLoaded("tower")
            })
            .catch((error) => {
                console.error("[TowerAds] Failed to load ad:", error)
                this.isLoading = false
                this.onAdFailedToLoad(error)
                throw error
            })
    }

    TowerAds.prototype.showAd = function () {
        if (!this.currentAd) {
            console.error("[TowerAds] No ad loaded. Call loadAd() first.")
            return Promise.resolve()
        }

        if (this.isShowing) {
            console.warn("[TowerAds] Ad is already showing")
            return Promise.resolve()
        }

        this.isShowing = true
        this.onAdShown()

        // Use mediation if enabled
        if (this.useMediationMode && this.mediation) {
            return this.mediation.showAd()
                .then((result) => {
                    this.isShowing = false
                    this.onAdClosed()
                    
                    // Handle rewards for rewarded ads
                    if (result.completed && result.reward) {
                        this.onRewardEarned(result.reward)
                    } else if (result.completed) {
                        this.onRewardEarned({ amount: 100, item: "coins" })
                    }
                    
                    return result
                })
                .catch((error) => {
                    this.isShowing = false
                    console.error("[TowerAds] Failed to show ad:", error)
                    throw error
                })
        }

        // Legacy mode - direct Tower network only
        if (this.currentAd.ad_type === "rewarded_video") {
            return this._showRewardedVideo()
        } else if (this.currentAd.ad_type === "interstitial") {
            return this._showInterstitial()
        }
    }

    TowerAds.prototype.isReady = function () {
        if (this.useMediationMode && this.mediation) {
            return this.mediation.isReady()
        }
        return this.currentAd !== null && !this.isLoading
    }

    TowerAds.prototype.getCurrentNetwork = function () {
        if (this.useMediationMode && this.mediation) {
            return this.mediation.getCurrentNetwork()
        }
        return "tower"
    }

    TowerAds.prototype.getAnalytics = function () {
        if (this.useMediationMode && this.mediation) {
            return this.mediation.getAnalytics()
        }
        return null
    }

    TowerAds.prototype._showRewardedVideo = function () {


        return new Promise((resolve) => {
            var overlay = document.createElement("div")
            overlay.style.cssText =
                "position:fixed;top:0;left:0;width:100%;height:100%;" +
                "background:rgba(0,0,0,0.95);z-index:999999;" +
                "display:flex;flex-direction:column;align-items:center;justify-content:center;"

            var video = document.createElement("video")
            video.src = this.currentAd.media_url
            video.style.cssText = "max-width:90%;max-height:80%;border-radius:8px;"
            video.controls = false
            video.autoplay = true

            var closeBtn = document.createElement("button")
            closeBtn.textContent = "Skip (5s)"
            closeBtn.style.cssText =
                "margin-top:20px;padding:12px 24px;background:#666;color:white;" +
                "border:none;border-radius:6px;cursor:not-allowed;font-size:16px;opacity:0.5;"
            closeBtn.disabled = true

            overlay.appendChild(video)
            overlay.appendChild(closeBtn)
            document.body.appendChild(overlay)

            // Enable skip after 5 seconds
            setTimeout(() => {
                closeBtn.textContent = "Close"
                closeBtn.style.cursor = "pointer"
                closeBtn.style.background = "#10b981"
                closeBtn.style.opacity = "1"
                closeBtn.disabled = false
            }, 5000)

            // Video ended
            video.addEventListener("ended", () => {
                this._handleAdComplete()
                document.body.removeChild(overlay)
                this.isShowing = false
                this.onAdClosed()
                resolve()
            })

            // Close button clicked
            closeBtn.addEventListener("click", () => {
                if (!closeBtn.disabled) {
                    this._handleAdComplete()
                    document.body.removeChild(overlay)
                    this.isShowing = false
                    this.onAdClosed()
                    resolve()
                }
            })

            // Ad clicked
            video.addEventListener("click", () => {
                this._handleAdClick()
                if (this.currentAd.click_url) {
                    window.open(this.currentAd.click_url, "_blank")
                }
            })
        })
    }

    TowerAds.prototype._showInterstitial = function () {


        return new Promise((resolve) => {
            var overlay = document.createElement("div")
            overlay.style.cssText =
                "position:fixed;top:0;left:0;width:100%;height:100%;" +
                "background:rgba(0,0,0,0.95);z-index:999999;" +
                "display:flex;flex-direction:column;align-items:center;justify-content:center;"

            var img = document.createElement("img")
            img.src = this.currentAd.media_url
            img.style.cssText = "max-width:90%;max-height:80%;border-radius:8px;cursor:pointer;"

            var closeBtn = document.createElement("button")
            closeBtn.textContent = "Close"
            closeBtn.style.cssText =
                "position:absolute;top:20px;right:20px;padding:12px 24px;" +
                "background:#10b981;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px;"

            overlay.appendChild(img)
            overlay.appendChild(closeBtn)
            document.body.appendChild(overlay)

            // Ad clicked
            img.addEventListener("click", () => {
                this._handleAdClick()
                if (this.currentAd.click_url) {
                    window.open(this.currentAd.click_url, "_blank")
                }
            })

            // Close clicked
            closeBtn.addEventListener("click", () => {
                document.body.removeChild(overlay)
                this.isShowing = false
                this.onAdClosed()
                resolve()
            })
        })
    }

    TowerAds.prototype._handleAdComplete = function () {


        if (!this.impressionId) return

        fetch(this.apiBaseUrl + "/complete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                impression_id: this.impressionId,
            }),
        })
            .then(() => {
                if (this.currentAd.ad_type === "rewarded_video") {
                    this.onRewardEarned({
                        amount: 100,
                        item: "coins",
                    })
                }
            })
            .catch((error) => {
                console.error("[TowerAds] Failed to track completion:", error)
            })
    }

    TowerAds.prototype._handleAdClick = function () {


        if (!this.impressionId) return

        fetch(this.apiBaseUrl + "/click", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                impression_id: this.impressionId,
            }),
        })
            .then(() => {
                this.onAdClicked()
            })
            .catch((error) => {
                console.error("[TowerAds] Failed to track click:", error)
            })
    }

    TowerAds.prototype._preloadVideo = (url) =>
        new Promise((resolve, reject) => {
            var video = document.createElement("video")
            video.src = url
            video.preload = "auto"
            video.addEventListener("loadeddata", resolve)
            video.addEventListener("error", reject)
        })

    TowerAds.prototype._preloadImage = (url) =>
        new Promise((resolve, reject) => {
            var img = new Image()
            img.src = url
            img.onload = resolve
            img.onerror = reject
        })

    TowerAds.prototype._getDeviceInfo = () => {
        var ua = navigator.userAgent
        if (/mobile/i.test(ua)) return "mobile"
        if (/tablet/i.test(ua)) return "tablet"
        return "desktop"
    }

    TowerAds.prototype._getOS = () => {
        var ua = navigator.userAgent
        if (/windows/i.test(ua)) return "Windows"
        if (/mac/i.test(ua)) return "MacOS"
        if (/linux/i.test(ua)) return "Linux"
        if (/android/i.test(ua)) return "Android"
        if (/ios|iphone|ipad/i.test(ua)) return "iOS"
        return "Unknown"
    }

    TowerAds.prototype.destroy = function () {
        if (this.useMediationMode && this.mediation) {
            this.mediation.destroy()
        }
        this.currentAd = null
        this.impressionId = null
        this.isLoading = false
        this.isShowing = false
    }

    // Export to global scope
    window.TowerAds = TowerAds
})(window)
