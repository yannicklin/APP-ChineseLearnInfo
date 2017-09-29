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

			<f7-grid>
				<f7-col width="20" tablet-width="30"></f7-col>
				<f7-col width="60" tablet-width="40">
					<f7-button round big raised color="blue" @click="sharewithSocialMedia(post.title.rendered, post.link)">
								<f7-icon fa="facebook-official" /><f7-icon fa="google-plus-official" /><f7-icon fa="twitter" /><f7-icon fa="weibo" />
							{{ $t('VIEW_BUTTON_POSTS_SINGLE_SHARE') }}

					</f7-button>
				</f7-col>
				<f7-col width="20" tablet-width="30"></f7-col>
			</f7-grid>
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
            },
			sharewithSocialMedia(subject, url){
                // this is the complete list of currently supported params you can pass to the plugin (all optional)
                var options = {
                    message: this.$i18n.t('VIEW_ACTIONSHEET_TITLE_POSTS_SINGLE_SHARE'), // not supported on some apps (Facebook, Instagram)
                    subject: subject, // fi. for email
                    url: url,
                    chooserTitle: this.$i18n.t('VIEW_ACTIONSHEET_WORDS_POSTS_SINGLE_SHARE') // Android only, you can override the default share sheet title
                }

                var onSuccess = function(result) {
                    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                    console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                }

                var onError = function(msg) {
                    console.log("Sharing failed with message: " + msg);
                }

                window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
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
	a.button {
		font-size: 1.5rem;
	}
	a.button > i.icon.fa {
		margin: 0 5px;
		padding: 0px;
	}
</style>
