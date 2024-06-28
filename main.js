let actor1 = vtk.Rendering.Core.vtkActor.newInstance();
let actor2 = vtk.Rendering.Core.vtkActor.newInstance();
let fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance();

// Condições iniciais das esferas
let sphere1 = { 
    mass: 1,
    position: {
        x: 0,
        y: 10,
        z: 0
    },
    velocity: {
        x: 0,
        y: 0,
        z: 0
    },
    acc: {
        x: 0,
        y: 0,
        z: 0
    },
    k: 0.9
}

let previousTimestamp = 0
anim()

// timeStamp: number -> tempo percorrido em milisegundos
function anim(timeStamp) {

}

function Update(dt) {
}

function Render(dt) {            
}

function rotateMethod(sphere1, sphere2) {
    let phi = Math.atan2(sphere2.position.y - sphere1.position.y, sphere2.position.x - sphere1.position.x,)

    let u1_xr = sphere1.velocity.magnitude * Math.cos(sphere1.velocity.angle - phi)
    let u1_yr = sphere1.velocity.magnitude * Math.sin(sphere1.velocity.angle - phi)

    let u2_xr = sphere2.velocity.magnitude * Math.cos(sphere2.velocity.angle - phi)
    let u2_yr = sphere2.velocity.magnitude * Math.sin(sphere2.velocity.angle - phi)

    let v1_xr = (u1_xr * (sphere1.mass - sphere2.mass) + 2*sphere2.mass*u2_xr) / (sphere1.mass + sphere2.mass)
    let v2_xr = (u2_xr * (sphere2.mass - sphere1.mass) + 2*sphere1.mass*u1_xr) / (sphere1.mass + sphere2.mass)

    let v1_x = v1_xr*Math.cos(phi) + u1_yr*Math.cos(phi + Math.PI/2)
    let v1_y = v1_xr*Math.sin(phi) + u1_yr*Math.sin(phi + Math.PI/2)
    let v2_x = v2_xr*Math.cos(phi) + u2_yr*Math.cos(phi + Math.PI/2)
    let v2_y = v2_xr*Math.sin(phi) + u2_yr*Math.sin(phi + Math.PI/2)

    sphere1.velocity = {
        magnitude: Math.sqrt(Math.pow(v1_x, 2) + Math.pow(v1_y, 2)),
        angle: Math.atan2(v1_y, v1_x) // https://stackoverflow.com/questions/26592016/calculate-angle-of-triangle-with-sin-or-cos
    }

    sphere2.velocity = {
        magnitude: Math.sqrt(Math.pow(v2_x, 2) + Math.pow(v2_y, 2)),
        angle: Math.atan2(v2_y, v2_x) // https://stackoverflow.com/questions/26592016/calculate-angle-of-triangle-with-sin-or-cos
    }
}
