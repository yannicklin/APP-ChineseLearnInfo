<template>
	<f7-page>
		<f7-navbar sliding>
			<f7-nav-left />
			<f7-nav-center :title="$t('TAB_TITLE_SETTINGS')" />
			<f7-nav-right />
		</f7-navbar>

		<f7-block-title>{{ $t('TAB_SETTINGS_SECTION_TITLE_LANGUAGE') }}</f7-block-title>
		<f7-block Inset>
			<f7-grid>
				<f7-col width="50" tablet-width="25">
					<f7-button @click="changeLocale('de')" big raised fill><img src="~assets/images/flags/de.png"/>{{'\u0044\u0065\u0075\u0074\u0073\u0063\u0068'}}</f7-button>
				</f7-col>
				<f7-col width="50" tablet-width="25">
					<f7-button @click="changeLocale('en')" big raised fill><img src="~assets/images/flags/us.png"/>{{'\u0045\u006e\u0067\u006c\u0069\u0073\u0068'}}</f7-button>
				</f7-col>
				<f7-col width="50" tablet-width="25">
					<f7-button @click="changeLocale('es')" big raised fill><img src="~assets/images/flags/es.png"/>{{'\u0065\u0073\u0070\u0061\u00f1\u006f\u006c'}}</f7-button>
				</f7-col>
				<f7-col width="50" tablet-width="25">
					<f7-button @click="changeLocale('fr')" big raised fill><img src="~assets/images/flags/fr.png"/>{{'\u0066\u0072\u0061\u006e\u00e7\u0061\u0069\u0073'}}</f7-button>
				</f7-col>
				<f7-col width="50" tablet-width="25">
					<f7-button @click="changeLocale('ja')" big raised fill><img src="~assets/images/flags/jp.png"/>{{'\u65e5\u672c\u8a9e'}}</f7-button>
				</f7-col>
				<f7-col width="50" tablet-width="25">
					<f7-button @click="changeLocale('pt')" big raised fill><img src="~assets/images/flags/pt.png"/>{{'\u0050\u006f\u0072\u0074\u0075\u0067\u0075\u00ea\u0073'}}</f7-button>
				</f7-col>
				<f7-col width="50" tablet-width="25">
					<f7-button @click="changeLocale('ru')" big raised fill><img src="~assets/images/flags/ru.png"/>{{'\u0440\u0443\u0441\u0441\u043a\u0438\u0439 \u044f\u0437\u044b\u043a'}}</f7-button>
				</f7-col>
				<f7-col width="50" tablet-width="25">
					<f7-button @click="changeLocale('zh')" big raised fill><img src="~assets/images/flags/tw.png"/>{{'\u4e2d\u6587'}}</f7-button>
				</f7-col>
			</f7-grid>
		</f7-block>

		<f7-block-title>{{ $t('TAB_SETTINGS_SECTION_TITLE_CONTACTUS') }}</f7-block-title>
		<f7-block Inset>
			<f7-button open-login-screen big raised fill>{{ $t('BUTTON_CONTACT_US') }}</f7-button>
		</f7-block>

	</f7-page>
</template>

<script>
	export default {
        methods : {
            changeLocale: function (newLocale) {
                this.$i18n.locale = newLocale;
                switch (newLocale) {
					case 'zh':
                        this.$validator.setLocale(newLocale + '_TW');
					    break;
					case 'pt':
                        this.$validator.setLocale(newLocale + '_BR');
					    break;
					default:
                        this.$validator.setLocale(newLocale);
				}
            }
        },
        mounted: function() {
            this.$ua.trackView('Tab - Settings');
        }
	}
</script>
