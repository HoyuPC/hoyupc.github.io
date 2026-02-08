import BaseShowcase from './BaseShowcase';
import type ShowcaseMetadata from './ShowcaseMetadata';

export default class LinkShowcase extends BaseShowcase {
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
