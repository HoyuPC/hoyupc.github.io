export default class ShowcaseMetadata {
  constructor(
    public name: string,
    public id: string,
    public category: string,
    public flags: string[],
    public tags: string[],
    public version: string | undefined,
    public thumbnailSrc: string,
    public hidden: boolean,
  ) {}
}
