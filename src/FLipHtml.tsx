import {useEffect, useState, useCallback, useMemo, useRef} from "react";
import {ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight} from "lucide-react";
import HTMLFlipBook from "react-pageflip";

import mainbg from "./assets/mirdoner.webp";

// Optimized image URLs
const bookImages = [
  "https://324rfedcsx.sirv.com/mir-doner/00.jpg",
  "https://324rfedcsx.sirv.com/mir-doner/001.jpg",
  "https://324rfedcsx.sirv.com/mir-doner/002.jpg",
  "https://324rfedcsx.sirv.com/mir-doner/003.jpg",
  "https://324rfedcsx.sirv.com/mir-doner/004.jpg",
  "https://324rfedcsx.sirv.com/mir-doner/00.jpg"
];

function MirDoner() {
    const [page, setPage] = useState(0);
    const [zoom, setZoom] = useState(1.0);
    const [isMobile, setIsMobile] = useState(false);

    const bookRef = useRef<any>(null);

    const checkMobile = useCallback(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        setZoom(mobile ? 1.4 : 1.6);
    }, []);

    useEffect(() => {
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [checkMobile]);

    const zoomIn = useCallback(() =>
        setZoom((z) => Math.min(z + 0.2, isMobile ? 2.5 : 3)), [isMobile]);

    const zoomOut = useCallback(() =>
        setZoom((z) => Math.max(z - 0.2, 0.5)), []);

    const resetZoom = useCallback(() =>
        setZoom(isMobile ? 1.4 : 1.6), [isMobile]);

    const progress = useMemo(() =>
        Math.round(((page + 1) / bookImages.length) * 100), [page]);

    const bookDimensions = useMemo(() => ({
        width: isMobile ? 300 : 400,
        height: isMobile ? 430 : 600
    }), [isMobile]);

    const flipPrev = () => {
        if (bookRef.current) {
            bookRef.current.pageFlip().flipPrev();
        }
    };

    const flipNext = () => {
        if (bookRef.current) {
            bookRef.current.pageFlip().flipNext();
        }
    };

    return (
        <div
            className="min-h-dvh md:min-h-screen flex flex-col"
            style={{
                backgroundImage: `url('${mainbg}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Header */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-700 p-3 md:p-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="text-center flex items-center justify-center"><h1 className="text-white relative font-bold text-md md:text-lg">Mir Doner</h1>
                        <span className="text-[10px] top-10 md:flex hidden absolute text-white">RESTAURANT</span>
                    </div>
                    {/* Zoom Controls */}
                    <div className="flex items-center space-x-1 md:space-x-2">
                        <button onClick={zoomOut}
                                className="p-1.5 md:p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                            <ZoomOut className="w-3 h-3 md:w-4 md:h-4"/>
                        </button>
                        <span className="text-gray-300 text-xs md:text-sm px-1 md:px-2">
              {Math.round(zoom * 100)}%
            </span>
                        <button onClick={zoomIn}
                                className="p-1.5 md:p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                            <ZoomIn className="w-3 h-3 md:w-4 md:h-4"/>
                        </button>
                        <button onClick={resetZoom}
                                className="p-1.5 md:p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                            <RotateCcw className="w-3 h-3 md:w-4 md:h-4"/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Book Viewer */}
            <div className="flex-1 flex items-center justify-center p-2 md:p-6 overflow-hidden relative">
                {/* Left Button */}
                <button
                    onClick={flipPrev}
                    className="absolute left-2 md:left-6 z-20 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
                >
                    <ChevronLeft className="w-10 h-10 text-white"/>
                </button>

                <div className="transition-transform duration-300" style={{transform: `scale(${zoom})`}}>
                    <HTMLFlipBook
                        ref={bookRef}
                        width={bookDimensions.width}
                        height={bookDimensions.height}
                        size="stretch"
                        minWidth={280}
                        maxWidth={600}
                        minHeight={400}
                        maxHeight={800}
                        drawShadow
                        showCover
                        flippingTime={600}
                        mobileScrollSupport
                        className="shadow-xl"
                        onFlip={(e) => setPage(e.data)}
                        style={{margin: "0 auto"}}
                        startPage={0}
                        usePortrait={true}
                        startZIndex={0}
                        autoSize={false}
                        maxShadowOpacity={0.5}
                        showPageCorners={true}
                        disableFlipByClick={false}
                        useMouseEvents={true}
                        swipeDistance={30}
                        clickEventForward={true}
                    >
                        {bookImages.map((src, i) => (
                            <div key={i} className="bg-white w-full h-full flex items-center justify-center">
                                <img src={src} alt={`page-${i + 1}`} className="w-full h-full"/>
                            </div>
                        ))}
                    </HTMLFlipBook>
                </div>

                {/* Right Button */}
                <button
                    onClick={flipNext}
                    className="absolute right-2 md:right-6 z-20 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
                >
                    <ChevronRight className="w-10 h-10 text-white"/>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border-t border-gray-700 p-2 md:p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center space-x-2 md:space-x-4">
                        <span className="text-gray-300 text-xs md:text-sm">Progress:</span>
                        <div className="flex-1 max-w-md bg-gray-700 rounded-full h-1.5 md:h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-900 to-amber-700 transition-all duration-300"
                                style={{width: `${progress}%`}}
                            />
                        </div>
                        <span className="text-gray-300 text-xs md:text-sm">
              {progress}%
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MirDoner;
