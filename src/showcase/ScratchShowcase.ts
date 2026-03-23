import AbstractShowcase from './AbstractShowcase';
import type ShowcaseMetadata from './ShowcaseMetadata';

export default class ScratchShowcase extends AbstractShowcase {
  constructor(
    public projectId: number,
    public turbowarp: boolean,
    metadata: ShowcaseMetadata,
  ) {
    super('scratch', metadata);
  }

  public getComponent() {
    return () => import('./ScratchShowcaseComp.vue');
  }

  public getEmbedUrl(): string {
    if (this.turbowarp) {
      return `https://turbowarp.org/${this.projectId}/embed?settings-button`;
    } else {
      return `https://scratch.mit.edu/projects/${this.projectId}/embed`;
    }
  }
}
