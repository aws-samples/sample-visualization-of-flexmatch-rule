
import { describe, it, expect } from 'vitest';

describe('example test', () => {
  // 最も基本的なテストケース - 常に成功する
  it('should work', () => {
    expect(true).toBe(true);  // true === true なので成功する
  });
  
  // 追加の例: 様々なマッチャーの使用例
  it('demonstrates different matchers', () => {
    // toBe: 厳密な等価性（===）
    expect(1 + 1).toBe(2);
    
    // toEqual: 値の等価性（オブジェクトの内容比較）
    expect({ name: 'test' }).toEqual({ name: 'test' });
    
    // not: マッチャーの否定
    expect(1 + 1).not.toBe(3);
  });
});
