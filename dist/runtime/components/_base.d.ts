import type { ExtractPropTypes } from 'vue';
export declare const baseImageProps: {
    src: {
        type: StringConstructor;
        required: boolean;
    };
    format: {
        type: StringConstructor;
        default: undefined;
    };
    quality: {
        type: (StringConstructor | NumberConstructor)[];
        default: undefined;
    };
    background: {
        type: StringConstructor;
        default: undefined;
    };
    fit: {
        type: StringConstructor;
        default: undefined;
    };
    modifiers: {
        type: () => Record<string, any>;
        default: undefined;
    };
    preset: {
        type: StringConstructor;
        default: undefined;
    };
    provider: {
        type: StringConstructor;
        default: undefined;
    };
    sizes: {
        type: () => string | Record<string, any>;
        default: undefined;
    };
    densities: {
        type: StringConstructor;
        default: undefined;
    };
    preload: {
        type: BooleanConstructor;
        default: undefined;
    };
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: undefined;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: undefined;
    };
    alt: {
        type: StringConstructor;
        default: undefined;
    };
    referrerpolicy: {
        type: StringConstructor;
        default: undefined;
    };
    usemap: {
        type: StringConstructor;
        default: undefined;
    };
    longdesc: {
        type: StringConstructor;
        default: undefined;
    };
    ismap: {
        type: BooleanConstructor;
        default: undefined;
    };
    loading: {
        type: () => 'lazy' | 'eager';
        default: undefined;
        validator: (val: any) => boolean;
    };
    crossorigin: {
        type: () => 'anonymous' | 'use-credentials' | boolean;
        default: undefined;
        validator: (val: any) => boolean;
    };
    decoding: {
        type: () => 'async' | 'auto' | 'sync';
        default: undefined;
        validator: (val: any) => boolean;
    };
    nonce: {
        type: StringConstructor[];
        default: undefined;
    };
};
export interface BaseImageAttrs {
    width?: number;
    height?: number;
    alt?: string;
    referrerpolicy?: string;
    usemap?: string;
    longdesc?: string;
    ismap?: boolean;
    crossorigin?: '' | 'anonymous' | 'use-credentials';
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'auto' | 'sync';
    nonce?: string;
}
export interface BaseImageModifiers {
    width?: number;
    height?: number;
    format?: string;
    quality?: string | number;
    background?: string;
    fit?: string;
    [key: string]: any;
}
export declare const useBaseImage: (props: ExtractPropTypes<typeof baseImageProps>) => {
    options: import("vue").ComputedRef<{
        provider: string | undefined;
        preset: string | undefined;
    }>;
    attrs: import("vue").ComputedRef<BaseImageAttrs>;
    modifiers: import("vue").ComputedRef<BaseImageModifiers>;
};
