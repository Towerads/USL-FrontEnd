'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';

// ============== TYPES ==============
interface TowerAdsConfig {
    apiKey: string;
    placementId: string;
    apiUrl?: string;
    logoUrl?: string;
    adFrameUrl?: string;
    testProvider?: string | null;
}

interface TowerAdsInstance {
    loadAd: () => Promise<any>;
    showAd: () => Promise<any>;
    loadAndShow: () => Promise<any>;
    setTestProvider: (provider: string | null) => void;
    isLoading: () => boolean;
    isShowing: () => boolean;
    getProvider: () => string | null;
    reset: () => void;
}

interface Reward {
    amount: number;
    item: string;
    provider: string;
}

// ============== HOOK ==============
export function useTowerAds(config: TowerAdsConfig) {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowing, setIsShowing] = useState(false);
    const [provider, setProvider] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [lastReward, setLastReward] = useState<Reward | null>(null);
    
    const adsRef = useRef<TowerAdsInstance | null>(null);

    const initAds = useCallback(() => {
        if (typeof window === 'undefined' || !(window as any).TowerAds) return;
        
        adsRef.current = new (window as any).TowerAds({
            ...config,
            onProviderSelected: (p: string) => setProvider(p),
            onAdLoaded: () => setIsLoading(false),
            onAdShown: () => setIsShowing(true),
            onAdClosed: () => setIsShowing(false),
            onRewardEarned: (reward: Reward) => setLastReward(reward),
            onError: (err: Error) => setError(err),
        });
        
        setIsReady(true);
    }, [config]);

    const loadAndShow = useCallback(async () => {
        if (!adsRef.current) return;
        setError(null);
        setIsLoading(true);
        try {
            return await adsRef.current.loadAndShow();
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const setTestProvider = useCallback((p: string | null) => {
        adsRef.current?.setTestProvider(p);
    }, []);

    return {
        isReady,
        isLoading,
        isShowing,
        provider,
        error,
        lastReward,
        loadAndShow,
        setTestProvider,
        initAds,
        ads: adsRef.current,
    };
}

// ============== EXAMPLE COMPONENT ==============
export default function TowerAdsExample() {
    const [status, setStatus] = useState('Готов к работе');
    const [statusColor, setStatusColor] = useState('#e8f5e9');
    const [currentProvider, setCurrentProvider] = useState<string | null>(null);
    
    const {
        isReady,
        isLoading,
        provider,
        lastReward,
        error,
        loadAndShow,
        setTestProvider,
        initAds,
    } = useTowerAds({
        apiKey: 'tower_test_123',
        placementId: 'main',
        apiUrl: 'https://towerads-backend.onrender.com/api/tower-ads',
        logoUrl: '/USL.png',
    });

    // Update status on events
    useEffect(() => {
        if (provider) {
            setStatus(`🎯 Провайдер: ${provider}`);
            setStatusColor('#e3f2fd');
        }
    }, [provider]);

    useEffect(() => {
        if (lastReward) {
            setStatus(`🎁 Награда от ${lastReward.provider}: ${lastReward.amount} ${lastReward.item}`);
            setStatusColor('#e8f5e9');
        }
    }, [lastReward]);

    useEffect(() => {
        if (error) {
            setStatus(`❌ Ошибка: ${error.message}`);
            setStatusColor('#ffebee');
        }
    }, [error]);

    const handleLoadAndShow = async () => {
        setStatus('🔄 Загрузка...');
        setStatusColor('#fff3e0');
        try {
            await loadAndShow();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetProvider = (p: string | null) => {
        setTestProvider(p);
        setCurrentProvider(p);
        setStatus(`🧪 Провайдер: ${p || 'AUTO'}`);
        setStatusColor('#e3f2fd');
    };

    return (
        <>
            {/* Load SDK script */}
            <Script 
                src="/tower-ads-v3.js" 
                onLoad={initAds}
                strategy="afterInteractive"
            />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-5">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-xl w-full">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                        🎬 Tower Ads
                    </h1>
                    <p className="text-center text-indigo-500 font-semibold text-sm mb-8">
                        v3.1 - Next.js Integration
                    </p>

                    {/* Main button */}
                    <button
                        onClick={handleLoadAndShow}
                        disabled={!isReady || isLoading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-5 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                    >
                        {isLoading ? '⏳ Загрузка...' : '🚀 Load & Show'}
                    </button>

                    {/* Provider selector */}
                    <div className="bg-indigo-50 p-4 rounded-xl mb-5">
                        <p className="font-semibold text-indigo-600 mb-3">🧪 Тест провайдера:</p>
                        <div className="flex flex-wrap gap-2">
                            {[null, 'tower', 'adsonar', 'adexium', 'nygma', 'tads'].map((p) => (
                                <button
                                    key={p || 'auto'}
                                    onClick={() => handleSetProvider(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        currentProvider === p
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-indigo-100'
                                    }`}
                                >
                                    {p?.toUpperCase() || 'AUTO'}
                                </button>
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm mt-3">
                            Текущий: {currentProvider?.toUpperCase() || 'AUTO (с бэкенда)'}
                        </p>
                    </div>

                    {/* Status */}
                    <div 
                        className="p-4 rounded-xl text-sm mb-5"
                        style={{ backgroundColor: statusColor }}
                    >
                        {status}
                    </div>

                    {/* Features */}
                    <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-5 rounded-xl">
                        <h3 className="text-indigo-600 font-semibold mb-3">✨ Возможности v3.1</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>● <strong>Mediation</strong> - tower, adsonar, adexium, nygma, tads</li>
                            <li>● <strong>Anti-spam</strong> - блокировка повторных запросов</li>
                            <li>● <strong>Loading Screen</strong> - с лого пока грузится</li>
                            <li>● <strong>Iframe proxy</strong> - для партнёрских SDK</li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-5 text-sm text-yellow-800">
                        <strong className="block mb-1">💡 Как использовать:</strong>
                        Импортируй <code className="bg-yellow-100 px-1 rounded">useTowerAds</code> хук или используй компонент напрямую.
                    </div>
                </div>
            </div>
        </>
    );
}
