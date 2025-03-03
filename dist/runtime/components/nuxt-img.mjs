import { h, defineComponent, ref, computed, onMounted } from "vue";
import { useImage } from "../composables.mjs";
import { parseSize } from "../utils/index.mjs";
import { baseImageProps, useBaseImage } from "./_base.mjs";
import { useHead, useNuxtApp } from "#imports";
export const imgProps = {
  ...baseImageProps,
  placeholder: { type: [Boolean, String, Number, Array], default: void 0 }
};
export default defineComponent({
  name: "NuxtImg",
  props: imgProps,
  emits: ["load", "error"],
  setup: (props, ctx) => {
    const $img = useImage();
    const _base = useBaseImage(props);
    const placeholderLoaded = ref(false);
    const sizes = computed(() => $img.getSizes(props.src, {
      ..._base.options.value,
      sizes: props.sizes,
      densities: props.densities,
      modifiers: {
        ..._base.modifiers.value,
        width: parseSize(props.width),
        height: parseSize(props.height)
      }
    }));
    const attrs = computed(() => {
      const attrs2 = { ..._base.attrs.value, "data-nuxt-img": "" };
      if (!props.placeholder || placeholderLoaded.value) {
        attrs2.sizes = sizes.value.sizes;
        attrs2.srcset = sizes.value.srcset;
      }
      return attrs2;
    });
    const placeholder = computed(() => {
      let placeholder2 = props.placeholder;
      if (placeholder2 === "") {
        placeholder2 = true;
      }
      if (!placeholder2 || placeholderLoaded.value) {
        return false;
      }
      if (typeof placeholder2 === "string") {
        return placeholder2;
      }
      const size = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2, placeholder2] : [10, 10];
      return $img(props.src, {
        ..._base.modifiers.value,
        width: size[0],
        height: size[1],
        quality: size[2] || 50,
        blur: size[3] || 3
      }, _base.options.value);
    });
    const mainSrc = computed(
      () => props.sizes ? sizes.value.src : $img(props.src, _base.modifiers.value, _base.options.value)
    );
    const src = computed(() => placeholder.value ? placeholder.value : mainSrc.value);
    if (props.preload) {
      const isResponsive = Object.values(sizes.value).every((v) => v);
      useHead({
        link: [{
          rel: "preload",
          as: "image",
          nonce: props.nonce,
          ...!isResponsive ? { href: src.value } : {
            href: sizes.value.src,
            imagesizes: sizes.value.sizes,
            imagesrcset: sizes.value.srcset
          }
        }]
      });
    }
    const imgEl = ref();
    const nuxtApp = useNuxtApp();
    const initialLoad = nuxtApp.isHydrating;
    onMounted(() => {
      if (placeholder.value) {
        const img = new Image();
        img.src = mainSrc.value;
        if (props.sizes) {
          img.sizes = sizes.value.sizes || "";
          img.srcset = sizes.value.srcset;
        }
        img.onload = (event) => {
          placeholderLoaded.value = true;
          ctx.emit("load", event);
        };
        return;
      }
      if (!imgEl.value) {
        return;
      }
      if (imgEl.value.complete && initialLoad) {
        if (imgEl.value.getAttribute("data-error")) {
          ctx.emit("error", new Event("error"));
        } else {
          ctx.emit("load", new Event("load"));
        }
      }
      imgEl.value.onload = (event) => {
        ctx.emit("load", event);
      };
      imgEl.value.onerror = (event) => {
        ctx.emit("error", event);
      };
    });
    return () => h("img", {
      ref: imgEl,
      src: src.value,
      ...process.server ? { onerror: "this.setAttribute('data-error', 1)" } : {},
      ...attrs.value,
      ...ctx.attrs
    });
  }
});
