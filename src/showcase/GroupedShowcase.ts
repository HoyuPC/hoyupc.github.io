import AbstractShowcase from './AbstractShowcase';
import type ShowcaseMetadata from './ShowcaseMetadata';

export default class GroupedShowcase extends AbstractShowcase {
  constructor(
    public children: AbstractShowcase[],
    metadata: ShowcaseMetadata,
  ) {
    super('grouped', metadata);
  }

  public getComponent(): () => any {
    return () => undefined;
  }
}
