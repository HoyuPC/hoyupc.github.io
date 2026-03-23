import AbstractShowcase from './AbstractShowcase';
import type ShowcaseMetadata from './ShowcaseMetadata';

export default class EmbedShowcase extends AbstractShowcase {
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
