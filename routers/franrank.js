const router = require('koa-router')();
const { query } = require('../model/mysql')
const sql = require('../model/mysql.js');
const redis = require("../model/redis");

//加盟商等级
router.get('/yuyue/franrank', async(ctx,next)=>{
    console.log('franrank进来了');
    let sql = 'SELECT * FROM be_franrank ';
    let dataList = await query( sql );
    // console.log(dataList);
    ctx.body = dataList;
    console.log('ctx.session ',ctx.session);
    console.log('ctx.cookies',ctx.cookies.get('name'));
    console.log('ctx.request ',ctx.request);
    // console.log('ctx.sessionID',ctx.sessionID)
})

//加盟山基本信息
router.get('/yuyue/franinfo',async(ctx,next)=>{
    console.log('franinfo进来了');
    let result = await sql.findBaseFranInfo();
    ctx.body = result;
})

//加盟商详细信息
router.get('/yuyue/frandetail/:id',async(ctx,next)=>{
    console.log('frandetail进来了');
    let id = ctx.params.id;
    await sql.findFranDetailInfo(id)
        .then(data=>{
            if(data.length>0) {
                ctx.body = data;
            }else {
                ctx.body = {message:"没有找到相关数据",code:0}
            }
        })
})

//修改加盟商信息
router.post('/yuyue/modifyfran/:id',async(ctx,next)=>{
    console.log('modifyfran进来了');
    let id = ctx.params.id;
    let res = ctx.request.body;  
    await sql.modifyFranInfo([
        res.name, res.rank, res.state, res.type, res.id_type,
        res.id_number,
        res.resginster_address, res.commu_address,
        res.legal_person, res.legal_person_phone, res.legal_person_mailbox,
        res.contact_name, res.contact_phone, res.contact_mailbox,
        res.account_name, res.account_number, res.bank, res.remark,
    ],id)
        .then(res=>{  
                console.log("修改成功");
                ctx.body = true;})
        .catch((err=>{
            console.log(err);
        }))  
})

//新增加盟商信息
router.post('/yuyue/addfraninfo/:name',async(ctx,next)=>{
    console.log('addfraninfo进来了');
    let name = ctx.params.name;
    let res = ctx.request.body; 
    await sql.addFranInfo([
        res.name, res.rank, res.state, res.type, res.id_type,
        res.id_number,
        res.resginster_address, res.commu_address,
        res.legal_person, res.legal_person_phone, res.legal_person_mailbox,
        res.contact_name, res.contact_phone, res.contact_mailbox,
        res.account_name, res.account_number, res.bank, res.remark,
    ],name)
        .then(res=>{
            console.log("新增加盟商信息成功");
            ctx.body = true;
        })
        .catch(err=>{
            console.log(err);
        })
  
})

//新增加盟商等级
router.post("/yuyue/addfranrank",async(ctx,next)=>{
    console.log('addfranrank进来了');
    let res = ctx.request.body; 
    await sql.addFranRank([
        res.rank_name,
        res.discount,
        res.dividend
    ])
        .then(res=>{
            console.log("新增加盟商等级成功");
            ctx.body = true;
        })
        .catch(err=>{
            console.log(err);
        })
})

//加盟商信息删除
router.del("/yuyue/franinfo/:id", async(ctx,next)=>{
    let id = ctx.params.id;
    await sql.deleteFranInfo(id)
        .then(res=>{
            console.log("删除加盟商信息成功");
            ctx.body = true;
        })
        .catch(err=>{
            console.log(err);
        })
})

//加盟商等级删除 修改的功能直接可以删除+新增替换 反正字段少
router.del("/yuyue/franrank/:id", async(ctx,next)=>{
    let id = ctx.params.id;
    await sql.deleteFranRank(id)
        .then(res=>{
            console.log("删除加盟商等级成功");
            ctx.body = true;
        })
        .catch(err=>{
            console.log(err);
        })
})

router.get('/redis',async(ctx, next)=>{
    redis.getKey("dd").then((res)=>{
        console.log("redis：", res);
    })
    
})




module.exports = router; 