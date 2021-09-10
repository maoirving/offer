var news_popup = new Vue({
    el: "#news_popup",
    data: {
        news: []
    },
    methods: {
        loadInfo: function (news_id) {
            var that = this;
            $.ajax({
                url: "../php/news_information.php",
                data: {
                    news_id: news_id,
                },
                success: function (result) {
                    that.news = result.news[0];
                    var news_description = result.news[0].news_description;
                    news_description = news_description.replace(/<p>/g, "").replace(/<br\/>/g, "\n").replace(/<\/p>/g, "").replace(/&nbsp;/g, " ");
                    var news_skill = result.news[0].news_skill;
                    news_skill = news_skill.replace(/<p>/g, "").replace(/<br\/>/g, "\n").replace(/<\/p>/g, "").replace(/&nbsp;/g, " ");
                    that.news.news_description = news_description;
                    that.news.news_skill = news_skill;
                },
                dataType: "json"
            });
        }
    }
})