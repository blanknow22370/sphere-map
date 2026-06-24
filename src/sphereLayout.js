/**
 * 按层级放到不同球层
 */

export function applySphereLayout(nodes) {

    const levelRadiusMap = {
        1: 80,
        2: 220,
        3: 360,
        4: 500
    };

    const groups = {};

    nodes.forEach(node => {

        if (!groups[node.level]) {
            groups[node.level] = [];
        }

        groups[node.level].push(node);
    });

    Object.entries(groups).forEach(([level, arr]) => {

        const radius =
            levelRadiusMap[level] || 600;

        arr.forEach((node, index) => {

            // Fibonacci Sphere

            const phi =
                Math.acos(
                    1 - 2 * ((index + 0.5) / arr.length)
                );

            const theta =
                Math.PI *
                (1 + Math.sqrt(5)) *
                index;

            node.x =
                radius *
                Math.cos(theta) *
                Math.sin(phi);

            node.y =
                radius *
                Math.sin(theta) *
                Math.sin(phi);

            node.z =
                radius *
                Math.cos(phi);
        });
    });

    return nodes;
}