import { formatArticleData } from '../../services/formatArticleData.js'
import { writeFileContent, resolvePathFromMeta, readFileContent } from "../../../utils/file.js";
import { personNameIdMap } from '../../../config/x.js'
import { sleep } from '../../../utils/utils.js'
import { fetchUserTweets } from './fetchUserTweets.js'

function extractMedia(tweetResult) {
    const legacy = tweetResult?.legacy;
    const retweet = tweetResult?.retweeted_status_result?.result?.legacy;
    const quote = tweetResult?.quoted_status_result?.result?.legacy;
    const card = tweetResult?.card?.legacy;
    
    // 调试信息
    console.log('Tweet 结构:', {
        hasLegacy: !!legacy,
        hasRetweet: !!retweet,
        hasQuote: !!quote,
        hasCard: !!card
    });

    const tryMedia = (legacyObj) => {
        const mediaEntities = legacyObj?.extended_entities?.media || legacyObj?.entities?.media || [];
        const results = [];

        for (const media of mediaEntities) {
            if (media.type === 'photo') {
                results.push({
                    type: 'photo',
                    url: media.media_url_https
                });
            } else if (media.type === 'video' || media.type === 'animated_gif') {
                const variants = media.video_info?.variants || [];
                const best = variants
                    .filter(v => v.content_type === 'video/mp4')
                    .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
                if (best?.url) {
                    results.push({
                        type: media.type,
                        url: best.url
                    });
                }
            }
        }

        return results;
    };

    // 从卡片中提取媒体
    const extractCardMedia = (card) => {
        if (!card || !card.binding_values) return [];
        
        const results = [];
        const bindingValues = card.binding_values;
        
        // 查找卡片中的图片
        const imageKeys = [
            'photo_image_full_size_large',
            'thumbnail_image_large',
            'summary_photo_image_large'
        ];
        
        for (const key of imageKeys) {
            const imageValue = bindingValues.find(v => v.key === key)?.value?.image_value;
            if (imageValue?.url) {
                results.push({
                    type: 'photo',
                    url: imageValue.url
                });
                break; // 找到一个图片就足够了
            }
        }
        
        return results;
    };

    // 合并所有来源的媒体
    const results = [
        ...tryMedia(legacy),
        ...tryMedia(retweet),
        ...tryMedia(quote),
        ...extractCardMedia(card)
    ];
    
    // 去重（可能有重复的媒体URL）
    const uniqueResults = [];
    const urls = new Set();
    
    for (const media of results) {
        if (!urls.has(media.url)) {
            urls.add(media.url);
            uniqueResults.push(media);
        }
    }
    
    console.log('提取的媒体:', uniqueResults);
    
    return uniqueResults;
}

async function compactTweets(json, key) {
    const instructions = json.user?.result?.timeline?.timeline?.instructions || [];
    const entries = instructions.flatMap(inst => inst.entries || []);
    const tweetEntries = entries.filter(e =>
        e.content?.itemContent?.tweet_results?.result?.legacy
    );

    const compactList = tweetEntries.map(e => {
        const result = e.content.itemContent.tweet_results.result;
        const legacy = result?.legacy;
        const user = result?.core?.user_results?.result?.legacy;
        const tweetText = legacy?.full_text || "";
        const allMedia = extractMedia(result); // 假设 extractMedia 返回 { type, url }[]

        const formattedArticle = formatArticleData({
            id: legacy?.id_str || "",
            author: user ? `${user.name} (@${user.screen_name})` : "",
            avatar: user?.profile_image_url_https || "",
            title: tweetText, // 从正文生成标题
            content: tweetText, // 清洗后的内容，这里暂时用原始内容
            rawContent: tweetText, // 原始内容
            link: user && legacy ? `https://twitter.com/${user.screen_name}/status/${legacy.id_str}` : "",
            date: legacy?.created_at ? legacy.created_at : null, // 保持 YYYY-MM-DD HH:mm:ss 格式
            summary: '', // 从正文生成摘要
            media: allMedia, // 包含所有媒体
            platform: `twitter-${key}`, // 平台
        })

        return formattedArticle
    });

    return compactList;
}

export async function crawlTwitterNews() {
    console.log(`📥 正在抓取 Twitter 资讯...`);

    // const outputFilePathResult = resolvePathFromMeta(import.meta.url, '..', 'data', `tweets-4398626122.json`);
    // const fileContnetStr = await readFileContent(outputFilePathResult)
    // const fileContnet = JSON.parse(fileContnetStr)

    const keys = Object.keys(personNameIdMap);
    let allTweets = []

    for (const key of keys) {
        const id = personNameIdMap[key];

        await sleep(1000)
        const result = await fetchUserTweets(id);
        // const result = fileContnet;

        // 使用 __dirname 构建路径 (代码不变)
        const outputFilePath = resolvePathFromMeta(import.meta.url, '..', 'data', `tweets-${id}.json`);
        await writeFileContent(outputFilePath, result)

        const tweets = await compactTweets(result, key);
        allTweets.push(...tweets);
        
        const outputFilePath2 = resolvePathFromMeta(import.meta.url, '..', 'data', `tweets-ompact-${id}.json`);
        await writeFileContent(outputFilePath2, tweets)
    }


    const outputFilePath3 = resolvePathFromMeta(import.meta.url, '..', 'data', `all-tweets-ompact.json`);
    await writeFileContent(outputFilePath3, allTweets)

    console.log(`✅ 共抓取 ${allTweets.length} 条资讯 ✅`);
    return allTweets;
}
