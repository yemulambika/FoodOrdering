import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const MAX_CONTENT_WIDTH = 1200;
const HORIZONTAL_PADDING = 16;
const GAP = 12;
/** Minimum card width before adding another column */
const MIN_CARD_WIDTH = 168;

export type ResponsiveGridConfig = {
  screenWidth: number;
  containerWidth: number;
  contentWidth: number;
  numColumns: number;
  cardWidth: number;
  gap: number;
  padding: number;
  titleFontSize: number;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export function useResponsiveGrid(): ResponsiveGridConfig {
  const { width: screenWidth } = useWindowDimensions();

  return useMemo(() => {
    const containerWidth = Math.min(screenWidth, MAX_CONTENT_WIDTH);
    const contentWidth = containerWidth - HORIZONTAL_PADDING * 2;

    let numColumns = Math.floor(
      (contentWidth + GAP) / (MIN_CARD_WIDTH + GAP)
    );
    numColumns = Math.max(2, Math.min(numColumns, 5));

    const cardWidth =
      (contentWidth - GAP * (numColumns - 1)) / numColumns;

    const isPhone = screenWidth < 600;
    const isTablet = screenWidth >= 600 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;

    return {
      screenWidth,
      containerWidth,
      contentWidth,
      numColumns,
      cardWidth,
      gap: GAP,
      padding: HORIZONTAL_PADDING,
      titleFontSize: cardWidth < 155 ? 14 : cardWidth < 200 ? 15 : 16,
      isPhone,
      isTablet,
      isDesktop,
    };
  }, [screenWidth]);
}
