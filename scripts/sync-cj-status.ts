/**
 * CJ Dropshipping 商品状态同步脚本
 * 
 * 用法: npx tsx scripts/sync-cj-status.ts
 * 
 * 功能：
 * - 检查所有 CJ 商品的上架状态
 * - 自动将已下架商品标记并隐藏
 * - 记录下架原因和时间
 * 
 * 注意：CJ API 频率限制为每 300 秒 1 次请求
 * 建议在非高峰时段运行，或使用 --delay 参数调整间隔
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';
const DATA_FILE = path.join(process.cwd(), 'data', 'shop-products.json');
const CJ_API_KEY = process.env.CJ_API_KEY || '';

// 命令行参数
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const AUTO_HIDE = !args.includes('--no-auto-hide');
const DELAY_MS = parseInt(args.find(a => a.startsWith('--delay='))?.split('=')[1] || '2000');

// ---------- Types ----------

interface ShopProduct {
    id: string;
    cjPid: string;
    name: string;
    visible: boolean;
    cjStatus?: 'active' | 'discontinued' | 'unknown';
    discontinuedAt?: string;
    discontinuedReason?: string;
    lastSyncedAt?: string;
    [key: string]: any;
}

// ---------- HTTPS Helper ----------

function httpsFetch(url: string, options: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
        };

        const req = https.request(reqOptions, (res) => {
            let body = '';
            res.on('data', (chunk: any) => body += chunk);
            res.on('end', () => {
                resolve({
                    ok: res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    json: async () => JSON.parse(body),
                });
            });
        });

        req.on('error', reject);
        req.setTimeout(60000, () => {
            req.destroy();
            reject(new Error('CJ API Timeout'));
        });

        if (options.body) req.write(options.body);
        req.end();
    });
}

// ---------- CJ API ----------

let cachedToken: { accessToken: string; expiry: number } | null = null;

async function getAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < cachedToken.expiry) {
        return cachedToken.accessToken;
    }

    if (!CJ_API_KEY) {
        throw new Error('CJ_API_KEY environment variable is not set');
    }

    const response = await httpsFetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: CJ_API_KEY }),
    });

    const data = await response.json();
    if (!data.result) throw new Error(`CJ Auth error: ${data.message}`);

    cachedToken = {
        accessToken: data.data.accessToken,
        expiry: Date.now() + 14 * 24 * 60 * 60 * 1000,
    };

    return data.data.accessToken;
}

async function checkProductStatus(pid: string): Promise<{
    status: 'active' | 'discontinued' | 'unknown';
    reason?: string;
}> {
    try {
        const token = await getAccessToken();
        const response = await httpsFetch(`${CJ_BASE_URL}/product/query?pid=${pid}`, {
            method: 'GET',
            headers: {
                'CJ-Access-Token': token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { status: 'discontinued', reason: 'Product not found on CJDropshipping (404)' };
            }
            return { status: 'unknown', reason: `HTTP error: ${response.status}` };
        }

        const data = await response.json();

        if (!data.result) {
            const msg = (data.message || '').toLowerCase();
            if (
                msg.includes('not found') ||
                msg.includes('does not exist') ||
                msg.includes('no product') ||
                msg.includes('invalid') ||
                msg.includes('offline') ||
                msg.includes('下架') ||
                msg.includes('不存在')
            ) {
                return { status: 'discontinued', reason: `CJ API: ${data.message}` };
            }
            return { status: 'unknown', reason: `CJ API error: ${data.message}` };
        }

        const product = data.data;
        if (!product || !product.pid) {
            return { status: 'discontinued', reason: 'Product data empty or invalid' };
        }

        return { status: 'active' };
    } catch (err: any) {
        const msg = (err?.message || '').toLowerCase();
        if (msg.includes('timeout') || msg.includes('proxy')) {
            return { status: 'unknown', reason: `Network error: ${err.message}` };
        }
        return { status: 'unknown', reason: `Error: ${err.message}` };
    }
}

// ---------- Main ----------

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🔄 CJDropshipping 商品状态同步脚本');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  模式: ${DRY_RUN ? '🔍 预览（不写入）' : '✏️  实际写入'}`);
    console.log(`  自动隐藏下架商品: ${AUTO_HIDE ? '✅ 是' : '❌ 否'}`);
    console.log(`  请求间隔: ${DELAY_MS}ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // 读取商品数据
    let products: ShopProduct[];
    try {
        products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch {
        console.error('❌ 无法读取商品数据文件:', DATA_FILE);
        process.exit(1);
    }

    const cjProducts = products.filter(p => p.cjPid);
    console.log(`📦 找到 ${cjProducts.length} 个 CJ 商品（共 ${products.length} 个）`);
    console.log('');

    if (cjProducts.length === 0) {
        console.log('⚠️  没有需要同步的 CJ 商品');
        process.exit(0);
    }

    // 统计
    let activeCount = 0;
    let discontinuedCount = 0;
    let unknownCount = 0;
    let newlyDiscontinued = 0;
    let autoHiddenCount = 0;

    const results: Array<{
        name: string;
        cjPid: string;
        status: string;
        changed: boolean;
        reason?: string;
    }> = [];

    for (let i = 0; i < cjProducts.length; i++) {
        const product = cjProducts[i];
        process.stdout.write(`\r  [${i + 1}/${cjProducts.length}] 检查: ${product.name.slice(0, 40).padEnd(40)}...`);

        const statusResult = await checkProductStatus(product.cjPid);
        const previousStatus = product.cjStatus || 'unknown';
        const now = new Date().toISOString();
        let changed = false;

        if (statusResult.status === 'active') {
            activeCount++;
            if (previousStatus === 'discontinued') {
                // 商品重新上架
                changed = true;
                if (!DRY_RUN) {
                    const idx = products.findIndex(p => p.id === product.id);
                    if (idx !== -1) {
                        products[idx].cjStatus = 'active';
                        products[idx].lastSyncedAt = now;
                        delete products[idx].discontinuedAt;
                        delete products[idx].discontinuedReason;
                    }
                }
                results.push({ name: product.name, cjPid: product.cjPid, status: '✅ 重新上架', changed: true });
            } else {
                if (!DRY_RUN) {
                    const idx = products.findIndex(p => p.id === product.id);
                    if (idx !== -1) {
                        products[idx].cjStatus = 'active';
                        products[idx].lastSyncedAt = now;
                    }
                }
                results.push({ name: product.name, cjPid: product.cjPid, status: '✅ 在售', changed: false });
            }
        } else if (statusResult.status === 'discontinued') {
            discontinuedCount++;
            if (previousStatus !== 'discontinued') {
                newlyDiscontinued++;
                changed = true;
                if (!DRY_RUN) {
                    const idx = products.findIndex(p => p.id === product.id);
                    if (idx !== -1) {
                        products[idx].cjStatus = 'discontinued';
                        products[idx].discontinuedAt = now;
                        products[idx].discontinuedReason = statusResult.reason || 'Product discontinued on CJDropshipping';
                        products[idx].lastSyncedAt = now;
                        if (AUTO_HIDE && products[idx].visible) {
                            products[idx].visible = false;
                            autoHiddenCount++;
                        }
                    }
                }
                results.push({
                    name: product.name,
                    cjPid: product.cjPid,
                    status: '⚠️  新下架',
                    changed: true,
                    reason: statusResult.reason,
                });
            } else {
                if (!DRY_RUN) {
                    const idx = products.findIndex(p => p.id === product.id);
                    if (idx !== -1) {
                        products[idx].lastSyncedAt = now;
                    }
                }
                results.push({
                    name: product.name,
                    cjPid: product.cjPid,
                    status: '❌ 已下架',
                    changed: false,
                    reason: product.discontinuedReason,
                });
            }
        } else {
            unknownCount++;
            if (!DRY_RUN) {
                const idx = products.findIndex(p => p.id === product.id);
                if (idx !== -1) {
                    products[idx].cjStatus = 'unknown';
                    products[idx].lastSyncedAt = now;
                }
            }
            results.push({
                name: product.name,
                cjPid: product.cjPid,
                status: '❓ 未知',
                changed: false,
                reason: statusResult.reason,
            });
        }

        // 避免频率限制
        if (i < cjProducts.length - 1) {
            await sleep(DELAY_MS);
        }
    }

    console.log('\r' + ' '.repeat(80) + '\r');

    // 保存结果
    if (!DRY_RUN) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
        console.log('💾 已保存更新到:', DATA_FILE);
    }

    // 打印结果
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  📊 同步结果');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  ✅ 在售:       ${activeCount}`);
    console.log(`  ❌ 已下架:     ${discontinuedCount} (新增: ${newlyDiscontinued})`);
    console.log(`  ❓ 未知状态:   ${unknownCount}`);
    if (AUTO_HIDE && autoHiddenCount > 0) {
        console.log(`  🙈 自动隐藏:   ${autoHiddenCount} 个商品`);
    }
    console.log('');

    // 打印变更详情
    const changed = results.filter(r => r.changed);
    if (changed.length > 0) {
        console.log('  📋 状态变更:');
        for (const r of changed) {
            console.log(`    ${r.status} ${r.name}`);
            if (r.reason) {
                console.log(`       原因: ${r.reason.replace(/^CJ API:\s*/i, '')}`);
            }
        }
        console.log('');
    }

    // 打印所有下架商品
    const discontinued = results.filter(r => r.status.includes('下架'));
    if (discontinued.length > 0) {
        console.log('  ⚠️  下架商品列表:');
        for (const r of discontinued) {
            console.log(`    • ${r.name} (PID: ${r.cjPid})`);
        }
        console.log('');
    }

    if (DRY_RUN) {
        console.log('  ℹ️  预览模式：未写入任何更改');
        console.log('  运行不带 --dry-run 参数以实际执行同步');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}

main().catch(err => {
    console.error('');
    console.error('❌ 同步失败:', err.message);
    process.exit(1);
});