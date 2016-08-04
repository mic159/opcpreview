import {mat4, vec3, vec4} from 'gl-matrix';

/*
 * Thin wrapper over the gl-matrix library for a nicer API.
 */


export class Matrix {
  constructor(m) {
    this.m = m || mat4.create();
  }
  identity() {
    mat4.identity(this.m);
    return this;
  }
  rotateX(rotation) {
    mat4.rotateX(this.m, this.m, rotation);
    return this;
  }
  rotateY(rotation) {
    mat4.rotateY(this.m, this.m, rotation);
    return this;
  }
  rotateZ(rotation) {
    mat4.rotateZ(this.m, this.m, rotation);
    return this;
  }
  multiply(rhs) {
    this.m = mat4.multiply(mat4.create(), rhs.m, this.m);
    return this;
  }
  static lookAt(position, origin, up) {
    return new Matrix(
      mat4.lookAt(mat4.create(), position.v, origin.v, up.v)
    );
  }
  static perspective(fovy, aspect, near, far) {
    return new Matrix(
      mat4.perspective(mat4.create(), fovy, aspect, near, far)
    );
  }
}


export class Vector {
  constructor(x, y, z) {
    this.v = vec3.fromValues(x || 0, y || 0, z || 0);
  }
  transform(matrix) {
    vec3.transformMat4(this.v, this.v, matrix.m);
    return this;
  }
}


export class Vector4 {
  constructor(x, y, z, w) {
    this.v = vec4.fromValues(x || 0, y || 0, z || 0, w || 1);
  }
  transform(matrix) {
    vec4.transformMat4(this.v, this.v, matrix.m);
    return this;
  }
  toVec3() {
    return new Vector(
      this.v[0]/this.v[3],
      this.v[1]/this.v[3],
      this.v[2]/this.v[3]
    );
  }
}
