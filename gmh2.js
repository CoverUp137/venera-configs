/** @type {import('./_venera_.js')} */
class GmhSource extends ComicSource {
    name = "G社漫畫";
    key = "gmh2";
    version = "1.0.1";
    minAppVersion = "1.0.0";
    url = "https://cdn.jsdelivr.net/gh/CoverUp137/venera-configs@main/gmh2.js";

    // 分类页配置
    category = {
        title: "分类",
        parts: [
            {
                name: "热门标签",
                type: "fixed",
                categories: ["奇幻", "复仇", "古风", "逆袭", "异能", "宅向", "穿越", "热血", "纯爱", "系统", "重生", "冒险", "灵异", "大女主", "剧情", "恋爱", "玄幻", "女神", "科幻", "魔幻", "推理", "猎奇", "治愈", "都市", "异形", "青春", "末日", "悬疑", "修仙", "战斗"],
                itemType: "category",
                categoryParams: ["qihuan", "fuchou", "gufeng", "nixi", "yineng", "zhaixiang", "chuanyue", "rexue", "chunai", "xitong", "chongsheng", "maoxian", "lingyi", "danüzhu", "juqing", "lianai", "xuanhuan", "nüshen", "kehuan", "mohuan", "tuili", "lieqi", "zhiyu", "dushi", "yixing", "qingchun", "mori", "xuanyi", "xiuxian", "zhandou"],
            }
        ],
    };

    categoryComics = {
        load: async (category, param, options, page) => {
            const url = `https://m.g-mh.org/manga-tag/${param}`;
            const res = await Network.get(url);
            const $ = Html.parse(res.data);

            const comics = [];
            $("div.grid.grid-cols-3.gap-unit-md.mt-unit-md a").each((i, el) => {
                const a = $(el);
                const img = a.find("img");
                const title = a.find("div.font-bold.text-sm.line-clamp-2").text().trim();
                const cover = img.attr("src") || img.attr("data-src");
                const comicUrl = a.attr("href");
                // 从URL中提取ID
                const idMatch = comicUrl.match(/\/manga\/([^\/]+)/);
                const id = idMatch ? idMatch[1] : comicUrl;
                
                if (title && cover && id) {
                    comics.push(new Comic({
                        id: id,  // 必须有id
                        title: title,
                        cover: cover,
                        subTitle: null,
                        tags: [],
                        description: null,
                    }));
                }
            });
            return { comics: comics, maxPage: 1 };
        },
    };

    // 探索页配置
    explore = [
        {
            title: "近期更新",
            type: "multiPageComicList",
            load: async (page) => {
                const url = `https://m.g-mh.org/`;
                const res = await Network.get(url);
                const $ = Html.parse(res.data);

                const comics = [];
                $(".manga-list-2 li, .manga-list-1 li").each((i, el) => {
                    const a = $(el).find("a");
                    const img = $(el).find("img");
                    const title = $(el).find(".manga-item-2-title, .manga-item-1-title").text().trim() || a.attr("title");
                    const cover = img.attr("src") || img.attr("data-src");
                    const comicUrl = a.attr("href");
                    const idMatch = comicUrl.match(/\/manga\/([^\/]+)/);
                    const id = idMatch ? idMatch[1] : comicUrl;
                    
                    if (title && cover && id) {
                        comics.push(new Comic({
                            id: id,
                            title: title,
                            cover: cover,
                            subTitle: null,
                            tags: [],
                            description: null,
                        }));
                    }
                });
                return { comics: comics, maxPage: 1 };
            },
        },
        {
            title: "熱門更新",
            type: "multiPageComicList",
            load: async (page) => {
                const url = `https://m.g-mh.org/`;
                const res = await Network.get(url);
                const $ = Html.parse(res.data);

                const comics = [];
                $("div.grid.grid-cols-3.gap-unit-md.mt-unit-md").eq(0).find("a").each((i, el) => {
                    const a = $(el);
                    const img = a.find("img");
                    const title = a.find("div.font-bold.text-sm.line-clamp-2").text().trim();
                    const cover = img.attr("src") || img.attr("data-src");
                    const comicUrl = a.attr("href");
                    const idMatch = comicUrl.match(/\/manga\/([^\/]+)/);
                    const id = idMatch ? idMatch[1] : comicUrl;
                    
                    if (title && cover && id) {
                        comics.push(new Comic({
                            id: id,
                            title: title,
                            cover: cover,
                            subTitle: null,
                            tags: [],
                            description: null,
                        }));
                    }
                });
                return { comics: comics, maxPage: 1 };
            },
        },
        {
            title: "人氣排行",
            type: "multiPageComicList",
            load: async (page) => {
                const url = `https://m.g-mh.org/`;
                const res = await Network.get(url);
                const $ = Html.parse(res.data);

                const comics = [];
                $("div.grid.grid-cols-3.gap-unit-md.mt-unit-md").eq(1).find("a").each((i, el) => {
                    const a = $(el);
                    const img = a.find("img");
                    const title = a.find("div.font-bold.text-sm.line-clamp-2").text().trim();
                    const cover = img.attr("src") || img.attr("data-src");
                    const comicUrl = a.attr("href");
                    const idMatch = comicUrl.match(/\/manga\/([^\/]+)/);
                    const id = idMatch ? idMatch[1] : comicUrl;
                    
                    if (title && cover && id) {
                        comics.push(new Comic({
                            id: id,
                            title: title,
                            cover: cover,
                            subTitle: null,
                            tags: [],
                            description: null,
                        }));
                    }
                });
                return { comics: comics, maxPage: 1 };
            },
        },
        {
            title: "最新上架",
            type: "multiPageComicList",
            load: async (page) => {
                const url = `https://m.g-mh.org/`;
                const res = await Network.get(url);
                const $ = Html.parse(res.data);

                const comics = [];
                $("div.grid.grid-cols-3.gap-unit-md.mt-unit-md").eq(2).find("a").each((i, el) => {
                    const a = $(el);
                    const img = a.find("img");
                    const title = a.find("div.font-bold.text-sm.line-clamp-2").text().trim();
                    const cover = img.attr("src") || img.attr("data-src");
                    const comicUrl = a.attr("href");
                    const idMatch = comicUrl.match(/\/manga\/([^\/]+)/);
                    const id = idMatch ? idMatch[1] : comicUrl;
                    
                    if (title && cover && id) {
                        comics.push(new Comic({
                            id: id,
                            title: title,
                            cover: cover,
                            subTitle: null,
                            tags: [],
                            description: null,
                        }));
                    }
                });
                return { comics: comics, maxPage: 1 };
            },
        },
    ];

    // 搜索功能
    search = {
        load: async (keyword, options, page) => {
            const url = `https://m.g-mh.org/s/${encodeURIComponent(keyword)}`;
            const res = await Network.get(url);
            const $ = Html.parse(res.data);

            const comics = [];
            $("div.grid.grid-cols-3.gap-unit-md.mt-unit-md a").each((i, el) => {
                const a = $(el);
                const img = a.find("img");
                const title = a.find("div.font-bold.text-sm.line-clamp-2").text().trim();
                const cover = img.attr("src") || img.attr("data-src");
                const comicUrl = a.attr("href");
                const idMatch = comicUrl.match(/\/manga\/([^\/]+)/);
                const id = idMatch ? idMatch[1] : comicUrl;
                
                if (title && cover && id) {
                    comics.push(new Comic({
                        id: id,
                        title: title,
                        cover: cover,
                        subTitle: null,
                        tags: [],
                        description: null,
                    }));
                }
            });
            return { comics: comics, maxPage: 1 };
        },
    };

    // 漫画详情页 - 新版结构
    comic = {
        // 加载漫画详情
        loadInfo: async (id) => {
            const comicUrl = `https://m.g-mh.org/manga/${id}`;
            const res = await Network.get(comicUrl);
            const $ = Html.parse(res.data);

            const title = $("h1").text().trim().replace(" 連載中", "").replace(" 已完结", "");
            const cover = $("img.rounded-xl").attr("src");
            const description = $(".manga-description").text().trim();
            const author = $("a[href*=\"/author/\"]").text().trim();
            const status = $("span.badge.badge-primary").text().trim();
            
            const genres = [];
            $("a[href*=\"/manga-tag/\"]").each((i, el) => {
                genres.push($(el).text().trim().replace("#", ""));
            });

            // 构建章节Map
            const chapters = new Map();
            $("#sortchapters a").each((i, el) => {
                const chapterTitle = $(el).text().trim();
                const chapterUrl = $(el).attr("href");
                const chapterIdMatch = chapterUrl.match(/\/chapter\/([^\/]+)/);
                const chapterId = chapterIdMatch ? chapterIdMatch[1] : chapterUrl;
                chapters.set(chapterId, chapterTitle);
            });

            return {
                title: title,
                cover: cover,
                description: description,
                tags: {
                    "作者": author ? [author] : [],
                    "标签": genres,
                    "状态": status ? [status] : [],
                },
                chapters: chapters,
                subId: null,
                isFavorite: false,
            };
        },

        // 加载章节图片
        loadEp: async (comicId, epId) => {
            const chapterUrl = `https://m.g-mh.org/chapter/${epId}`;
            const res = await Network.get(chapterUrl);
            const $ = Html.parse(res.data);

            const images = [];
            $("main img").each((i, el) => {
                const src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-original");
                if (src && !src.includes("logo") && !src.includes("ad")) {
                    images.push(src);
                }
            });

            return {
                images: images,
            };
        },

        // [Optional] 加载缩略图 - 这是修复错误的关键
        loadThumbnails: async (id, next) => {
            // 如果网站支持缩略图预览，在这里实现
            // 返回空数组表示没有缩略图
            return {
                thumbnails: [],
                next: null,
            };
        },

        // [Optional] 图片加载配置
        onImageLoad: (url, comicId, epId) => {
            return {};
        },

        // [Optional] 缩略图加载配置
        onThumbnailLoad: (url) => {
            return {};
        },
    };
}

// 导出 ComicSource 实例
new GmhSource();
