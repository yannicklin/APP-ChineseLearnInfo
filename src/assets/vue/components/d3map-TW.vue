<template>
	<svg />
</template>

<script>
    // Import D3 and topojson
    const d3 = require('d3');
    const topojson = require('topojson');

    export default {
        data: () => ({
            httperrors:[],
            wholeprocessing: true,
            datafetching: false,
            fetchingpageno: 0,
            fetchingrecperpage: 100,
            fetchingendofdata: false,
            areaList: [
                {
                    area:'tw-taipei-xinbei-keelung',
					tagid: 0,
                    count: 0
                },
                {
                    area:'tw-taoyuan-hsinchu-miaoli',
                    tagid: 0,
                    count: 0
                },
                {
                    area:'tw-taichung-changhua-nantou',
                    tagid: 0,
                    count: 0
                },
                {
                    area:'tw-yunlin-chiayi-tainan',
                    tagid: 0,
                    count: 0
                },
                {
                    area:'tw-kaohsiung-pingtung',
                    tagid: 0,
                    count: 0
                },
                {
                    area:'tw-ilan-hualien-taitung',
                    tagid: 0,
                    count: 0
                }
            ]
        }),
        methods: {
            fetchAreaData() {
                let self = this;
                self.datafetching = true;

                var queryURI = (('zh' == self.$i18n.locale)? 'zh-hant/' : '' ) + self.$root.$data.wpURLrest + 'tags?search=tw-&page=' + self.fetchingpageno + '&orderby=name&order=asc&per_page=' + self.fetchingrecperpage;

                this.$ua.trackEvent('Posts', 'List Query', 'AREA');

                self.$http.get(queryURI, self.$root.$data.axiosWP)
                    .then(response => {

						//Count posts in each area
                        response.data.forEach( function(value) {
                            self.areaList.forEach( function(areaItem)
                            {
								if ((areaItem.area + (('zh' == self.$i18n.locale)? '-zh-hant' : '' )) == value.slug) {
                                    areaItem.count = areaItem.count + value.count;
                                    areaItem.tagid=value.id;
								}
                            });
                        });
                        //console.log(self.areaList);

                        self.datafetching = false;
                        self.fetchingpageno += (response.data.length < self.fetchingrecperpage)? 0:1;
                        self.fetchingendofdata = (response.data.length < self.fetchingrecperpage)? true:false;
                        //console.log(response.data);
                    })
                    .catch(e => {
                        self.datafetching = false;
                        self.fetchingendofdata = true;
                        self.httperrors.push(e)
                    })
            },
			drawD3Map(vueInstance){

                this.$ua.trackEvent('MAP', 'Draw', 'TWMAP');

                var svg = d3.select(this.$el);
                var oriwidth = Math.min(window.innerWidth || Infinity, screen.width);
                var oriheight = Math.min(window.innerHeight || Infinity, screen.height);
                var basesize = (oriwidth * 2 >= oriheight) ? oriheight : oriwidth;
                var sizeweight = 0.7;
                var width = basesize * sizeweight / 2, height = basesize * sizeweight;
                //var width = window.screen.width * 0.8 * window.devicePixelRatio, height = window.screen.height * 0.8 * window.devicePixelRatio;
                svg.attr("width", width).attr("height", height);

                d3.json('static/twMetropolitanArea2016.topo.json', function(error, data) {
                    var twArea = topojson.feature(data, data.objects["MACollection"]);

                    // Set the post count per Area
                    for (var idx = twArea.features.length - 1; idx >= 0; idx--) {

                        twArea.features[idx].properties.postCount = 0;
                        vueInstance.areaList.forEach( function(areaItem)
						{
                            if (areaItem.area == ('tw-' + twArea.features[idx].properties.Name)) {
                                twArea.features[idx].properties.postCount = twArea.features[idx].properties.postCount + + areaItem.count;
                                twArea.features[idx].properties.County_ID=areaItem.tagid;
                            }
						});
					}
					//console.log(twArea.features);

                    // Create a unit projection and the path generator
                    var projection = d3.geoMercator()
                        .scale(1)
                        .translate([0, 0]);
                    var path = d3.geoPath()
                        .projection(projection);

                    // Calculate and resize the path to fit the screen
                    var b = path.bounds(twArea),
                        s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
                    projection
                        .scale(s)
                        .translate(t);

                    // Draw Map with Post Counts
                    svg.selectAll("path").data(twArea.features)
                        .enter().append("path")
                        .attr("d", path)
                        .attr("id", function (d) { return ('twarea-' + d.properties.County_ID); })
                        .style("fill", "darkgrey")
                        .style("stroke-width", "2")
                        .style("stroke", "white")
                        .on("click", ClickonArea)
                        .on("mouseover", HoveronArea)
                        .on("mouseout", HoveroutArea);

                    svg.selectAll("label").data(twArea.features)
                        .enter().append("text")
                        .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
                        .attr("text-anchor", "middle")
                        .attr("dy", "0.35em")
                        .attr("font-size", "2em")
                        .attr("fill", "blue")
                        .text(function (d) { return d.properties.postCount; })
                        .on("click", ClickonArea)
                        .on("mouseover", HoveronArea)
                        .on("mouseout", HoveroutArea);

                    function ClickonArea(data) {
						vueInstance.$f7.popup('#wppopup');
                        vueInstance.$f7.views.wppopupview.router.load({url: '/rec-list/tags/' + data.properties.County_ID + '/' + vueInstance.$i18n.t('AREAS-' + data.properties.Name) });
                        return false;
                    };

                    function HoveronArea(data){
                        d3.select("path#twarea-" + data.properties.County_ID)
                            .style("fill", "chocolate")
                            .style("fill-opacity", 0.9);
                    };

                    function HoveroutArea(){
						svg.selectAll("path")
                            .style("fill", "darkgrey")
							.style("fill-opacity", 1);
					};
                });
			}
		},
        mounted: function() {
            // do fetch data
            let self = this;
            self.fetchingpageno = 1;
            self.datafetching = false;

            var refetch = setInterval(function() {
                if(self.fetchingendofdata){
                    // stop interval
                    clearInterval(refetch);
                    self.$emit('fetchingend');
                    self.drawD3Map(self);
                } else {
                    if (!self.datafetching){
                        self.fetchAreaData(self);
                    }
                }
            }, 100);
        }
    }
</script>

<style>
	svg {
		display: block;
		margin: 20px auto;
	}
</style>
