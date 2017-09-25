<template>
	<f7-block v-if="loading && !posts.length" class="preloader-container">
		<f7-preloader color="red" size="34px" />
	</f7-block>

	<f7-block v-else-if="posts && posts.length" ref="querylist-wrap" class="querylist-wrap">
		<f7-list inset>
			<f7-list-button v-for="post of posts" :key="post.id" :title="post.name" :link="'/rec-list/' + objectType + '/' + post.id + '/' + post.name" view="#wppopupview" open-popup="#wppopup" />
		</f7-list>
		<mugen-scroll v-if="!endofdata" :handler="fetchData" :should-handle="!loading && !endofdata" scrollContainer="querylist-wrap" class="preloader-container">
			<f7-preloader color="blue" size="34px" />
		</mugen-scroll>
	</f7-block>
</template>

<script>
    import MugenScroll from 'vue-mugen-scroll'

	export default {
	    props: ['objectType', 'queryTerm'],
        components: {
            MugenScroll
        },
        data: () => ({
            posts: [],
            httperrors: [],
			targetobject : 'posts',
            recperpage: 20,
            loading: true,
            pageno: 0,
            endofdata: false
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
                        this.posts = this.posts.concat(response.data.filter(function (item) {
                            return item.count > 0;
                        }));

                        //console.log(this.posts);
                    })
                    .catch(e => {
                        this.loading = false;
                        this.endofdata = true;
                        this.httperrors.push(e)
                    })
            },
            composeQuery() {
                this.targetobject = (this.$props.objectType) ? this.$props.objectType : 'posts';

                var queryURI = (('zh' == this.$i18n.locale)? 'zh-hant/' : '' ) + this.$root.$data.wpURLrest + this.targetobject + '?page=' + this.pageno + '&orderby=name&order=asc&per_page=' + this.recperpage + ((this.$props.queryTerm)? ('&' + this.$props.queryTerm) : '' );

                this.$ua.trackEvent('Posts', 'List Query', this.targetobject);

                return queryURI;
            }
        },
        // Fetches posts when the component is mounted.
        mounted: function() {
            //console.log(this.$props);

            this.pageno = 1;
            this.loading = false;

            this.fetchData();
        }
    }
</script>
<style>
	.list-block.inset {
		margin-top: 25px;
		border: 1px solid lightgrey;
	}
	.querylist-wrap {
		max-height: 100%;
		margin-bottom: 10%;
	}
</style>
