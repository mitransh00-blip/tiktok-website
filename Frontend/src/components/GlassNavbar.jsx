export default function GlassNavbar(){
    return (
        <div className="fixed top-0 left-0 w-fll z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
            <h1 className="text-white font-bold text-xl tracking-wide">MITRANSH</h1>
            <div className="flex gap-4 text-sm text-gray-300">
                <button>Explore</button>
                <button>Sell</button>
                <button>Profile</button>
                </div>
            </div>
        </div>    
    );
}