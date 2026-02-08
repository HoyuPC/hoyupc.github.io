import BaseShowcase from './BaseShowcase';
import type ShowcaseMetadata from './ShowcaseMetadata';

export default class EmbedShowcase extends BaseShowcase {
  constructor(
    public src: string,
    metadata: ShowcaseMetadata,
  ) {
    super('embed', metadata);
  }

  public getComponent() {
    return () => import('./EmbedShowcaseComp.vue');
  }
}
