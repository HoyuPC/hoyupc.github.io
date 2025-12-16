import type BaseShowcase from './BaseShowcase';
import EmbedShowcase from './EmbedShowcase';
import GroupedShowcase from './GroupedShowcase';
import ImageShowcase from './ImageShowcase';
import LinkShowcase from './LinkShowcase';
import ModelShowcase from './ModelShowcase';
import ScratchShowcase from './ScratchShowcase';
import ShowcaseMetadata from './ShowcaseMetadata';

let loadedShowcases: BaseShowcase[] = [];

export function getShowcases(): Promise<BaseShowcase[]> {
  return new Promise((resolve) => {
    if (loadedShowcases.length > 0) {
      resolve(loadedShowcases);
    }

    fetch('./showcase/showcase.json').then((response) =>
      response.text().then((text) => {
        const jsonArray: any[] = JSON.parse(text);
        let outputArray: BaseShowcase[] = [];
        jsonArray.forEach((obj) => tryParseShowcase(obj, (s) => outputArray.push(s)));
        loadedShowcases = outputArray;
        resolve(outputArray);
      }),
    );
  });
}

function tryParseShowcase(showcaseObj: any, consume: (showcase: BaseShowcase) => void) {
  try {
    const showcase: BaseShowcase | undefined = parseShowcase(showcaseObj);
    if (showcase !== undefined) {
      consume(showcase);
    } else {
      console.warn('parseShowcase returned undefined');
    }
  } catch (e: any) {
    console.error(e);
  }
}

function parseShowcase(showcaseObj: any, isChild: boolean = false): BaseShowcase | undefined {
  const type: string = showcaseObj['type'];
  const metadata = parseMetadata(showcaseObj);
  switch (type) {
    case 'embed': {
      const src: string = showcaseObj['src']!;
      return new EmbedShowcase(src, metadata);
    }
    case 'image': {
      const imageSrc: string = showcaseObj['imageSrc'] ?? metadata.thumbnailSrc;
      return new ImageShowcase(imageSrc, metadata);
    }
    case 'model': {
      const modelSrc: string = showcaseObj['modelSrc'] ?? './showcase/default_model.glb';
      const clearColor: number = Number.parseInt(showcaseObj['clearColor'], 16) ?? 0x444444;
      return new ModelShowcase(modelSrc, clearColor, metadata);
    }
    case 'scratch': {
      const projectId: number = showcaseObj['projectId']!;
      const turbowarp: boolean = showcaseObj['turbowarp'] ?? false;
      return new ScratchShowcase(projectId, turbowarp, metadata);
    }
    case 'link': {
      const href: string = showcaseObj['href']!;
      return new LinkShowcase(href, metadata);
    }
    case 'grouped': {
      if (isChild) {
        throw new TypeError('Nested showcase not allowed');
      }
      const children: any[] = showcaseObj['children'];
      const parsedChildren: BaseShowcase[] = [];
      children.forEach((c) => tryParseShowcase(c, (s) => parsedChildren.push(s)));
      return new GroupedShowcase(parsedChildren, metadata);
    }
    default:
      throw new TypeError(`Invalid showcase type ${type}`);
  }
}

function parseMetadata(showcaseObj: any): ShowcaseMetadata {
  const name: string = showcaseObj['name'] ?? '無名の作品';
  const icon: string = showcaseObj['icon'] ?? 'media';
  const flags: string[] = showcaseObj['flags'] ?? [];
  const tags: string[] = showcaseObj['tags'] ?? [];
  const version: string | undefined = showcaseObj.version;
  const thumbnailSrc: string = showcaseObj['thumbnailSrc'] ?? './showcase/default_thumbnail.webp';
  return new ShowcaseMetadata(name, icon, flags, tags, version, thumbnailSrc);
}
