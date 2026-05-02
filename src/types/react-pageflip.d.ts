declare module 'react-pageflip' {
  import { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';

  interface HTMLFlipBookProps {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    className?: string;
    style?: React.CSSProperties;
    startPage?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    startZIndex?: number;
    autoSize?: boolean;
    clickEventForward?: boolean;
    usePortrait?: boolean;
    swipeDistance?: number;
    children?: ReactNode;
    onFlip?: (e: { data: number }) => void;
    onChangeOrientation?: (e: { data: string }) => void;
    onChangeState?: (e: { data: string }) => void;
    onInit?: () => void;
  }

  const HTMLFlipBook: ForwardRefExoticComponent<HTMLFlipBookProps & RefAttributes<unknown>>;
  export default HTMLFlipBook;
}
