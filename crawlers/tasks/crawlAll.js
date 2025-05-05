import { crawlQbitNews } from '../sites/qbitai.js';
import { crawlHuggingfaceNews } from '../sites/huggingface.js';
import { crawlTwitterNews } from '../sites/x/index.js';
import { crawlAnthropicNews } from '../sites/anthropic.js';
import { crawlGoogleNews } from '../sites/google.js';
import { addNewsBatch } from '../../models/articleModel.js';
import { resetAllTables } from '../../models/articleModel.js';

/**
 * 爬取所有平台的数据并保存到数据库
 * @param {Object} options - 爬取选项
 * @param {boolean} options.reset - 是否重置数据库
 * @param {boolean} options.qbit - 是否爬取量子位
 * @param {boolean} options.huggingface - 是否爬取 HuggingFace
 * @param {boolean} options.twitter - 是否爬取 Twitter
 * @returns {Promise<Object>} 爬取结果统计
 */
export async function crawlAllPlatforms(options = {}) {
    console.log('🚀 开始爬取所有平台数据...');

    const defaultOptions = {
        reset: true,
        qbit: true,
        huggingface: true,
        anthropic: true,
        google: true,
        twitter: false
    };

    const opts = { ...defaultOptions, ...options };
    const results = {
        total: 0,
        platforms: {}
    };

    // 如果需要重置数据库
    if (opts.reset) {
        console.log('🗑️ 正在重置数据库...');
        await resetAllTables();
        console.log('✅ 数据库已重置');
    }

    // 爬取量子位
    if (opts.qbit) {
        try {
            console.log('📊 开始爬取量子位...');
            const qbitArticles = await crawlQbitNews({ pages: 2, perPage: 20 });
            const savedArticles = await addNewsBatch(qbitArticles);

            results.platforms.qbit = {
                crawled: qbitArticles.length,
                saved: savedArticles.length
            };
            results.total += savedArticles.length;

            console.log(`✅ 量子位爬取完成，共爬取 ${qbitArticles.length} 条，保存 ${savedArticles.length} 条`);
        } catch (error) {
            console.error('❌ 量子位爬取失败:', error);
            results.platforms.qbit = { error: error.message };
        }
    }

    // 爬取 HuggingFace
    if (opts.huggingface) {
        try {
            console.log('📊 开始爬取 HuggingFace...');
            const hfArticles = await crawlHuggingfaceNews({ skip: 0 });
            const savedArticles = await addNewsBatch(hfArticles);

            results.platforms.huggingface = {
                crawled: hfArticles.length,
                saved: savedArticles.length
            };
            results.total += savedArticles.length;

            console.log(`✅ HuggingFace 爬取完成，共爬取 ${hfArticles.length} 条，保存 ${savedArticles.length} 条`);
        } catch (error) {
            console.error('❌ HuggingFace 爬取失败:', error);
            results.platforms.huggingface = { error: error.message };
        }
    }

    // 爬取 Anthropic
    if (opts.anthropic) {
        try {
            console.log('📊 开始爬取 Anthropic...');
            const anthropicArticles = await crawlAnthropicNews();
            const savedArticles = await addNewsBatch(anthropicArticles);

            results.platforms.anthropic = {
                crawled: anthropicArticles.length,
                saved: savedArticles.length
            };
            results.total += savedArticles.length;

            console.log(`✅ Anthropic 爬取完成，共爬取 ${anthropicArticles.length} 条，保存 ${savedArticles.length} 条`);
        } catch (error) {
            console.error('❌ Anthropic 爬取失败:', error);
            results.platforms.anthropic = { error: error.message };
        }
    }

    // 爬取 Google
    if (opts.google) {
        try {
            console.log('📊 开始爬取 Google...');
            const googleArticles = await crawlGoogleNews({ maxPages: 2 });
            const savedArticles = await addNewsBatch(googleArticles);

            results.platforms.google = {
                crawled: googleArticles.length,
                saved: savedArticles.length
            };
            results.total += savedArticles.length;

            console.log(`✅ Google 爬取完成，共爬取 ${googleArticles.length} 条，保存 ${savedArticles.length} 条`);
        } catch (error) {
            console.error('❌ Google 爬取失败:', error);
            results.platforms.google = { error: error.message };
        }
    }

    // 爬取 Twitter
    if (opts.twitter) {
        try {
            console.log('📊 开始爬取 Twitter...');
            const twitterArticles = await crawlTwitterNews();
            const savedArticles = await addNewsBatch(twitterArticles);

            results.platforms.twitter = {
                crawled: twitterArticles.length,
                saved: savedArticles.length
            };
            results.total += savedArticles.length;

            console.log(`✅ Twitter 爬取完成，共爬取 ${twitterArticles.length} 条，保存 ${savedArticles.length} 条`);
        } catch (error) {
            console.error('❌ Twitter 爬取失败:', error);
            results.platforms.twitter = { error: error.message };
        }
    }

    console.log(`🎉 所有平台爬取完成，共保存 ${results.total} 条数据`);
    return results;
}


export function crawlAllPlatforms2() {
    console.log('🚀 开始爬取所有平台数据...');
}