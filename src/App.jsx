import { useEffect, useRef } from "react";
import ForceGraph3D from "3d-force-graph";

export default function App() {

  const ref = useRef();

  useEffect(() => {

    /*
    const data = {

      nodes: [
        { id: "爱" },
        { id: "情感" },
        { id: "行动" },
        { id: "关系" },
        { id: "同情" },
        { id: "帮助" },
        { id: "牺牲" }
      ],

      links: [
        { source: "爱", target: "情感" },
        { source: "爱", target: "行动" },
        { source: "爱", target: "关系" },
        { source: "情感", target: "同情" },
        { source: "行动", target: "帮助" },
        { source: "帮助", target: "牺牲" },
        { source: "同情", target: "牺牲" }
      ]
    };
    
    */

    // 示例输入文本，实际换成输入框state
    const text = `爱(你,我(她,他),她)`;
    const { nodes, links } = parseBracketText(text);

    const data = { nodes, links };

    const radius = 300;

    // 批量把所有节点铺到球面
    data.nodes.forEach((node, index) => {
      const phi = Math.acos(-1 + (2 * index) / data.nodes.length);
      const theta = Math.sqrt(data.nodes.length * Math.PI) * phi;
      node.x = radius * Math.cos(theta) * Math.sin(phi);
      node.y = radius * Math.sin(theta) * Math.sin(phi);
      node.z = radius * Math.cos(phi);
    });



    ForceGraph3D()(ref.current)
      .graphData(data);
    //.forceEngine(null); // 禁用自动物理扩散，锁定球面位置

  }, []);

  return <div ref={ref} style={{ width: "100vw", height: "100vh" }} />;
}

/**
 * 解析括号层级文本，输出 {nodes, links}
 * @param {string} text 带括号层级文本
 * @returns {{nodes:Array, links:Array}}
 */
function parseBracketText(text) {
  // 1. 清理空白
  const cleanStr = text.replace(/\s+/g, "");
  // 2. 同时分割 ( ) , 三种符号
  const rawTokens = cleanStr.split(/([(),])/);
  // 过滤空字符串+去首尾空格
  let tokens = rawTokens.map(s => s.trim()).filter(s => s !== "");

  const nodes = [];
  const links = [];
  const stack = [];
  const nodeIdSet = new Set();
  // 标记：下一个文字是否需要压栈（只有(后面的节点才会成为父容器）
  let needPushNextNode = false;

  for (const token of tokens) {
    if (token === "(") {
      needPushNextNode = true;
      continue;
    }
    if (token === ")") {
      stack.pop();
      needPushNextNode = false;
      continue;
    }
    if (token === ",") {
      // 逗号仅分隔，无逻辑
      continue;
    }

    // 普通文字节点
    const nodeId = token;
    if (!nodeIdSet.has(nodeId)) {
      nodeIdSet.add(nodeId);

      //新增


      nodes.push({ id: nodeId });
    }

    // 栈存在父级，创建父子连线
    if (stack.length > 0) {
      const parentId = stack.at(-1);
      links.push({ source: parentId, target: nodeId });
    }

    // 仅左括号后的节点才压栈，作为后续子节点的父
    if (needPushNextNode) {
      stack.push(nodeId);
      needPushNextNode = false;
    }
    // 普通同级节点不压栈，不会形成链式嵌套
  }

  return { nodes, links };
}