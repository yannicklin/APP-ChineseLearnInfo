<template>
	<!-- App -->
	<div id="app" class="theme-blue layout-white">

		<!-- Statusbar -->
		<f7-statusbar />

		<!-- Main Views -->
		<f7-views>
			<f7-view id="main-view" navbar-through :dynamic-navbar="true" main>
				<!-- Pages -->
				<f7-pages>
						<f7-tabs animated>
							<f7-tab route-tab-id="dash" />
							<f7-tab route-tab-id="tags" />
							<f7-tab route-tab-id="categories" />
							<f7-tab route-tab-id="areas" />
							<f7-tab route-tab-id="settings" />
						</f7-tabs>
				</f7-pages>

				<f7-toolbar tabbar labels>
					<f7-link href="/tabs/" route-tab-link="#dash" :text="$t('TAB_TITLE_DASH')" icon-fa="newspaper-o" />
					<f7-link href="/tabs/tags/" route-tab-link="#tags" :text="$t('TAB_TITLE_TAGS')" icon-fa="tags" />
					<f7-link href="/tabs/categories/" route-tab-link="#categories" :text="$t('TAB_TITLE_CATEGORIES')" icon-fa="folder-open" />
					<f7-link href="/tabs/areas/" route-tab-link="#areas" :text="$t('TAB_TITLE_AREAS')" icon-fa="globe" />
					<f7-link href="/tabs/settings/" route-tab-link="#settings" :text="$t('TAB_TITLE_SETTINGS')" icon-fa="gears" />
				</f7-toolbar>
			</f7-view>
		</f7-views>


		<!-- Popup -->
		<f7-popup id="wppopup">
			<f7-view id="wppopupview" navbar-through :dynamic-navbar="true" :allowDuplicateUrls="true" name="wppopupview">
			</f7-view>
		</f7-popup>

		<!-- Login as Contact Form -->
		<f7-login-screen id="contactform">
			<f7-view id="contactformview">
				<f7-pages>
					<contactform />
				</f7-pages>
			</f7-view>
		</f7-login-screen>

	</div>
</template>

<script>
    const contForm = require('components/contactform.vue');

	export default {
        components: {
            contactform: contForm
        }
	}
</script>
