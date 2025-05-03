// 解析原始响应体并修改特定布尔字段
let obj = JSON.parse($response.body
  .replace(/\"pay\":\w+/g, '"pay":false')        // 将所有"pay"字段设为false（未付费）
  .replace(/\"isFreeTime\":\w+/g, '"isFreeTime":true')  // 将所有"isFreeTime"设为true（免费时间）
  .replace(/\"unlock\":\w+/g, '"unlock":true')   // 将所有"unlock"设为true（已解锁）
  .replace(/\"isQimen\":\w+/g, '"isQimen":true') // 将所有"isQimen"设为true（可能是某种权限标记）
);

let requestUrl = $request.url;

// 根据请求URL路径返回不同的VIP数据
if (/^https:\/\/ios-api-v5-0\.yangcong345\.com\/growth-operation-config\/api\/vip\/info?/.test(requestUrl)) {
    // VIP基本信息接口 - 返回VIP等级和图片
    obj = {
        vipImg: "https://fp.yangcong345.com/20220511-161140-fd429b8764e42a1d34152e84c9cb06fb.png",
        vipLevel: 5,  // 最高VIP等级
    }
} 
else if (/^https:\/\/ios-api-v5-0\.yangcong345\.com\/api\/client\/userAuth?/.test(requestUrl)) {
    // 用户认证接口 - 返回详细的VIP授权信息
    obj.auth = {};
    obj.auth.vip = [{
        sourceId: "mhcj:1700989713094587445",
        id: "vip#4-5",
        expired: false,  // 未过期
        sourceType: "十周年集卡社-1天",  // 来源类型
        expireTime: "2222-02-02T15:59:59.999Z",  // 过期时间设为遥远的未来
        authId: "dba80b65-b658-4a1b-a40a-37923bb9f698",
    }, 
    // ...（多个类似的VIP授权对象，包含不同课程和权限）
    ];
} 
else if (/^https:\/\/ios-api-v5-0\.yangcong345\.com\/api\/client\/userAuth\/current?/.test(requestUrl)) {
    // 当前用户认证接口 - 添加正在使用的VIP订阅
    obj.data.push([{
        state: "using",  // 使用中状态
        createdAt: "2023-12-24T09:00:02.051Z",
        endTime: "2222-02-02T15:59:59.999Z",  // 结束时间设为遥远的未来
        targetType: "vip",  // 目标类型为VIP
        // ...其他字段
    },
    // ...（多个类似的使用中的VIP订阅记录）
    ])
} 
else if (/^https:\/\/7to12\.yangcong345\.com\/backend\/api\/client\/userAuth?/.test(requestUrl)) {
    // 7-12年级后端用户认证接口 - 简化的VIP信息
    obj.auth = {};
    obj.auth.vip = [{
        id: "vip#4-5",
        expired: false,
        expireTime: "2222-02-02T15:59:59.999Z",  // 过期时间设为遥远的未来
    },
    // ...（多个类似的VIP信息记录）
    ]
} 
else if (/^https:\/\/ios-api-v5-0\.yangcong345\.com\/course-mall\/app\/mytabs?/.test(requestUrl)) {
    // 课程商城我的标签接口 - 返回定制化的课程标签页
    obj = {
        tabs: [{
            tabName: "会员课",
            bgImg: "https://fp.yangcong345.com/revenue-admin/vip-999aa50ccc0f1dc8cb3546df0640f557.png",
            elements: [{
                // 页面元素配置，包括文本、图片、按钮等
                text: "<div><span style=\"color:#fff;font-size:16px;\">已全部开通</span></div>",  // 显示已开通状态
                // ...其他元素配置
            }]
        },
        // ...其他标签页配置
        ]
    }
}

// 返回修改后的响应体
$done({
    body: JSON.stringify(obj)
});