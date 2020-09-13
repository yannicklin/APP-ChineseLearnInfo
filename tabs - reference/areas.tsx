<template>
	<f7-page>
		<f7-navbar sliding>
			<f7-nav-left />
			<f7-nav-center>{{ $t('TAB_TITLE_AREAS') }}</f7-nav-center>
			<f7-nav-right />
			<f7-subnavbar><span>{{ $t('TAB_AREAS_SUBTITLE') }}</span></f7-subnavbar>
		</f7-navbar>


		<f7-block inner>
			<div v-if="loading" class="preloader-container">
				<f7-preloader color="red" size="60px" />
			</div>
			<d3map @fetchingend="stopLoading" />
		</f7-block>
	</f7-page>
</template>

<script>
    const mapTW = require('../components/d3map-TW.vue');

	export default {
        components: {
            d3map: mapTW
        },
        data: () => ({
            loading: true
        }),
		methods: {
            stopLoading: function() {
                this.loading = false;
            }
		},
        mounted: function() {
            this.$ua.trackView('Tab - Areas');
        }
	}
</script>
