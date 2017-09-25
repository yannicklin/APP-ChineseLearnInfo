<template>
	<f7-page>
		<f7-navbar sliding>
			<f7-nav-left />
			<f7-nav-center :title="$t('TAB_TITLE_TAGS')" />
			<f7-nav-right />
		</f7-navbar>

		<lists objectType="tags" />
	</f7-page>
</template>

<script>
    const rec = require('../components/wprec-buttons.vue');

    export default {
        components: {
            lists: rec
        },
        mounted: function() {
            this.$ua.trackView('Tab - Tags');
        }
    }
</script>
