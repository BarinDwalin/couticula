import { TestBed } from '@angular/core/testing';
import { ItemCountPipe } from './item-count.pipe';

describe('ItemCountPipe', () => {
  let pipe: ItemCountPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ItemCountPipe] });
    pipe = TestBed.get(ItemCountPipe);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('transforms 1 to I', () => {
    const value = 1;
    expect(pipe.transform(value)).toEqual('I');
  });
  it('transforms 2 to II', () => {
    const value = 2;
    expect(pipe.transform(value)).toEqual('II');
  });
  it('transforms 3 to III', () => {
    const value = 3;
    expect(pipe.transform(value)).toEqual('III');
  });
  it('transforms 6 to III', () => {
    const value = 6;
    expect(pipe.transform(value)).toEqual('III');
  });
});
