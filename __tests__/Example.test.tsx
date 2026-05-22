/**
 * Example test file
 */

describe('Example test', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string concatenation', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr).toContain(2);
  });

  it('should work with objects', () => {
    const obj = { name: 'Storm Chaser', version: '1.0.0' };
    expect(obj.name).toBe('Storm Chaser');
    expect(obj.version).toBe('1.0.0');
  });
});