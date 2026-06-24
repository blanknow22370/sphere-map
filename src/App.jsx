import { useEffect, useRef } from "react";

import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";

import { parseBracketText } from "./parseBracketText";
import { applySphereLayout } from "./sphereLayout";

export default function App() {

  const graphRef = useRef();

  useEffect(() => {

    const text = `
      自我(认知(短时记忆, 长期记忆, 逻辑推理, 归纳总结, 发散想象, 具象联想, 价值判断, 利弊权衡, 观察力, 洞察力)
      情绪(喜悦, 狂喜, 温柔, 哀伤, 孤独, 委屈, 愤怒, 烦躁, 惶恐, 焦虑, 松弛平静, 麻木淡漠)
      行为(口头表达, 文字输出, 肢体沟通, 落地实践, 持续坚持, 拖延懈怠, 自律作息, 消费取舍, 人际妥协, 主动争取, 复盘反思, 盲目冲动)
      内在需求(生存安全感, 稳定环境, 群体归属感, 被理解, 被尊重, 自我价值认可, 能力成长, 边界自由, 新鲜感探索, 内心安宁)
      人际维度(直系亲情, 长辈亲缘, 同辈手足, 知心挚友, 泛泛之交, 亲密爱情, 职场同事, 师长前辈, 陌生人社交, 圈层人脉)
      人生目标(短期生活规划, 年度成长计划, 职业发展路径, 财富物质积累, 健康体魄养护, 精神思想丰盈, 兴趣爱好深耕, 社会价值贡献, 家庭安稳幸福, 自我圆满通透)
      性格特质(内向内敛, 外向开朗, 敏感细腻, 粗线条豁达, 完美主义, 佛系随缘, 果敢决断, 犹豫多虑, 共情心软, 理性冷感)
      资源能力(专业技能, 学习悟性, 人脉资源, 时间精力, 金钱储备, 心态抗压, 创意脑洞, 统筹规划, 执行落地, 复盘优化)
      痛苦障碍(自我否定, 攀比内耗, 害怕失败, 恐惧孤独, 无力改变, 执念放不下, 自卑敏感, 过度讨好, 完美焦虑, 逃避困难))`;

    const {
      nodes,
      links,
      dimensionColorMap
    } = parseBracketText(text);

    applySphereLayout(nodes);

    const graph =
      ForceGraph3D()(graphRef.current);

    graph.graphData({
      nodes,
      links
    });


    // ✅ 修复

    graph.nodeVal(node => node.weight * 10);


    // ✅ 修复

    graph.nodeThreeObject(node => {

      return new THREE.Mesh(
        new THREE.SphereGeometry(
          node.weight * 4,
          16,
          16
        ),
        new THREE.MeshBasicMaterial({
          color:
            dimensionColorMap[node.dimension]
            || "#cccccc",

          transparent: true,

          opacity: node.hot
        })
      );
    });

    graph.nodeLabel(node => `
ID: ${node.id}
Level: ${node.level}
Dimension: ${node.dimension}
    `);

    // 固定位置

    nodes.forEach(node => {

      node.fx = node.x;
      node.fy = node.y;
      node.fz = node.z;
    });

    graph.cooldownTicks(0);

    graph.zoomToFit(1000);

  }, []);

  return (
    <div
      ref={graphRef}
      style={{
        width: "100vw",
        height: "100vh"
      }}
    />
  );
}