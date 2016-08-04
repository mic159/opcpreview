import {mat4, vec3, vec4, quat} from 'gl-matrix';


export function generateCube(width, outerWidth) {
  const hsize = width / 2.0; // Center of the outer lights
  const houtersize = outerWidth / 2.0; // Outer size of the cube
  function generateFace(matrix) {
    let result = [];
    for (let x = 0; x < 8; ++x) {
      for (let y = 0; y < 8; ++y) {
        const point = [
          hsize * ((x - 3.5) / 3.5), //x
          hsize * ((y - 3.5) / 3.5), //y
          0 //z
        ];
        // Apply matrix and append
        result.push({
          point: vec3.round([0,0,0], vec3.transformMat4(vec3.create(), point, matrix))
        });
      }
    }
    return result;
  }
  function tmatrix(translate, rotateAxis, rotateAngle) {
    if (rotateAxis === undefined) {
      return mat4.translate(mat4.create(), mat4.create(), translate);
    }
    return mat4.fromRotationTranslation(
      mat4.create(),
      quat.setAxisAngle(quat.create(), rotateAxis, rotateAngle),
      translate
    );
  }
  return [].concat(
    generateFace(tmatrix([0, 0,  houtersize])),
    generateFace(tmatrix([ houtersize, 0, 0], [0, 1, 0], Math.PI/2)),
    generateFace(tmatrix([0, 0, -houtersize], [0, 1, 0], Math.PI)),
    generateFace(tmatrix([-houtersize, 0, 0], [0, 1, 0], 3*Math.PI/2)),
    generateFace(tmatrix([0,  houtersize, 0], [1, 0, 0], Math.PI/2)),
    generateFace(tmatrix([0, -houtersize, 0], [1, 0, 0], 3*Math.PI/2))
  );
}
