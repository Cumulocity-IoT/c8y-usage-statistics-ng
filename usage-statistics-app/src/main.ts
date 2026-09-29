import './i18n';
import { loadMetaDataAndPerformBootstrap } from '@c8y/bootstrap';

const barHolder: HTMLElement | null = document.querySelector('body > .init-load');
export const removeProgress = () => barHolder?.parentNode?.removeChild(barHolder);

// Since web SDK 1024 the options, current user/app/tenant and plugins must be handed to Angular as
// providers (see bootstrap.ts); the previous applyOptions(loadOptions()) left OptionsService empty.
loadMetaDataAndPerformBootstrap(() => import(/* webpackPreload: true */ './bootstrap')).then(removeProgress);
