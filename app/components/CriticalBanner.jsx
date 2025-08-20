import { AlertTriangle, Crown, ArrowRight } from 'lucide-react';

function CriticalBanner({ onSubscribeClick }) {

    // Render V01
    return (
        <div className="mt-36 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 p-5 text-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
                <div className="flex items-center gap-4">
                    <AlertTriangle className="h-8 w-8 flex-shrink-0" />
                    <div>
                        <h3 className="text-lg font-semibold">You have no active subscription</h3>
                        <p className="text-sm opacity-90">
                            Subscribe to unlock real-time tracking and exclusive VIP features.
                        </p>
                    </div>
                </div>
                <button
                    onClick={onSubscribeClick}
                    className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-purple-600 shadow transition-transform hover:scale-105"
                >
                    <Crown className="h-4 w-4" />
                    <span>Unlock Premium</span>
                </button>
            </div>
        </div>
    );
}

export default CriticalBanner;