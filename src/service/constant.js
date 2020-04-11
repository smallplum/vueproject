export const TOOLTIP = {
    search: {
        moleculeDetail: {
            abstract: {
                ro5: "类药五原则判断条件： \r \n 同时满足：分子量M≤500、氢键供体数目HBD≤5、氢键受体数目HBA≤10、-5≤脂溶性logP≤5",
                qed: "类药性指标为QED， RDKit计算所得",
                sa_score: "合成可及性指标为SA score， RDKit计算所得"
            },
            detail: {
                struct: {
                    props: "分子属性为RDKit计算所得",
                    group: "官能团为RDKit计算所得，系统暂只关注下表中14种官能团"
                },
                physicochemical: {
                    physicochemical: "理化性质为RDKit计算所得（除外溶解度logS）",
                    logs: "溶解度logS预测模型为stonewise自研"
                },
                dmpk: {
                    dmpk: "DMPK预测模型为stonewise自研",
                    abnormalrate: "模型预测方向为异常，异常值为：不吸收/不透过/<30%/底物/抑制剂；异常概率指发生异常的可能性"
                },
                t: {
                    t: "毒性预测模型为stonewise自研",
                    t_rate: "模型预测方向为有相应毒性；毒性概率指有相应毒性的可能性"
                },
                rank: {
                    rank_exist: "已有分子指ChEMBL中当前靶点有实验记录的分子"
                }

            }

        }
    }
}
