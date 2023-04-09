import { transliterate as tr } from 'transliteration';
import slugi from '@sindresorhus/slugify';
import { nodePath } from '#preload';
import { mdFileName, toSystemTimezone, transfromToLocalSrc } from '../utils/tools';

export interface Attr {
  title: string | undefined;
  abstract: string | undefined;
  url: string | undefined;
  tags: string[] | undefined;
  categories: string[] | undefined;
  authors: string[] | undefined;
  date: Date | undefined;
  thumbnail: string | undefined;
  other_images: string[] | undefined;
}

// 解析前面yaml的文件格式
export function extractFrontMatter(contentAttr: any, filePath: string): Attr {
  let title = toStr(contentAttr.title) || mdFileName(filePath);

  let thumbnail = toStr(contentAttr.thumbnail);
  thumbnail = transfromToLocalSrc(nodePath.pathDirname(filePath), thumbnail);

  let other_images = toStrArr(contentAttr.other_images || contentAttr.other_image);
  other_images = otherImagesTrans(nodePath.pathDirname(filePath), other_images);

  // 如果post的url为空，那么就就title转换成拼音
  let url = toStr(contentAttr.url);
  if (!url) url = slugi(tr(title.replace(/(\d+)/g, ' $1 '))).replace(/^-|-$/g, '');

  return {
    title,
    abstract: toStr(contentAttr.abstract),
    url,
    tags: toStrArr(contentAttr.tags || contentAttr.tag),
    categories: toStrArr(contentAttr.categories || contentAttr.category),
    authors: toStrArr(contentAttr.authors || contentAttr.author),
    date: contentAttr.date && toSystemTimezone(contentAttr.date),
    thumbnail: thumbnail,
    other_images: other_images
  };
}

function toStr(src: any) {
  return (src && typeof src === 'string' && src) || undefined;
}

function toStrArr(src: string | string[] | null | undefined): string[] | undefined {
  if (typeof src === 'string') {
    return [src];
  } else if (src instanceof Array) {
    const res = src.map((s) => toStr(s)).filter((s) => s);
    return res.length == 0 ? undefined : res;
  }
  return undefined;
}

function otherImagesTrans(filePath: string, src: string[] | undefined) {
  if (!src) return undefined;
  let res = [];
  for (let i of src) {
    let src = transfromToLocalSrc(filePath, i);
    if (src) res.push(src);
  }
  if (res.length === 0) return undefined;
  else return res;
}
