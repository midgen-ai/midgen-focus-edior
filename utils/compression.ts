
import LZString from 'lz-string';

export const compressText = (text: string): string => {
    if (!text) return '';
    try {
        return LZString.compressToEncodedURIComponent(text);
    } catch (error) {
        console.error('Compression failed:', error);
        return '';
    }
};

export const decompressText = (compressed: string): string => {
    if (!compressed) return '';
    try {
        return LZString.decompressFromEncodedURIComponent(compressed) || '';
    } catch (error) {
        console.error('Decompression failed:', error);
        return '';
    }
};
