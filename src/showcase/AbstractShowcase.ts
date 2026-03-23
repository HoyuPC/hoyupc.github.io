import type ShowcaseMetadata from './ShowcaseMetadata';

export default abstract class AbstractShowcase {
  constructor(
    public type: string,
    public metadata: ShowcaseMetadata,
  ) {}

  public abstract getComponent(): () => any;
}
