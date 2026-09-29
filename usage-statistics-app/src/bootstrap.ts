import './polyfills';
// JIT: the c8y devkit builds with aot: false, so the compiler must be loaded before bootstrapping
import '@angular/compiler';

import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BootstrapMetaData } from '@c8y/bootstrap';
import { BootstrapComponent, provideBootstrapMetadata } from '@c8y/ngx-components';
import { AppModule } from './app.module';

declare const __MODE__: string;
if (__MODE__ === 'production') {
  enableProdMode();
}

/**
 * Since web SDK 1024 BootstrapComponent is standalone, so it can no longer be listed in
 * `@NgModule.bootstrap`. The app stays NgModule-based: AppModule's providers and routes are imported.
 */
export function bootstrap(metadata: BootstrapMetaData) {
  return bootstrapApplication(BootstrapComponent, {
    providers: [
      provideZoneChangeDetection(),
      provideAnimations(),
      provideBootstrapMetadata(metadata),
      importProvidersFrom(AppModule)
    ]
  }).catch(err => console.log(err));
}
