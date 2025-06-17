import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, DefineComponent, h } from 'vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

import { createI18n } from 'vue-i18n';
import ru from './locales/ru.json';
import en from './locales/en.json';
import type { LocaleMessages } from 'vue-i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
type MessageSchema = typeof ru

const i18n = createI18n<[MessageSchema], 'ru' | 'en'>({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'en',
    messages: {
        ru,
        en,
    }
});

createInertiaApp({
    title: (title) => `rustworld`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./Pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(i18n)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
