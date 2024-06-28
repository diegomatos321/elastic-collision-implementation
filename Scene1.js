export default class Scene1 {
    sphere = {
        mass: 1,
        k: 1, // Coeficiente de reestituição,
        radius: 0.5, // valor padrão do VTK
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
        vtkActorRef: null
    }
    fullScreenRenderer = null
    previousTimestamp = 0

    constructor() { }

    vtkPipeline() {
        let sphereSource = vtk.Filters.Sources.vtkSphereSource.newInstance();
        sphereSource.setPhiResolution(100)
        sphereSource.setThetaResolution(100)
        
        let mapper = vtk.Rendering.Core.vtkMapper.newInstance();
        mapper.setInputConnection(sphereSource.getOutputPort());

        let actor = vtk.Rendering.Core.vtkActor.newInstance();
        actor.setMapper(mapper);
        actor.setPosition([this.sphere.position.x, this.sphere.position.y, this.sphere.position.z])
        this.sphere.vtkActorRef = actor
        
        let planeSource = vtk.Filters.Sources.vtkPlaneSource.newInstance();
        planeSource.setOrigin(0,0,0);
        planeSource.setPoint1(1,0,0);
        planeSource.setPoint2(0,0,1)
        planeSource.update();
        
        let mapper2 = vtk.Rendering.Core.vtkMapper.newInstance();
        mapper2.setInputConnection(planeSource.getOutputPort());
        
        let actor2 = vtk.Rendering.Core.vtkActor.newInstance();
        actor2.setMapper(mapper2);
        actor2.setPosition([0,1,0])
        
        this.fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance();
        let renderer = this.fullScreenRenderer.getRenderer();
        renderer.addActor(actor);
        renderer.addActor(actor2);
        
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
        this.sphere.vtkActorRef.setPosition([this.sphere.position.x, this.sphere.position.y, this.sphere.position.z])

        var renderWindow = this.fullScreenRenderer.getRenderWindow();
        renderWindow.render();
    }

    Update = (dt) => {
        // console.dir(sphere1)
        let forces = []
        let g = 0.5
        const weightStrength = {
            x: 0, y: -this.sphere.mass*g
        }
        forces.push(weightStrength)
        
        // Imagine um chão na posicao (0, 1)
        let distanceToGround = Math.pow(this.sphere.position.y - 1, 2)
        if (distanceToGround - Math.pow(this.sphere.radius,2) <= 0.001) {
            console.log("Contact Force")

            let penetration = this.sphere.velocity.y
            let contactForce = {
                x: 0,
                y: -this.sphere.k*penetration
            }
            forces.push(contactForce)

            let normalWeight = {
                x: 0,
                y: -weightStrength.y + contactForce.y
            }
            forces.push(normalWeight)
        }
        
        let totalForcesX = 0
        let totalForcesY = 0
        for (let index = 0; index < forces.length; index++) {
            const element = forces[index];
            totalForcesX += element.x
            totalForcesY += element.y
        }
        this.sphere.acc.x = totalForcesX / this.sphere.mass
        this.sphere.acc.y = totalForcesY / this.sphere.mass

        this.sphere.velocity.x += this.sphere.acc.x
        this.sphere.velocity.y += this.sphere.acc.y

        this.sphere.position.x = this.sphere.position.x + this.sphere.velocity.x*dt + this.sphere.acc.x*Math.pow(dt,2)
        this.sphere.position.y = this.sphere.position.y + this.sphere.velocity.y*dt + this.sphere.acc.y*Math.pow(dt,2)
    }
}