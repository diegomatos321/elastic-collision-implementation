import colidiuEsfera from "./CollisionTest.js"

export default class Scene3 {
    sphere1 = {
        mass: 1,
        k: 1, // Coeficiente de reestituição,
        radius: 0.5, // valor padrão do VTK
        position: {
            x: -5,
            y: 2,
            z: 0
        },
        velocity: {
            x: 1,
            y: 0,
            z: 0
        },
        acc: {
            x: 0,
            y: 0,
            z: 0
        },
        vtkActorRef: null
    }
    sphere2 = {
        mass: 1,
        k: 1, // Coeficiente de reestituição,
        radius: 0.5, // valor padrão do VTK
        position: {
            x: 0,
            y: 1.5,
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
        vtkActorRef: null
    }
    fullScreenRenderer = null
    previousTimestamp = 0

    constructor() { }

    vtkPipeline() {
        let sphereSource = vtk.Filters.Sources.vtkSphereSource.newInstance();
        sphereSource.setPhiResolution(100)
        sphereSource.setThetaResolution(100)
        
        let sphereMapper = vtk.Rendering.Core.vtkMapper.newInstance();
        sphereMapper.setInputConnection(sphereSource.getOutputPort());

        let actor = vtk.Rendering.Core.vtkActor.newInstance();
        actor.setMapper(sphereMapper);
        actor.setPosition([this.sphere1.position.x, this.sphere1.position.y, this.sphere1.position.z])
        this.sphere1.vtkActorRef = actor
        
        let planeSource = vtk.Filters.Sources.vtkPlaneSource.newInstance();
        planeSource.setOrigin(0,0,0);
        planeSource.setPoint1(-4,0,1);
        planeSource.setPoint2(2,0,2)
        planeSource.update();
        
        let planeMapper = vtk.Rendering.Core.vtkMapper.newInstance();
        planeMapper.setInputConnection(planeSource.getOutputPort());
        
        let actor2 = vtk.Rendering.Core.vtkActor.newInstance();
        actor2.setMapper(planeMapper);
        actor2.setPosition([0,1,0])

        let actor3 = vtk.Rendering.Core.vtkActor.newInstance();
        actor3.setMapper(sphereMapper)
        actor3.setPosition([this.sphere2.position.x, this.sphere2.position.y, this.sphere2.position.z])
        this.sphere2.vtkActorRef = actor3
        
        this.fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance();
        let renderer = this.fullScreenRenderer.getRenderer();
        renderer.addActor(actor);
        renderer.addActor(actor2);
        renderer.addActor(actor3);
        
        let renderWindow = this.fullScreenRenderer.getRenderWindow();
        renderer.resetCamera();
        renderWindow.render();
    }

    Start() {
        this.vtkPipeline()
        
        window.requestAnimationFrame(this.Anim)
    }

    Anim = (timeStamp) => {
        if (timeStamp === undefined) {
            timeStamp = 0
        }
        const dt = (timeStamp - this.previousTimestamp) / 1000 // Proximo passo da animação em segundos
        this.previousTimestamp = timeStamp

        this.Update(dt)
        this.Render()

        window.requestAnimationFrame(this.Anim)
    }

    Render = () => {
        this.sphere1.vtkActorRef.setPosition([this.sphere1.position.x, this.sphere1.position.y, this.sphere1.position.z])
        this.sphere2.vtkActorRef.setPosition([this.sphere2.position.x, this.sphere2.position.y, this.sphere2.position.z])

        var renderWindow = this.fullScreenRenderer.getRenderWindow();
        renderWindow.render();
    }

    Update = (dt) => {
        // console.dir(sphere1)
        // Forças atuando no objeto 1
        let forces1 = []
        // Forças atuando no objeto 2
        let forces2 = []
        
        if (colidiuEsfera(this.sphere1, this.sphere2)) {
            let normal = {
                x: this.sphere1.position.x - this.sphere2.position.x,
                y: this.sphere1.position.y - this.sphere2.position.y
            }
            let normalLength = Math.sqrt(Math.pow(normal.x, 2) + Math.pow(normal.y, 2))
            normal.x /= normalLength
            normal.y /= normalLength

            let penetration1 = {
                x: this.sphere1.velocity.x - this.sphere2.velocity.x,
                y: this.sphere1.velocity.y - this.sphere2.velocity.y
            }

            let contactMagnitude = -this.sphere1.k * (penetration1.x*normal.x + penetration1.y*normal.y ) // Isso é um escalar
            let contactForce = {
                x: normal.x * contactMagnitude,
                y: normal.y * contactMagnitude
            }
            forces1.push(contactForce)

            let contactForce2 = {
                x: -normal.x * contactMagnitude,
                y: -normal.y * contactMagnitude
            }
            forces2.push(contactForce2)
        }
        
        let totalForces1X = 0
        let totalForces1Y = 0
        for (let index = 0; index < forces1.length; index++) {
            const element = forces1[index];
            totalForces1X += element.x
            totalForces1Y += element.y
        }
        this.sphere1.acc.x = totalForces1X / this.sphere1.mass
        this.sphere1.acc.y = totalForces1Y / this.sphere1.mass

        this.sphere1.velocity.x += this.sphere1.acc.x
        this.sphere1.velocity.y += this.sphere1.acc.y

        this.sphere1.position.x = this.sphere1.position.x + this.sphere1.velocity.x*dt + this.sphere1.acc.x*Math.pow(dt,2)
        this.sphere1.position.y = this.sphere1.position.y + this.sphere1.velocity.y*dt + this.sphere1.acc.y*Math.pow(dt,2)


        let totalForces2X = 0
        let totalForces2Y = 0
        for (let index = 0; index < forces2.length; index++) {
            const element = forces2[index];
            totalForces2X += element.x
            totalForces2Y += element.y
        }
        this.sphere2.acc.x = totalForces2X / this.sphere2.mass
        this.sphere2.acc.y = totalForces2Y / this.sphere2.mass

        this.sphere2.velocity.x += this.sphere2.acc.x
        this.sphere2.velocity.y += this.sphere2.acc.y

        this.sphere2.position.x = this.sphere2.position.x + this.sphere2.velocity.x*dt + this.sphere2.acc.x*Math.pow(dt,2)
        this.sphere2.position.y = this.sphere2.position.y + this.sphere2.velocity.y*dt + this.sphere2.acc.y*Math.pow(dt,2)

    }
}