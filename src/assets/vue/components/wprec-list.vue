<template>
	<f7-pages>
		<f7-page>
			<f7-navbar :title="$t('VIEW_TITLE_POSTS_LIST', {type: targetobject, term: displayname})">
				<f7-nav-right>
					<f7-link :close-popup="true">{{ $t('VIEW_BUTTON_CLOSE') }}</f7-link>
				</f7-nav-right>
			</f7-navbar>

			<f7-block v-if="!endofdata" class="preloader-container">
				<f7-preloader color="red" size="34px" />
			</f7-block>

			<f7-block v-else-if="posts && posts.length" ref="querylist-wrap" class="querylist-wrap">
				<f7-searchbar v-if="endofdata" :init="true" cancel-link="Cancel" placeholder="Search in titles" :clear-button="true" :searchList="'#postslist-' + uniqueid" searchIn=".item-title" />

				<f7-list media-list :id="'postslist-' + uniqueid">
					<f7-list-item v-for="post of posts" :key="post.id" :title="post.title.rendered" :subtitle="post.date" :text="removeLINK(post.excerpt.rendered) | truncate(truncateWordCount())" :link="'/rec-single/' + post.id" />
				</f7-list>
			</f7-block>
		</f7-page>
	</f7-pages>
</template>

<script>
    export default {
        props: ['objectType','queryTerm', 'displayName'],
        data: () => ({
            posts: [],
            httperrors: [],
			targetobject: 'posts',
			queryslug: '',
			displayname: '',
			recperpage: 20,
			loading: true,
			pageno: 0,
			endofdata: false,
			uniqueid: ''
        }),
        methods: {
			fetchData() {
				this.loading = true;

                this.$http.get(this.composeQuery(), this.$root.$data.axiosWP)
					.then(response => {
						// JSON responses are automatically parsed.
                        this.loading = false;
                        this.pageno = (response.data.length < this.recperpage)? this.pageno : ( this.pageno+1 );
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
                var queryURI = (('zh' == this.$i18n.locale)? 'zh-hant/' : '' ) + this.$root.$data.wpURLrest + 'posts' + '?' + this.targetobject + '=' + this.queryslug + '&page=' + this.pageno + '&orderby=id&order=desc&per_page=' + this.recperpage;

                this.$ua.trackEvent('Posts', 'List Query', this.targetobject, this.queryslug);

                return queryURI;
            },
			removeLINK(text) {
			    return this.$root.removeDOMElement(text, 'a');
			},
			jsFilterHumanable(text){
                return this.$options.filters.humanable(text);
			},
			truncateWordCount(){
			    var langcount = ('zh' == this.$i18n.locale)? '75' : '150';
                var screenweight = 0.6 + Math.trunc(Math.min(window.innerWidth || Infinity, screen.width)/361) * 0.5 ;
			    return Math.floor(langcount * screenweight);
			}
		},
        // Fetches posts when the component is mounted.
        mounted: function() {
			let self = this;

            self.uniqueid = (Math.floor(Date.now() / 1000)).toString();
            this.targetobject = (this.$props.objectType) ? this.$props.objectType : 'posts';
            this.queryslug = (this.$props.queryTerm) ? this.$props.queryTerm : '';
            this.displayname = (this.$props.displayName) ? this.$props.displayName : '';

            self.pageno = 1;
            self.loading = false;

            this.$ua.trackView('Posts List');

            var refetch = setInterval(function() {
                if(self.endofdata){
                    // stop interval
                    clearInterval(refetch);
                } else {
                    if (!self.loading){
                        // do fetch data
                        self.fetchData();
                    }
                }
            },100);
        }
    }
</script>
