import format_time from "./popup/processTime";

test('convert 60 mins to 01h:00m', () => {
  expect(format_time(60)).toBe('01h:00m');
});

test('convert 0 min to 00:00', () => {
    expect(format_time(0, false)).toBe('00:00');
  });