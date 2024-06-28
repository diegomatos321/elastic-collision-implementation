// https://studiofreya.com/3d-math-and-physics/simple-sphere-sphere-collision-detection-and-collision-response/
export default function colidiuEsfera(esfera1, esfera2) {
    const distance = {
        x: esfera2.position.x - esfera1.position.x,
        y: esfera2.position.y - esfera1.position.y,
        z: esfera2.position.z - esfera1.position.z
    }
    const distanceLength = Math.pow(distance.x, 2) + Math.pow(distance.y, 2) + Math.pow(distance.y, 2)
    const sumOfRadius = Math.pow(esfera1.radius + esfera1.radius, 2) // Valores padrão do Vtk

    return distanceLength - sumOfRadius < 0.001 ;
}