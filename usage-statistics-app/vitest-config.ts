import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { 'isomorphic-cometd': 'isomorphic-cometd/browser.js' } },
  test: {
    environment: 'jsdom',
    server: { deps: { inline: [/@c8y\//, /@ngx-formly\//] } }
  }
});
