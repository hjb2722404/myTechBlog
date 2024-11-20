const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取版本号参数
const newVersion = process.argv[2];
if (!newVersion) {
    console.error('Please provide a version number (e.g., npm run version v1.1.2)');
    process.exit(1);
}

// 验证版本号格式
if (!/^v\d+\.\d+\.\d+(-\w+)?$/.test(newVersion)) {
    console.error('Invalid version format. Use format vX.Y.Z or vX.Y.Z-suffix');
    process.exit(1);
}

// 配置文件路径
const configPath = path.join(__dirname, '..', 'nuxt.config.ts');

try {
    // 读取配置文件
    let content = fs.readFileSync(configPath, 'utf8');

    // 更新版本号
    content = content.replace(
        /(console\.log\("Tech Blog Version:", ")v\d+\.\d+\.\d+(-\w+)?(")/,
        `$1${newVersion}$3`
    );

    // 写入文件
    fs.writeFileSync(configPath, content);
    console.log(`✅ Updated version in nuxt.config.ts to ${newVersion}`);

    // Git 操作
    try {
        // 添加更改
        execSync('git add nuxt.config.ts', { stdio: 'inherit' });
        
        // 提交更改
        execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
        
        // 创建标签
        execSync(`git tag -a ${newVersion} -m "Version ${newVersion}"`, { stdio: 'inherit' });
        
        // 推送更改和标签
        execSync('git push && git push --tags', { stdio: 'inherit' });
        
        console.log(`✅ Created and pushed tag ${newVersion}`);
    } catch (error) {
        console.error('❌ Git operations failed:', error.message);
        process.exit(1);
    }
} catch (error) {
    console.error('❌ Failed to update version:', error.message);
    process.exit(1);
}
