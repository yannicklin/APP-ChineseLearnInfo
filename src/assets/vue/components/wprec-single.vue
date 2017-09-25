<template>
	<f7-page>
		<f7-block v-if="loading && !posts.length" class="preloader-container">
			<f7-preloader color="red" size="60px" />
		</f7-block>

		<div v-else-if="posts && posts.length" v-for="post of posts" :key="post.id">
			<f7-navbar>
				<f7-nav-left back-link="Back" sliding />
				<f7-nav-center v-html="$t('VIEW_TITLE_POSTS_SINGLE', {title: truncateWords(post.title.rendered)})" />
				<f7-nav-right>
					<f7-link close-popup="#wppopup">{{ $t('VIEW_BUTTON_CLOSE') }}</f7-link>
				</f7-nav-right>
			</f7-navbar>

			<f7-block>
				<h1 v-html="post.title.rendered" />
				<article v-html="removeLINK_IMG(post.content.rendered)" />
			</f7-block>

			<social-sharing :url="post.link" inline-template>
				<div class="buttons-row">
					<network network="facebook" class="button">
						<f7-icon fa="facebook-official" /> Facebook
					</network>
					<network network="googleplus" class="button">
						<f7-icon fa="google-plus-official" /> Google +
					</network>
					<network network="twitter" class="button">
						<f7-icon fa="twitter" /> Twitter
					</network>
					<network network="weibo" class="button">
						<f7-icon fa="weibo" /> Weibo
					</network>
				</div>

			</social-sharing>
		</div>
	</f7-page>
</template>

<script>
    export default {
        props: ['objectId'],
        data: () => ({
            posts: [],
            httperrors: [],
            loading: true,
            endofdata: false
        }),
        methods: {
            fetchData() {
                this.loading = true;

                this.$http.get(this.composeQuery(), this.$root.$data.axiosWP)
                    .then(response => {
                        // JSON responses are automatically parsed.
                        this.loading = false;
                        this.endofdata = (response.data.length < this.recperpage)? true:false;
                        this.posts = this.posts.concat(response.data);
                        //console.log(this.posts);
                    })
                    .catch(e => {
                        this.loading = false;
                        this.endofdata = true;
                        this.httperrors.push(e)
                    })

            },
            composeQuery() {
                var queryURI = (('zh' == this.$i18n.locale)? 'zh-hant/' : '' ) + this.$root.$data.wpURLrest + 'posts/' + this.$props.objectId;

                this.$ua.trackEvent('Posts', 'Single Query', 'post', this.$props.objectId);

                return queryURI;
            },
            removeLINK_IMG(text) {
                var result = text;
                result = this.$root.removeDOMElement(result, 'a');
                result = this.$root.removeDOMElement(result, 'img');
                return result
            },
            truncateWords(text){
                var langcount = ('zh' == this.$i18n.locale)? '20' : '30';
                var screenweight = 0.6 + Math.trunc(Math.min(window.innerWidth || Infinity, screen.width)/361) * 0.5 ;
                return this.$options.filters.truncate(text, Math.floor(langcount * screenweight));
            }
        },
        // Fetches posts when the component is created.
        created: function() {
            this.fetchData();
        },
        mounted: function() {
            this.$ua.trackView('Single Post');
        }
    }
</script>
<style>
.buttons-row {
	margin: 10px auto;
	max-width: 90%;
}
</style>
