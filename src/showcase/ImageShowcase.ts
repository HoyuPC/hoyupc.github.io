import AbstractShowcase from './AbstractShowcase';
import type ShowcaseMetadata from './ShowcaseMetadata';

export default class ImageShowcase extends AbstractShowcase {
  constructor(
    public imageSrc: string,
    metadata: ShowcaseMetadata,
  ) {
    super('image', metadata);
  }

  public getComponent() {
    return () => import('./ImageShowcaseComp.vue');
  }
}
