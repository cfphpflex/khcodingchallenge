
function enableLineAnimation(layerId) {
    var step = 0;
    let dashArraySeq = [
        [0, 4, 3],
        [1, 4, 2],
        [2, 4, 1],
        [3, 4, 0],
        [0, 1, 3, 3],
        [0, 2, 3, 2],
        [0, 3, 3, 1]
    ];
    setInterval(() => {
        step = (step + 1) % dashArraySeq.length;
        map.setPaintProperty(layerId, 'line-dasharray', dashArraySeq[step]);
    }, animationStep);
}