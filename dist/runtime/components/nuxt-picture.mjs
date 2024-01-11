import { h, defineComponent, ref, computed, onMounted } from "vue";
import { prerenderStaticImages } from "../utils/prerender.mjs";
import { useBaseImage, baseImageProps } from "./_base.mjs";
import { useImage, useHead, useNuxtApp } from "#imports";
import { getFileExtension } from "#image";
export const pictureProps = {
  ...baseImageProps,
  legacyFormat: { type: String, default: null },
  imgAttrs: { type: Object, default: null }
};
export default defineComponent({
  name: "NuxtPicture",
  props: pictureProps,
  emits: ["load"],
  setup: (props, ctx) => {
    const $img = useImage();
    const _base = useBaseImage(props);
    const originalFormat = computed(() => getFileExtension(props.src));
    const isTransparent = computed(() => ["png", "webp", "gif", "svg"].includes(originalFormat.value));
    const legacyFormat = computed(() => {
      if (props.legacyFormat) {
        return props.legacyFormat;
      }
      return isTransparent.value ? "png" : "jpeg";
    });
    const sources = computed(() => {
      const formats = props.format?.split(",") || (originalFormat.value === "svg" ? ["svg"] : $img.options.format?.length ? [...$img.options.format] : ["webp"]);
      if (formats[0] === "svg") {
        return [{ src: props.src }];
      }
      if (!formats.includes(legacyFormat.value)) {
        formats.push(legacyFormat.value);
      } else {
        formats.splice(formats.indexOf(legacyFormat.value), 1);
        formats.push(legacyFormat.value);
      }
      return formats.map((format) => {
        const { srcset, sizes, src } = $img.getSizes(props.src, {
          ..._base.options.value,
          sizes: props.sizes || $img.options.screens,
          densities: props.densities,
          modifiers: { ..._base.modifiers.value, format }
        });
        return { src, type: `image/${format}`, sizes, srcset };
      });
    });
    const lastSourceIndex = computed(() => sources.value.length - 1);
    if (props.preload) {
      const link = {
        rel: "preload",
        as: "image",
        imagesrcset: sources.value[0].srcset,
        nonce: props.nonce
      };
      if (sources.value?.[0]?.sizes) {
        link.imagesizes = sources.value[0].sizes;
      }
      useHead({ link: [link] });
    }
    const imgAttrs = { ...props.imgAttrs, "data-nuxt-pic": "" };
    for (const key in ctx.attrs) {
      if (key in baseImageProps && !(key in imgAttrs)) {
        imgAttrs[key] = ctx.attrs[key];
      }
    }
    const imgEl = ref();
    if (process.server && process.env.prerender) {
      for (const src of sources.value) {
        prerenderStaticImages(src.src, src.srcset);
      }
    }
    const nuxtApp = useNuxtApp();
    const initialLoad = nuxtApp.isHydrating;
    onMounted(() => {
      if (!imgEl.value) {
        return;
      }
      if (imgEl.value.complete && initialLoad && !imgEl.value.getAttribute("data-error")) {
        ctx.emit("load", new Event("load"));
      }
      imgEl.value.onload = (event) => {
        ctx.emit("load", event);
      };
    });
    return () => h("picture", null, [
      ...sources.value.slice(0, -1).map((source) => {
        return h("source", {
          type: source.type,
          sizes: source.sizes,
          srcset: source.srcset
        });
      }),
      h("img", {
        ref: imgEl,
        ..._base.attrs.value,
        ...process.server ? { onerror: "this.setAttribute('data-error', 1)" } : {},
        ...imgAttrs,
        src: sources.value[lastSourceIndex.value].src,
        sizes: sources.value[lastSourceIndex.value].sizes,
        srcset: sources.value[lastSourceIndex.value].srcset
      })
    ]);
  }
});
