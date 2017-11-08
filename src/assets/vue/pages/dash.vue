<template>
	<f7-page>
		<f7-navbar sliding>
			<f7-nav-left />
			<f7-nav-center :title="$t('TAB_TITLE_DASH')" />
			<f7-nav-right />
		</f7-navbar>

		<f7-block inner>
			<f7-card :title="$t('DASH_NEWS_TITLE_20171108')" :content="$t('DASH_NEWS_CONTENT_20171108')" footer="" />
			<f7-card :title="$t('DASH_NEWS_TITLE_20170816')" :content="$t('DASH_NEWS_CONTENT_20170816')" footer="" />
			<f7-card :title="$t('DASH_NEWS_TITLE_20170718')" :content="$t('DASH_NEWS_CONTENT_20170718')" footer="" />
			<f7-card :title="$t('DASH_NEWS_TITLE_20160304')" :content="$t('DASH_NEWS_CONTENT_20160304')" footer="" />
			<f7-card :title="$t('DASH_NEWS_TITLE_20160229')" :content="$t('DASH_NEWS_CONTENT_20160229')" footer="" />
			<f7-card :title="$t('DASH_NEWS_TITLE_20160228')" :content="$t('DASH_NEWS_CONTENT_20160228')" footer="" />
			<f7-card :title="$t('DASH_NEWS_TITLE_20160227')" :content="$t('DASH_NEWS_CONTENT_20160227')" footer="" />
		</f7-block>
	</f7-page>
</template>

<script>
	export default {
		mounted: function() {
			this.$ua.trackView('Tab - Dashboard');
		}
	}
</script>
