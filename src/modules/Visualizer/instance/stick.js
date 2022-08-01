
export default class Stick{
    constructor(point0, point1) {

        this.p0 = point0;
        this.p1 = point1;
        this.defaultColor = 0x999bbc;

        this.length = this.distance(this.p0, this.p1);

    }

    distance(p0, p1) {
        const dx = p1.position.x - p0.position.x;
        const dy = p1.position.y - p0.position.y;
        const dz = p1.position.z - p0.position.z;
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    updateStick() {
        const dx = this.p1.position.x - this.p0.position.x;
        const dy = this.p1.position.y - this.p0.position.y;
        const dz = this.p1.position.z - this.p0.position.z;

        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const difference = this.length - distance;
        const percent = difference / distance / 2;

        const offsetX = (dx * percent);
        const offsetY = (dy * percent);
        const offsetZ = (dz * percent);

        if(!this.p0.locked) {
            this.p0.position.x -= (offsetX);
            this.p0.position.y -= (offsetY);
            this.p0.position.z -= (offsetZ);
        }

        if(!this.p1.locked) {
            this.p1.position.x += offsetX;
            this.p1.position.y += offsetY; 
            this.p1.position.z += offsetZ; 
        }

    }
}