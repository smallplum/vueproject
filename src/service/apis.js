const gethttpfix = (api) => {
    const re = /.*search\/moleculeDetail.*/g;
    let httpfix = window.location.hostname;
    let hostport = window.location.port;
    // console.log(window.location.href, re.test(window.location.href), '===')
    if (re.test(window.location.href)) {
        // console.log(httpfix, "====httpfix");
        hostport = 8030;
    }
    httpfix = "52.80.58.209";
    // let route = `http://${httpfix}:${hostport}${api}`;
    let route = `${api}`;
    return route;
}
export default {
    apis: {
        //骨架跃迁
        scaffoldhopping: '/molecule/innovation/generate/rank',
        innovation:gethttpfix('/molecule/innovation/ref/smiles'),
        innovationfile:gethttpfix('/molecule/innovation/file/smiles'),
        //任务提交
        taskdetail: '/molecule/task/create',
        tasklist: '/molecule/task/list',
        taskcollect:'/molecule/task/collect',
        stoptask:'/molecule/task/stop',
        deletetask:'/molecule/task/remove',
        taskdescription:'/molecule/task/description',
        listdetail:'/molecule/task/detail',
        restart:'/molecule/task/restart',
        downloadsdf:'/molecule/task/download/sdf',
        //分子详情
        moleculedetail: gethttpfix('/molecule/info/detail'),
        checkpdb: gethttpfix('/molecule/common/pdbbind'),
        mockexists: gethttpfix('/molecule/info/exists'),
        skeletonsvg:gethttpfix('/molecule/innovation/smiles/svg'),
        moleculepredictdetail: gethttpfix('/molecule/info/admet'),
        experimentsave: gethttpfix('/molecule/info/experiment'),
        docking: gethttpfix('/molecule/info/3d/docking'),
        experimentpredictselect: gethttpfix('/molecule/info/admet/configs'),
        //ocr结构提取
        ocrfileupload: gethttpfix('/molecule/ocsr/file'),
        ocrmolslist: gethttpfix('/molecule/ocsr/mols'),
        ocrfileindentify: gethttpfix('/molecule/ocsr/identify'),
        ocrfeeback: gethttpfix('/molecule/ocsr/correction'),
        ocrfiledownload: gethttpfix('/molecule/ocsr/download'),
        ocrfiledownloadcsv: gethttpfix('/molecule/ocsr/download/csv'),
        ocrfiledownloadsdf: gethttpfix('/molecule/ocsr/download/sdf'),
        ocrfileinvalid: gethttpfix('/molecule/ocsr/invalid'),
        //jsme图片识别
        ocrinput: '/molecule/common/ocsr/smiles',
        //收藏分子
        moleculecollect: '/api/v1/favorites/',


    },
}
