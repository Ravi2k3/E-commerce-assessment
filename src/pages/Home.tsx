import Antigravity from '../components/Antigravity';
import { Button } from '../components/ui/button';

export default function Home() {
    return (
        <div className="h-screen w-screen bg-[#0a0a0a] overflow-hidden">
            {/* Full Page Antigravity Effect */}
            <div className="absolute inset-0">
                <Antigravity
                    count={300}
                    magnetRadius={6}
                    ringRadius={7}
                    waveSpeed={0.4}
                    waveAmplitude={1}
                    particleSize={1.5}
                    lerpSpeed={0.05}
                    color="#5227FF"
                    autoAnimate
                    particleVariance={1}
                    rotationSpeed={0}
                    depthFactor={1}
                    pulseSpeed={3}
                    particleShape="capsule"
                    fieldStrength={10}
                />
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pointer-events-none">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-center">
                    Hello World! 👋
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-neutral-400 mb-8 text-center max-w-xl">
                    shadcn + ReactBits working perfectly!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
                    <Button size="lg" className="text-base px-8 bg-[#5227FF] hover:bg-[#6b3fff] text-white">Get Started</Button>
                    <Button size="lg" variant="ghost" className="text-base px-8 text-neutral-300 hover:text-white hover:bg-white/10">
                        Learn More
                    </Button>
                </div>

                <p className="absolute bottom-8 text-sm text-neutral-500 text-center">
                    Move your mouse to interact with the particles ✨
                </p>
            </div>
        </div>
    );
}
