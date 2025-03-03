import { parseURL, withLeadingSlash } from 'ufo';
import { createResolver, useNitro, useNuxt, resolvePath, defineNuxtModule, addImports, addComponent, addTemplate, addPlugin } from '@nuxt/kit';
import { resolve, relative, normalize } from 'pathe';
import { defu } from 'defu';
import { hash } from 'ohash';
import { provider } from 'std-env';

const ipxSetup = (setupOptions) => (providerOptions, moduleOptions) => {
  const resolver = createResolver(import.meta.url);
  const nitro = useNitro();
  const nuxt = useNuxt();
  const ipxBaseURL = providerOptions.options?.baseURL || "/_ipx";
  const hasUserProvidedIPX = nuxt.options.serverHandlers.find((handler) => handler.route?.startsWith(ipxBaseURL)) || nuxt.options.devServerHandlers.find((handler) => handler.route?.startsWith(ipxBaseURL));
  if (hasUserProvidedIPX) {
    return;
  }
  const absoluteDir = resolve(nuxt.options.srcDir, moduleOptions.dir || nuxt.options.dir.public);
  const relativeDir = relative(nitro.options.output.serverDir, nitro.options.output.publicDir);
  const ipxOptions = {
    ...providerOptions.options,
    baseURL: ipxBaseURL,
    alias: {
      ...moduleOptions.alias,
      ...providerOptions.options?.alias
    },
    fs: providerOptions.options?.fs !== false && {
      dir: nuxt.options.dev ? absoluteDir : relativeDir,
      ...providerOptions.options?.fs
    },
    http: providerOptions.options?.http !== false && {
      domains: moduleOptions.domains,
      ...providerOptions.options?.http
    }
  };
  nitro.options._config.runtimeConfig = nitro.options._config.runtimeConfig || {};
  nitro.options.runtimeConfig.ipx = ipxOptions;
  const ipxHandler = {
    route: `${ipxBaseURL}/**`,
    middleware: false,
    handler: resolver.resolve("./runtime/ipx")
  };
  if (!setupOptions?.isStatic) {
    nitro.options.handlers.push(ipxHandler);
  }
  if (!nitro.options.dev) {
    nitro.options._config.runtimeConfig.ipx = defu({ fs: { dir: absoluteDir } }, ipxOptions);
    nitro.options._config.handlers.push(ipxHandler);
  }
};

const BuiltInProviders = [
  "aliyun",
  "awsAmplify",
  "bunny",
  "caisy",
  "cloudflare",
  "cloudimage",
  "cloudinary",
  "contentful",
  "directus",
  "edgio",
  "fastly",
  "glide",
  "gumlet",
  "hygraph",
  "imageengine",
  "imagekit",
  "imgix",
  "ipx",
  "ipxStatic",
  "layer0",
  "netlify",
  "prepr",
  "none",
  "prismic",
  "sanity",
  "storyblok",
  "strapi",
  "twicpics",
  "unsplash",
  "uploadcare",
  "vercel",
  "wagtail",
  "weserv",
  "sirv"
];
const providerSetup = {
  // IPX
  ipx: ipxSetup(),
  ipxStatic: ipxSetup({ isStatic: false }),
  // https://vercel.com/docs/more/adding-your-framework#images
  vercel(_providerOptions, moduleOptions, nuxt) {
    nuxt.options.nitro = defu(nuxt.options.nitro, {
      vercel: {
        config: {
          images: {
            domains: moduleOptions.domains,
            minimumCacheTTL: 60 * 5,
            sizes: Array.from(new Set(Object.values(moduleOptions.screens || {})))
          }
        }
      }
    });
  },
  awsAmplify(_providerOptions, moduleOptions, nuxt) {
    nuxt.options.nitro = defu(nuxt.options.nitro, {
      awsAmplify: {
        imageOptimization: {
          path: "/_amplify/image",
          cacheControl: "public, max-age=300, immutable"
        },
        imageSettings: {
          sizes: Array.from(new Set(Object.values(moduleOptions.screens || {}))),
          formats: ["image/jpeg", "image/png", "image/webp", "image/avif"],
          minimumCacheTTL: 60 * 5,
          domains: moduleOptions.domains,
          remotePatterns: [],
          // Provided by domains
          dangerouslyAllowSVG: false
          // TODO
        }
      }
    });
  }
};
async function resolveProviders(nuxt, options) {
  const providers = [];
  for (const key in options) {
    if (BuiltInProviders.includes(key)) {
      providers.push(await resolveProvider(nuxt, key, { provider: key, options: options[key] }));
    }
  }
  for (const key in options.providers) {
    providers.push(await resolveProvider(nuxt, key, options.providers[key]));
  }
  return providers;
}
async function resolveProvider(_nuxt, key, input) {
  if (typeof input === "string") {
    input = { name: input };
  }
  if (!input.name) {
    input.name = key;
  }
  if (!input.provider) {
    input.provider = input.name;
  }
  const resolver = createResolver(import.meta.url);
  input.provider = BuiltInProviders.includes(input.provider) ? await resolver.resolve("./runtime/providers/" + input.provider) : await resolvePath(input.provider);
  const setup = input.setup || providerSetup[input.name];
  return {
    ...input,
    setup,
    runtime: normalize(input.provider),
    importName: `${key}Runtime$${hash(input.provider)}`,
    runtimeOptions: input.options
  };
}
const autodetectableProviders = {
  vercel: "vercel",
  aws_amplify: "awsAmplify"
};
function detectProvider(userInput = "") {
  if (process.env.NUXT_IMAGE_PROVIDER) {
    return process.env.NUXT_IMAGE_PROVIDER;
  }
  if (userInput && userInput !== "auto") {
    return userInput;
  }
  if (provider in autodetectableProviders) {
    return autodetectableProviders[provider];
  }
}

const module = defineNuxtModule({
  defaults: (nuxt) => ({
    inject: false,
    provider: "auto",
    dir: nuxt.options.dir.public,
    presets: {},
    domains: [],
    sharp: {},
    format: ["webp"],
    // https://tailwindcss.com/docs/breakpoints
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536
    },
    providers: {},
    alias: {},
    densities: [1, 2]
  }),
  meta: {
    name: "@nuxt/image",
    configKey: "image",
    compatibility: {
      nuxt: "^3.1.0"
    }
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    options.dir = resolve(nuxt.options.srcDir, options.dir);
    options.domains = options.domains.map((d) => {
      if (!d.startsWith("http")) {
        d = "http://" + d;
      }
      return parseURL(d).host;
    }).filter(Boolean);
    options.alias = Object.fromEntries(Object.entries(options.alias).map((e) => [withLeadingSlash(e[0]), e[1]]));
    options.provider = detectProvider(options.provider);
    if (options.provider) {
      options[options.provider] = options[options.provider] || {};
    }
    options.densities = options.densities || [];
    const imageOptions = pick(options, [
      "screens",
      "presets",
      "provider",
      "domains",
      "alias",
      "densities",
      "format",
      "quality"
    ]);
    const providers = await resolveProviders(nuxt, options);
    for (const p of providers) {
      if (typeof p.setup === "function" && p.name !== "ipx" && p.name !== "ipxStatic") {
        await p.setup(p, options, nuxt);
      }
    }
    const runtimeDir = resolver.resolve("./runtime");
    nuxt.options.alias["#image"] = runtimeDir;
    nuxt.options.build.transpile.push(runtimeDir);
    addImports({
      name: "useImage",
      from: resolver.resolve("runtime/composables")
    });
    addComponent({
      name: "NuxtImg",
      filePath: resolver.resolve("./runtime/components/nuxt-img")
    });
    addComponent({
      name: "NuxtPicture",
      filePath: resolver.resolve("./runtime/components/nuxt-picture")
    });
    addTemplate({
      filename: "image-options.mjs",
      getContents() {
        return `
${providers.map((p) => `import * as ${p.importName} from '${p.runtime}'`).join("\n")}

export const imageOptions = ${JSON.stringify(imageOptions, null, 2)}

imageOptions.providers = {
${providers.map((p) => `  ['${p.name}']: { provider: ${p.importName}, defaults: ${JSON.stringify(p.runtimeOptions)} }`).join(",\n")}
}
        `;
      }
    });
    nuxt.hook("nitro:init", async (nitro) => {
      if (!options.provider || options.provider === "ipx" || options.provider === "ipxStatic") {
        const resolvedProvider = "ipx";
        imageOptions.provider = options.provider = resolvedProvider;
        options[resolvedProvider] = options[resolvedProvider] || {};
        const p = await resolveProvider(nuxt, resolvedProvider, {
          options: options[resolvedProvider]
        });
        if (!providers.some((p2) => p2.name === resolvedProvider)) {
          providers.push(p);
        }
        if (typeof p.setup === "function") {
          await p.setup(p, options, nuxt);
        }
      }
    });
    if (options.inject) {
      addPlugin({ src: resolver.resolve("./runtime/plugin") });
    }
  }
});
function pick(obj, keys) {
  const newobj = {};
  for (const key of keys) {
    newobj[key] = obj[key];
  }
  return newobj;
}

export { module as default };
