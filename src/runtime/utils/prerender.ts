import type { H3Event } from 'h3'

export function prerenderStaticImages(_src = '', _srcset = '', _event?: H3Event) {
  // Disabled in this fork: IPX images are never statically prerendered.
}
