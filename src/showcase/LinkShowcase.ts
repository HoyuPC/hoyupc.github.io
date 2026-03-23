import AbstractShowcase from './AbstractShowcase';
import type ShowcaseMetadata from './ShowcaseMetadata';

export default class LinkShowcase extends AbstractShowcase {
  constructor(
    public href: string,
    metadata: ShowcaseMetadata,
  ) {
    super('link', metadata);
  }

  public getComponent() {
    return () => import('./LinkShowcaseComp.vue');
  }
}
