import { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const MENU_IMAGES = [
  '/1 (1).png',
  '/2 (1).png',
  '/3 (1).png',
  '/4.png',
  '/5.png',
  '/6.png',
  '/7.png',
  '/8.png',
  '/9.png',
];

type BookMode = 'single' | 'double';

type PageFlipApi = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
  } | undefined;
};

export default function MenuBook() {
  const bookRef = useRef<PageFlipApi | null>(null);
  const [mode, setMode] = useState<BookMode>(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches ? 'single' : 'double'
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 700px)');
    const updateMode = () => setMode(mobileQuery.matches ? 'single' : 'double');

    updateMode();
    mobileQuery.addEventListener('change', updateMode);
    return () => mobileQuery.removeEventListener('change', updateMode);
  }, []);

  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const flipNext = () => bookRef.current?.pageFlip()?.flipNext();
  const isSingle = mode === 'single';

  return (
    <div className={`menu-book-wrapper menu-book-wrapper--${mode}`}>
      <HTMLFlipBook
        key={mode}
        ref={bookRef as never}
        width={360}
        height={509}
        size="stretch"
        minWidth={260}
        maxWidth={isSingle ? 430 : 400}
        minHeight={368}
        maxHeight={isSingle ? 608 : 570}
        showCover={false}
        mobileScrollSupport={true}
        usePortrait={isSingle}
        startPage={0}
        drawShadow={false}
        flippingTime={500}
        className="menu-flipbook"
      >
        {MENU_IMAGES.map((src, i) => (
          <div key={i} className="menu-page">
            <img
              src={src}
              alt={`Menu page ${i + 1}`}
              className="menu-page-img"
              draggable={false}
            />
          </div>
        ))}
      </HTMLFlipBook>
      <div className="menu-book-controls" aria-label="Menu book controls">
        <button type="button" className="menu-book-arrow" onClick={flipPrev} aria-label="Previous menu page">‹</button>
        <div className="menu-book-view-toggle" role="group" aria-label="Menu page view">
          <button
            type="button"
            className={isSingle ? 'active' : ''}
            onClick={() => setMode('single')}
          >
            Single
          </button>
          <button
            type="button"
            className={!isSingle ? 'active' : ''}
            onClick={() => setMode('double')}
          >
            Two page
          </button>
        </div>
        <button type="button" className="menu-book-arrow" onClick={flipNext} aria-label="Next menu page">›</button>
      </div>
    </div>
  );
}
