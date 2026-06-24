export function parseBracketText(text) {

    const cleanStr = text.replace(/\s+/g, "");

    const tokens = cleanStr
        .split(/([(),])/)
        .map(t => t.trim())
        .filter(Boolean);

    const nodes = [];
    const links = [];

    const nodeSet = new Set();
    const linkSet = new Set();

    const stack = [];

    // ✅ 修复
    // 记录最近出现的节点
    let lastNode = null;

    const dimensionColorMap = {
        Root: "#ffffff",

        认知: "#9c27b0",
        情绪: "#f44336",
        行为: "#2196f3",
        内在需求: "#00bcd4",
        人际维度: "#4caf50",
        人生目标: "#ff9800",
        性格特质: "#e91e63",
        资源能力: "#8bc34a",
        痛苦障碍: "#607d8b"
    };

    for (const token of tokens) {

        //--------------------------------
        // 左括号
        //--------------------------------

        if (token === "(") {

            // ✅ 修复
            if (lastNode) {
                stack.push(lastNode);
            }

            continue;
        }

        //--------------------------------
        // 右括号
        //--------------------------------

        if (token === ")") {

            if (stack.length > 0) {
                stack.pop();
            }

            continue;
        }

        //--------------------------------
        // 逗号
        //--------------------------------

        if (token === ",") {
            continue;
        }

        //--------------------------------
        // 普通节点
        //--------------------------------

        const nodeId = token;

        //--------------------------------
        // 创建节点
        //--------------------------------

        if (!nodeSet.has(nodeId)) {

            nodeSet.add(nodeId);

            const level = stack.length + 1;
            // ✅ 修复
            const dimension =
                stack.length === 0
                    ? "Root"
                    : stack[stack.length - 1];

            const weight =
                level === 1
                    ? 1.5
                    : level === 2
                        ? 1.1
                        : 0.8;

            const hot =
                level === 1
                    ? 1
                    : level === 2
                        ? 0.9
                        : 0.7;

            nodes.push({
                id: nodeId,
                level,
                dimension,
                weight,
                hot
            });
        }

        //--------------------------------
        // 创建连线
        //--------------------------------

        if (stack.length > 0) {

            const parentId = stack[stack.length - 1];

            const key = `${parentId}->${nodeId}`;
            // ✅ 修复
            if (!linkSet.has(key)) {

                linkSet.add(key);

                links.push({
                    source: parentId,
                    target: nodeId
                });
            }
        }

        //--------------------------------
        // 记录最近节点
        //--------------------------------

        lastNode = nodeId;
    }

    return {
        nodes,
        links,
        dimensionColorMap
    };
}