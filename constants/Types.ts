
export type ThemeId = 'dark' | 'light' | 'sepia' | 'navy';

export interface Sound {
    id: string;
    name: string;
    icon: string;
    file: any; // require() returns numbers in RN
}

export interface Playlist {
    id: string;
    name: string;
    icon: string;
    mix: Record<string, number>;
}
