import AbstractShowcase from './AbstractShowcase';
import ShowcaseMetadata from './ShowcaseMetadata';

class NotFoundShowcase extends AbstractShowcase {
  constructor() {
    super(
      'not_found',
      new ShowcaseMetadata('Error', '_error', '', [], [], undefined, './default_thumbnail.webp', 'hidden', undefined),
    );
  }

  public getComponent() {
    return () => import('./NotFoundShowcaseComp.vue');
  }
}

export default new NotFoundShowcase();
