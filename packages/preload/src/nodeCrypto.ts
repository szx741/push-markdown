/*
 * @Author: szx
 * @Date: 2022-07-23 13:40:31
 * @LastEditTime: 2022-07-23 13:42:57
 * @Description:
 * @FilePath: \push-markdown\packages\preload\src\nodeCrypto.ts
 */
import { type BinaryLike, createHash } from 'crypto';

export function sha256sum(data: BinaryLike) {
  return createHash('sha256').update(data).digest('hex');
}
