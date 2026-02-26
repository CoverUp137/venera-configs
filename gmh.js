/**
 * G社漫画 (G-MH) Venera 漫画源
 * 网站: https://m.g-mh.org/
 * API: https://api-get-v2.mgsearcher.com/api/
 */

class GMH extends ComicSource {
    // 基础配置
    name = "G社漫画";
    key = "gmh";
    version = "1.0.0";
    minAppVersion = "1.0.0";
    url = "https://cdn.jsdelivr.net/gh/venera-app/venera-configs@main/gmh.js";

    // 常量定义
    static baseUrl = "https://m.g-mh.org";
    static apiUrl = "https://api-get-v2.mgsearcher.com/api";
    static imageBaseUrl = "https://f40-1-4.g-mh.online";
    
    static headers = {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "Accept": "application/json, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Referer": "https://m.g-mh.org/"
    };

    static webHeaders = {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9",
    };

    /**
     * 从漫画详情页提取 mid
     */
    async extractMidFromPage(mangaPath) {
        try {
            let res = await Network.get(`${GMH.baseUrl}${mangaPath}`, GMH.webHeaders);
            if (res.status !== 200) return null;
            
            // 从页面中提取 data-mid
            let match = res.body.match(/data-mid="(\d+)"/);
            if (match) {
                return match[1];
            }
            return null;
        } catch (e) {
            console.error("提取mid失败:", e);
            return null;
        }
    }

    /**
     * 解析漫画列表HTML
     */
    parseComicList(document) {
        let comics = [];
        let items = document.querySelectorAll('a[href^="/manga/"]');
        
        for (let item of items) {
            let href = item.attributes['href'];
            let titleElem = item.querySelector('h3');
            let title = titleElem ? titleElem.text : '';
            
            if (!title) {
                // 尝试其他方式获取标题
                title = item.text.split('\n')[0].trim();
            }
            
            let coverElem = item.querySelector('img');
            let cover = coverElem ? coverElem.attributes['src'] : '';
            
            let subTitleElem = item.querySelector('.text-sm, .chapter, [class*="chapter"]');
            let subTitle = subTitleElem ? subTitleElem.text : '';
            
            if (title && href) {
                comics.push({
                    id: href,
                    title: title,
                    cover: cover,
                    subTitle: subTitle
                });
            }
        }
        
        return comics;
    }

    // 探索页面
    explore = [
        {
            title: "G社漫画",
            type: "multiPartPage",
            load: async () => {
                try {
                    let res = await Network.get(`${GMH.baseUrl}/`, GMH.webHeaders);
                    if (res.status !== 200) {
                        throw new Error(`加载失败，状态码：${res.status}`);
                    }
                    
                    let document = new HtmlDocument(res.body);
                    let result = [];
                    
                    // 近期更新
                    let updateSection = document.querySelector('h2:contains("近期更新")');
                    if (updateSection) {
                        let parent = updateSection.parent;
                        if (parent) {
                            let comics = [];
                            let links = parent.querySelectorAll('a[href^="/manga/"]');
                            for (let link of links.slice(0, 10)) {
                                let href = link.attributes['href'];
                                let text = link.text.trim();
                                // 提取标题和时间
                                let titleMatch = text.match(/第[\d话集]+(.+)$/);
                                let title = titleMatch ? titleMatch[1] : text;
                                let timeText = text.match(/^(\d+\s*(?:小时|分钟)前|刚刚)/);
                                let time = timeText ? timeText[1] : '';
                                
                                if (title && href) {
                                    comics.push({
                                        id: href,
                                        title: title,
                                        subTitle: time
                                    });
                                }
                            }
                            if (comics.length > 0) {
                                result.push({
                                    title: "近期更新",
                                    comics: comics
                                });
                            }
                        }
                    }
                    
                    // 热门更新
                    let hotSection = document.querySelector('h2:contains("熱門更新")');
                    if (hotSection) {
                        let parent = hotSection.parent;
                        if (parent) {
                            let comics = [];
                            let links = parent.querySelectorAll('a');
                            for (let link of links) {
                                let text = link.text.trim();
                                let href = link.attributes['href'];
                                if (text && href && href.includes('/manga/')) {
                                    comics.push({
                                        id: href,
                                        title: text
                                    });
                                }
                            }
                            if (comics.length > 0) {
                                result.push({
                                    title: "热门更新",
                                    comics: comics
                                });
                            }
                        }
                    }
                    
                    return result;
                } catch (err) {
                    throw new Error(`探索页面加载失败：${err.message}`);
                }
            }
        }
    ];

    // 分类页面
    category = {
        title: "G社漫画",
        parts: [
            {
                name: "地区",
                type: "fixed",
                categories: ["全部", "国漫", "韩漫", "日漫", "欧美", "其他"],
                itemType: "category",
                categoryParams: ["", "cn", "kr", "jp", "ou-mei", "qita"]
            },
            {
                name: "标签",
                type: "fixed",
                categories: [
                    "全部", "穿越", "恋爱", "系统", "玄幻", "热血", 
                    "重生", "古风", "奇幻", "逆袭", "异能", "宅向",
                    "纯爱", "后宫", "科幻", "魔幻", "推理", "猎奇",
                    "治愈", "都市", "异形", "青春", "末日", "悬疑",
                    "修仙", "战斗"
                ],
                itemType: "category"
            },
            {
                name: "排序",
                type: "fixed",
                categories: ["最新", "热门", "人气"],
                itemType: "category",
                categoryParams: ["newss", "hots", "dayup"]
            }
        ],
        enableRankingPage: false
    };

    // 分类漫画加载
    categoryComics = {
        load: async (category, param, options, page) => {
            try {
                let url;
                
                // 根据分类类型构建URL
                if (param) {
                    // 地区分类
                    if (["cn", "kr", "jp", "ou-mei", "qita"].includes(param)) {
                        url = `${GMH.baseUrl}/manga-genre/${param}/page/${page}`;
                    } else {
                        // 排序分类
                        url = `${GMH.baseUrl}/${param}/page/${page}`;
                    }
                } else if (category && category !== "全部") {
                    // 标签分类
                    let tagMap = {
                        "穿越": "chuanyue", "恋爱": "lianai", "系统": "xitong",
                        "玄幻": "xuanhuan", "热血": "rexue", "重生": "zhongsheng",
                        "古风": "gufeng", "奇幻": "qihuan", "逆袭": "nixi",
                        "异能": "yineng", "宅向": "zhaixiang", "纯爱": "chunai",
                        "后宫": "hougong", "科幻": "kehuan", "魔幻": "mohuan",
                        "推理": "tuili", "猎奇": "lieqi", "治愈": "zhiyu",
                        "都市": "doushi", "异形": "yixing", "青春": "qingchun",
                        "末日": "mori", "悬疑": "xuanyi", "修仙": "xiuxian",
                        "战斗": "zhandou"
                    };
                    let tagSlug = tagMap[category] || category;
                    url = `${GMH.baseUrl}/manga-tag/${tagSlug}/page/${page}`;
                } else {
                    // 全部
                    url = `${GMH.baseUrl}/manga/page/${page}`;
                }
                
                let res = await Network.get(url, GMH.webHeaders);
                if (res.status !== 200) {
                    throw new Error(`请求失败，状态码：${res.status}`);
                }
                
                let document = new HtmlDocument(res.body);
                let comics = [];
                
                // 解析漫画列表
                let items = document.querySelectorAll('.slicarda, .pb-2, [class*="comic"]');
                for (let item of items) {
                    let link = item.querySelector('a[href^="/manga/"]');
                    if (!link) continue;
                    
                    let href = link.attributes['href'];
                    let titleElem = item.querySelector('h3') || link;
                    let title = titleElem.text.trim();
                    
                    let coverElem = item.querySelector('img');
                    let cover = coverElem ? coverElem.attributes['src'] : '';
                    
                    let subTitleElem = item.querySelector('.text-sm, span');
                    let subTitle = subTitleElem ? subTitleElem.text.trim() : '';
                    
                    if (title && href) {
                        comics.push({
                            id: href,
                            title: title,
                            cover: cover,
                            subTitle: subTitle
                        });
                    }
                }
                
                // 检查是否有下一页
                let nextPage = document.querySelector('a[href*="/page/' + (page + 1) + '"]');
                let maxPage = nextPage ? page + 1 : page;
                
                return {
                    comics: comics,
                    maxPage: maxPage
                };
            } catch (err) {
                throw new Error(`分类加载失败：${err.message}`);
            }
        },
        optionList: []
    };

    // 搜索功能
    search = {
        load: async (keyword, options, page) => {
            try {
                let url = `${GMH.baseUrl}/s/${encodeURIComponent(keyword)}?page=${page}`;
                let res = await Network.get(url, GMH.webHeaders);
                
                if (res.status !== 200) {
                    throw new Error(`搜索失败，状态码：${res.status}`);
                }
                
                let document = new HtmlDocument(res.body);
                let comics = [];
                
                // 解析搜索结果
                let items = document.querySelectorAll('.grid-cols-3 > div, .slicarda, .pb-2');
                for (let item of items) {
                    let link = item.querySelector('a[href^="/manga/"]');
                    if (!link) continue;
                    
                    let href = link.attributes['href'];
                    let titleElem = item.querySelector('h3') || link;
                    let title = titleElem.text.trim();
                    
                    let coverElem = item.querySelector('img');
                    let cover = coverElem ? coverElem.attributes['src'] : '';
                    
                    if (title && href) {
                        comics.push({
                            id: href,
                            title: title,
                            cover: cover
                        });
                    }
                }
                
                // 检查是否有下一页
                let nextPage = document.querySelector('a[href*="/page/' + (page + 1) + '"]');
                let maxPage = nextPage ? page + 1 : page;
                
                return {
                    comics: comics,
                    maxPage: maxPage
                };
            } catch (err) {
                throw new Error(`搜索失败：${err.message}`);
            }
        },
        optionList: []
    };

    // 漫画详情
    comic = {
        loadInfo: async (id) => {
            try {
                // 从漫画路径提取 mid
                let mid = null;
                
                // 如果 id 是 URL，提取路径
                let mangaPath = id;
                if (id.startsWith('http')) {
                    let urlObj = new URL(id);
                    mangaPath = urlObj.pathname;
                }
                
                // 获取漫画详情页提取 mid
                let res = await Network.get(`${GMH.baseUrl}${mangaPath}`, GMH.webHeaders);
                if (res.status !== 200) {
                    throw new Error(`加载漫画详情失败，状态码：${res.status}`);
                }
                
                // 提取 mid
                let midMatch = res.body.match(/data-mid="(\d+)"/);
                if (midMatch) {
                    mid = midMatch[1];
                } else {
                    throw new Error("无法提取漫画ID");
                }
                
                // 调用 API 获取详细信息
                let apiRes = await Network.get(
                    `${GMH.apiUrl}/manga/get?mid=${mid}&mode=all`,
                    GMH.headers
                );
                
                if (apiRes.status !== 200) {
                    throw new Error(`API请求失败，状态码：${apiRes.status}`);
                }
                
                let apiData = JSON.parse(apiRes.body);
                if (apiData.code !== 200 || !apiData.data) {
                    throw new Error("API返回数据异常");
                }
                
                let mangaData = apiData.data;
                
                // 构建章节列表
                let chapters = new Map();
                if (mangaData.chapters && mangaData.chapters.length > 0) {
                    for (let chap of mangaData.chapters) {
                        let chapId = chap.id;
                        let chapTitle = chap.attributes ? chap.attributes.title : '';
                        // 章节ID格式: chapter_id
                        chapters.set(chapId, chapTitle);
                    }
                }
                
                // 构建标签
                let tags = {};
                if (mangaData.author) {
                    tags["作者"] = [mangaData.author];
                }
                if (mangaData.status) {
                    let statusMap = { "0": "连载中", "1": "已完结" };
                    tags["状态"] = [statusMap[mangaData.status] || mangaData.status];
                }
                
                return {
                    title: mangaData.title || '',
                    cover: mangaData.cover || '',
                    description: mangaData.desc || '',
                    tags: tags,
                    chapters: chapters,
                    subId: mid  // 保存 mid 用于后续加载章节
                };
            } catch (err) {
                throw new Error(`加载漫画详情失败：${err.message}`);
            }
        },
        
        loadEp: async (comicId, epId) => {
            try {
                // 获取漫画的 mid
                let mangaPath = comicId;
                if (comicId.startsWith('http')) {
                    let urlObj = new URL(comicId);
                    mangaPath = urlObj.pathname;
                }
                
                let res = await Network.get(`${GMH.baseUrl}${mangaPath}`, GMH.webHeaders);
                let midMatch = res.body.match(/data-mid="(\d+)"/);
                if (!midMatch) {
                    throw new Error("无法提取漫画ID");
                }
                let mid = midMatch[1];
                
                // 调用 API 获取章节图片
                let apiRes = await Network.get(
                    `${GMH.apiUrl}/chapter/getinfo?m=${mid}&c=${epId}`,
                    GMH.headers
                );
                
                if (apiRes.status !== 200) {
                    throw new Error(`加载章节失败，状态码：${apiRes.status}`);
                }
                
                let apiData = JSON.parse(apiRes.body);
                if (apiData.code !== 200 || !apiData.data || !apiData.data.info) {
                    throw new Error("章节数据异常");
                }
                
                let images = apiData.data.info.images;
                if (!images || !images.images || images.images.length === 0) {
                    throw new Error("章节图片为空");
                }
                
                // 构建图片URL列表
                let imageUrls = images.images.map(img => {
                    return `${GMH.imageBaseUrl}${img.url}`;
                });
                
                return {
                    images: imageUrls
                };
            } catch (err) {
                throw new Error(`加载章节图片失败：${err.message}`);
            }
        },
        
        onImageLoad: (url, comicId, epId) => {
            return {
                url: url,
                headers: {
                    ...GMH.headers,
                    "Referer": GMH.baseUrl + "/"
                }
            };
        },
        
        onThumbnailLoad: (url) => {
            return {
                headers: {
                    ...GMH.headers,
                    "Referer": GMH.baseUrl + "/"
                }
            };
        }
    };
}
