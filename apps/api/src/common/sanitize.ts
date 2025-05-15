import { Transform } from 'class-transformer';

export function Trim() {
    return Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));
}

export function Escape() {
    return Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    });
}