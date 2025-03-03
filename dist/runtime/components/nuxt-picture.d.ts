export declare const pictureProps: {
    legacyFormat: {
        type: StringConstructor;
        default: null;
    };
    imgAttrs: {
        type: ObjectConstructor;
        default: null;
    };
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
        type: () => "lazy" | "eager";
        default: undefined;
        validator: (val: any) => boolean;
    };
    crossorigin: {
        type: () => boolean | "anonymous" | "use-credentials";
        default: undefined;
        validator: (val: any) => boolean;
    };
    decoding: {
        type: () => "auto" | "async" | "sync";
        default: undefined;
        validator: (val: any) => boolean;
    };
    nonce: {
        type: StringConstructor[];
        default: undefined;
    };
};
declare const _default: import("vue").DefineComponent<{
    legacyFormat: {
        type: StringConstructor;
        default: null;
    };
    imgAttrs: {
        type: ObjectConstructor;
        default: null;
    };
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
        type: () => "lazy" | "eager";
        default: undefined;
        validator: (val: any) => boolean;
    };
    crossorigin: {
        type: () => boolean | "anonymous" | "use-credentials";
        default: undefined;
        validator: (val: any) => boolean;
    };
    decoding: {
        type: () => "auto" | "async" | "sync";
        default: undefined;
        validator: (val: any) => boolean;
    };
    nonce: {
        type: StringConstructor[];
        default: undefined;
    };
}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "load"[], "load", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    legacyFormat: {
        type: StringConstructor;
        default: null;
    };
    imgAttrs: {
        type: ObjectConstructor;
        default: null;
    };
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
        type: () => "lazy" | "eager";
        default: undefined;
        validator: (val: any) => boolean;
    };
    crossorigin: {
        type: () => boolean | "anonymous" | "use-credentials";
        default: undefined;
        validator: (val: any) => boolean;
    };
    decoding: {
        type: () => "auto" | "async" | "sync";
        default: undefined;
        validator: (val: any) => boolean;
    };
    nonce: {
        type: StringConstructor[];
        default: undefined;
    };
}>> & {
    onLoad?: ((...args: any[]) => any) | undefined;
}, {
    width: string | number;
    height: string | number;
    fit: string;
    format: string;
    provider: string;
    preset: string;
    densities: string;
    modifiers: Record<string, any>;
    sizes: string | Record<string, any>;
    quality: string | number;
    preload: boolean;
    background: string;
    alt: string;
    referrerpolicy: string;
    usemap: string;
    longdesc: string;
    ismap: boolean;
    loading: "lazy" | "eager";
    crossorigin: boolean | "anonymous" | "use-credentials";
    decoding: "auto" | "async" | "sync";
    nonce: string;
    legacyFormat: string;
    imgAttrs: Record<string, any>;
}, {}>;
export default _default;
