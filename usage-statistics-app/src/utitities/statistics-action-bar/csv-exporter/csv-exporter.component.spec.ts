import { toCsvCell } from './csv-exporter.component';

describe('toCsvCell', () => {
  it('leaves plain values untouched', () => {
    expect(toCsvCell('c8y_MQTTDevice')).toBe('c8y_MQTTDevice');
    expect(toCsvCell(1071056)).toBe('1071056');
  });

  it('quotes values containing a separator, quote or line break', () => {
    expect(toCsvCell('cockpit, devicemanagement')).toBe('"cockpit, devicemanagement"');
    expect(toCsvCell('say "hi"')).toBe('"say ""hi"""');
    expect(toCsvCell('a\nb')).toBe('"a\nb"');
  });

  it('renders null and undefined as empty cells', () => {
    expect(toCsvCell(null)).toBe('');
    expect(toCsvCell(undefined)).toBe('');
  });
});
