
import { compressText } from './compression';

const BASE_URL = 'https://midgenlabs.com/focus-editor';
const HASH_PREFIX = '#v1:';

export const generateShareUrl = (text: string): string => {
    try {
        const compressed = compressText(text);
        return `${BASE_URL}${HASH_PREFIX}${compressed}`;
    } catch (error) {
        console.error('Failed to generate share URL:', error);
        return BASE_URL;
    }
};
